"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";
import { Sparkles, Linkedin, Twitter } from "lucide-react";
import { signIn } from "next-auth/react"; // Client side sign in? No, we should use server actions or regular form if credential.
// For simplicity in this demo, I will use a simple form that submits to the callback.
// Actually, using `next-auth/react` `signIn` method is easiest.

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const registered = searchParams.get("registered");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Note: Credentials provider sign-in
        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        setLoading(false);

        if (res?.ok) {
            router.push("/dashboard");
        } else {
            alert("Invalid credentials. (Check console for now)");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-tertiary/5 rounded-full blur-[100px]" />

            <Card className="w-full max-w-md border-outline-variant shadow-lg z-10">
                <CardHeader className="text-center space-y-2">
                    <div className="mx-auto h-10 w-10 rounded-xl bg-primary flex items-center justify-center mb-2">
                        <Sparkles className="h-6 w-6 text-on-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
                    <p className="text-on-surface-variant">Sign in to your account</p>
                    {registered && (
                        <div className="bg-green-50 text-green-600 text-sm p-3 rounded-md mt-2">
                            Account created! Please log in.
                        </div>
                    )}
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Input
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <div className="text-right">
                            <Link href="#" className="text-sm text-primary hover:underline">Forgot password?</Link>
                        </div>
                        <Button type="submit" className="w-full" size="lg" isLoading={loading}>
                            Sign In
                        </Button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-outline-variant" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-surface px-2 text-on-surface-variant">Or continue with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Button variant="outlined">
                            <Linkedin className="mr-2 h-4 w-4" /> LinkedIn
                        </Button>
                        <Button variant="outlined">
                            <Twitter className="mr-2 h-4 w-4" /> Twitter
                        </Button>
                    </div>
                </CardContent>
                <CardFooter className="justify-center">
                    <p className="text-sm text-on-surface-variant">
                        Don't have an account? <Link href="/signup" className="text-primary hover:underline font-medium">Sign up</Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense>
            <LoginForm />
        </Suspense>
    );
}
