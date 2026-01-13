import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { auth } from "@/auth";
import { UserButton } from "@/components/dashboard/UserButton";

export async function Navbar() {
    const session = await auth();
    const user = session?.user;

    return (
        <header className="px-6 h-16 flex items-center justify-between border-b border-outline-variant/20 backdrop-blur-xl sticky top-0 z-50 bg-background/80">
            <div className="flex items-center gap-2">
                <Link href={user ? "/dashboard" : "/"}>
                    <BrandLogo size="lg" />
                </Link>
            </div>
            <div className="flex gap-4 items-center">
                {user ? (
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard">
                            <Button variant="text" size="sm" className="hidden md:flex">Dashboard</Button>
                        </Link>
                        <UserButton user={user} />
                    </div>
                ) : (
                    <>
                        <Link href="/login" className="hidden md:block">
                            <Button variant="text" size="sm">Log in</Button>
                        </Link>
                        <Link href="/login">
                            <Button size="sm" className="rounded-full">Get Started</Button>
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
}
