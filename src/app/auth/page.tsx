"use client";

import { useState, Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";
import { Sparkles } from "lucide-react";
import { registerUser } from "@/lib/actions";

// ─── Google SVG Icon ────────────────────────────────────────────────
function GoogleIcon() {
    return (
        <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" viewBox="0 0 24 24">
            <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
            />
            <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
            />
            <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
            />
            <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
            />
        </svg>
    );
}

// ─── Password Strength Indicator ────────────────────────────────────
function PasswordStrength({ password }: { password: string }) {
    const { level, label, color, width } = useMemo(() => {
        if (password.length === 0) return { level: 0, label: "", color: "", width: "0%" };
        if (password.length < 6) return { level: 1, label: "Too short", color: "bg-error", width: "33%" };
        if (password.length < 8 || !/\d/.test(password))
            return { level: 2, label: "Getting there", color: "bg-tertiary", width: "66%" };
        return { level: 3, label: "Strong password!", color: "bg-secondary", width: "100%" };
    }, [password]);

    if (password.length === 0) return null;

    return (
        <div className="mt-1.5 space-y-1">
            <div className="h-1 w-full rounded-full bg-surface-variant/50 overflow-hidden">
                <motion.div
                    className={`h-full rounded-full ${color}`}
                    initial={{ width: 0 }}
                    animate={{ width }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                />
            </div>
            <p className={`text-xs ${level === 1 ? "text-error" : level === 2 ? "text-tertiary" : "text-secondary"}`}>
                {label}
            </p>
        </div>
    );
}

// ─── Divider ────────────────────────────────────────────────────────
function Divider({ text }: { text: string }) {
    return (
        <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-outline-variant" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-surface px-2 text-on-surface-variant">{text}</span>
            </div>
        </div>
    );
}

// ─── Tab Types ──────────────────────────────────────────────────────
type AuthTab = "signin" | "signup";

const tabs: { key: AuthTab; label: string }[] = [
    { key: "signin", label: "Sign In" },
    { key: "signup", label: "Sign Up" },
];

// ─── Content Animations ─────────────────────────────────────────────
const contentVariants = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
};

// ─── Main Auth Form ─────────────────────────────────────────────────
function AuthForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const registered = searchParams.get("registered");
    const initialTab = searchParams.get("tab") === "signup" ? "signup" : "signin";

    const [activeTab, setActiveTab] = useState<AuthTab>(initialTab);

    // Sign In state
    const [signInEmail, setSignInEmail] = useState("");
    const [signInPassword, setSignInPassword] = useState("");
    const [signInLoading, setSignInLoading] = useState(false);

    // Sign Up state
    const [signUpName, setSignUpName] = useState("");
    const [signUpEmail, setSignUpEmail] = useState("");
    const [signUpPassword, setSignUpPassword] = useState("");
    const [signUpLoading, setSignUpLoading] = useState(false);

    // ─── Handlers ───────────────────────────────────────────────────
    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setSignInLoading(true);

        const res = await signIn("credentials", {
            email: signInEmail,
            password: signInPassword,
            redirect: false,
        });

        setSignInLoading(false);

        if (res?.ok) {
            router.push("/dashboard");
        } else {
            toast.error("Invalid email or password. Please try again.");
        }
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setSignUpLoading(true);

        try {
            const formData = new FormData();
            formData.append("name", signUpName);
            formData.append("email", signUpEmail);
            formData.append("password", signUpPassword);

            await registerUser(formData);

            // Auto-login after registration
            const res = await signIn("credentials", {
                email: signUpEmail,
                password: signUpPassword,
                redirect: false,
            });

            if (res?.ok) {
                router.push("/dashboard");
            } else {
                toast.error("Account created but auto-login failed. Please sign in.");
                setActiveTab("signin");
            }
        } catch (err: any) {
            toast.error(err.message || "Something went wrong during registration.");
        } finally {
            setSignUpLoading(false);
        }
    };

    const handleGoogleSignIn = () => {
        signIn("google", { callbackUrl: "/dashboard" });
    };

    // ─── Render ─────────────────────────────────────────────────────
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
            {/* Ambient blur orbs */}
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-tertiary/5 rounded-full blur-[100px]" />

            <Card className="w-full max-w-md border-outline-variant shadow-lg z-10">
                <CardHeader className="text-center space-y-2 pb-2">
                    {/* Brand Icon */}
                    <div className="mx-auto h-10 w-10 rounded-xl bg-primary flex items-center justify-center mb-2">
                        <Sparkles className="h-6 w-6 text-on-primary" />
                    </div>

                    <CardTitle className="text-2xl font-bold">
                        {activeTab === "signin" ? "Welcome back" : "Create your account"}
                    </CardTitle>
                    <p className="text-on-surface-variant text-sm">
                        {activeTab === "signin"
                            ? "Sign in to continue to MicroPost AI"
                            : "Get started with MicroPost AI"}
                    </p>

                    {/* Registered success banner */}
                    {registered && (
                        <div className="bg-secondary/10 text-secondary text-sm p-3 rounded-lg mt-2 font-medium">
                            Account created successfully! Please sign in.
                        </div>
                    )}

                    {/* ─── Tab Switcher ─────────────────────────────── */}
                    <div className="flex mt-4 bg-surface-variant/30 rounded-xl p-1 relative">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`relative z-10 flex-1 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                                    activeTab === tab.key
                                        ? "text-on-surface"
                                        : "text-on-surface-variant hover:text-on-surface"
                                }`}
                            >
                                {activeTab === tab.key && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-surface rounded-lg shadow-sm"
                                        transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                                    />
                                )}
                                <span className="relative z-10">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </CardHeader>

                <CardContent className="pt-4">
                    <AnimatePresence mode="wait">
                        {activeTab === "signin" ? (
                            <motion.div
                                key="signin"
                                variants={contentVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={{ duration: 0.2 }}
                            >
                                {/* Google OAuth */}
                                <Button
                                    variant="outlined"
                                    className="w-full"
                                    onClick={handleGoogleSignIn}
                                    type="button"
                                >
                                    <GoogleIcon />
                                    Continue with Google
                                </Button>

                                <Divider text="or continue with email" />

                                {/* Credentials form */}
                                <form onSubmit={handleSignIn} className="space-y-4">
                                    <Input
                                        label="Email"
                                        type="email"
                                        value={signInEmail}
                                        onChange={(e) => setSignInEmail(e.target.value)}
                                        required
                                    />
                                    <Input
                                        label="Password"
                                        type="password"
                                        value={signInPassword}
                                        onChange={(e) => setSignInPassword(e.target.value)}
                                        required
                                    />
                                    <Button type="submit" className="w-full" size="lg" isLoading={signInLoading}>
                                        Sign In
                                    </Button>
                                </form>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="signup"
                                variants={contentVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={{ duration: 0.2 }}
                            >
                                {/* Google OAuth */}
                                <Button
                                    variant="outlined"
                                    className="w-full"
                                    onClick={handleGoogleSignIn}
                                    type="button"
                                >
                                    <GoogleIcon />
                                    Continue with Google
                                </Button>

                                <Divider text="or create with email" />

                                {/* Registration form */}
                                <form onSubmit={handleSignUp} className="space-y-4">
                                    <Input
                                        label="Name"
                                        type="text"
                                        value={signUpName}
                                        onChange={(e) => setSignUpName(e.target.value)}
                                        required
                                    />
                                    <Input
                                        label="Email"
                                        type="email"
                                        value={signUpEmail}
                                        onChange={(e) => setSignUpEmail(e.target.value)}
                                        required
                                    />
                                    <div>
                                        <Input
                                            label="Password"
                                            type="password"
                                            value={signUpPassword}
                                            onChange={(e) => setSignUpPassword(e.target.value)}
                                            required
                                        />
                                        <PasswordStrength password={signUpPassword} />
                                    </div>
                                    <Button type="submit" className="w-full" size="lg" isLoading={signUpLoading}>
                                        Create Account
                                    </Button>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>

                <CardFooter className="justify-center">
                    <p className="text-sm text-on-surface-variant">
                        {activeTab === "signin" ? (
                            <>
                                Don&apos;t have an account?{" "}
                                <button
                                    onClick={() => setActiveTab("signup")}
                                    className="text-primary hover:underline font-medium"
                                >
                                    Sign up
                                </button>
                            </>
                        ) : (
                            <>
                                Already have an account?{" "}
                                <button
                                    onClick={() => setActiveTab("signin")}
                                    className="text-primary hover:underline font-medium"
                                >
                                    Sign in
                                </button>
                            </>
                        )}
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}

// ─── Page Export (Suspense boundary for useSearchParams) ─────────────
export default function AuthPage() {
    return (
        <Suspense>
            <AuthForm />
        </Suspense>
    );
}
