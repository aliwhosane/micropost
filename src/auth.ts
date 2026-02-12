import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import Credentials from "next-auth/providers/credentials";
import Twitter from "next-auth/providers/twitter";
import LinkedIn from "next-auth/providers/linkedin";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { authConfig } from "./auth.config";

async function getUser(email: string) {
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        return user;
    } catch (error) {
        console.error("Failed to fetch user:", error);
        throw new Error("Failed to fetch user.");
    }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
    ...authConfig,
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    trustHost: true,
    basePath: "/api/auth",
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    const user = await getUser(email);
                    if (!user) return null;

                    const passwordsMatch = await bcrypt.compare(password, user.password || "");
                    if (passwordsMatch) return user;
                }
                console.log("Invalid credentials");
                return null;
            },
        }),
        Twitter({
            clientId: process.env.AUTH_TWITTER_ID?.trim(),
            clientSecret: process.env.AUTH_TWITTER_SECRET?.trim(),
            // Request offline access to post on behalf of the user later
            authorization: {
                url: "https://twitter.com/i/oauth2/authorize",
                params: {
                    scope: "users.read tweet.read tweet.write offline.access",
                },
            },
        }),
        LinkedIn({
            clientId: process.env.AUTH_LINKEDIN_ID,
            clientSecret: process.env.AUTH_LINKEDIN_SECRET,
            authorization: {
                params: {
                    scope: "openid profile email w_member_social",
                },
            },
        }),
        {
            id: "threads",
            name: "Threads",
            type: "oauth",
            authorization: {
                url: "https://threads.net/oauth/authorize",
                params: {
                    scope: "threads_basic threads_content_publish",
                    response_type: "code",
                },
            },
            token: {
                url: `${process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_BASE_URL}/api/auth/threads/token`,
            },
            client: {
                token_endpoint_auth_method: "client_secret_post",
            },
            userinfo: {
                url: "https://graph.threads.net/me",
                params: {
                    fields: "id,username,name,picture_url",
                },
            },
            clientId: process.env.AUTH_THREADS_ID,
            clientSecret: process.env.AUTH_THREADS_SECRET,
            profile(profile: any) {
                return {
                    id: profile.id,
                    name: profile.username || profile.name,
                    image: profile.picture_url,
                };
            },
        },
    ],
    callbacks: {
        ...authConfig.callbacks,
        async signIn({ user, account }) {
            if (account?.provider === "threads" && account.access_token) {
                try {
                    // Exchange short-lived token for long-lived token (60 days)
                    const response = await fetch(`https://graph.threads.net/access_token?grant_type=th_exchange_token&client_secret=${process.env.AUTH_THREADS_SECRET}&access_token=${account.access_token}`);
                    const data = await response.json();

                    if (data.access_token) {
                        console.log("Exchanged Threads token for long-lived token");
                        (account as any).access_token = data.access_token;
                        (account as any).expires_at = Math.floor(Date.now() / 1000) + (data.expires_in || 5184000);
                    }
                } catch (e) {
                    console.error("Failed to exchange Threads token", e);
                }
            }
            return true;
        },
    },
    events: {
        async linkAccount({ user, account, profile }) {
            try {
                // 1. Capture Metadata
                const p = profile as any;
                let accountName = p.name || p.username || p.login; // GitHub uses login
                let accountImage = p.image || p.picture || p.avatar_url;

                // Provider specific mapping if needed
                if (account.provider === "linkedin") {
                    // LinkedIn profile structure might vary, but 'name' and 'picture' are standard OIDC
                }

                // 2. Check for Client Context cookie
                const { cookies } = await import("next/headers");
                const cookieStore = await cookies();
                const clientId = cookieStore.get("micropost_connecting_client_id")?.value;

                // 3. Update the Account record
                // We use any cast for data because Prisma types might lag behind schema updates in IDE
                await prisma.account.update({
                    where: {
                        provider_providerAccountId: {
                            provider: account.provider,
                            providerAccountId: account.providerAccountId
                        }
                    },
                    data: {
                        accountName: accountName,
                        accountImage: accountImage,
                        clientProfileId: clientId || null
                    } as any
                });

                console.log(`Linked ${account.provider} account for user ${user.id}. Client: ${clientId || "Personal"}`);

                // Clear the cookie
                if (clientId) {
                    cookieStore.delete("micropost_connecting_client_id");
                }

            } catch (error) {
                console.error("Error in linkAccount event:", error);
            }
        }
    }
});
