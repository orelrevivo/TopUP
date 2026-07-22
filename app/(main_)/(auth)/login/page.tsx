"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "~/hooks/useAuth";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "~/components/ui/Card";
import BackgroundRays from "~/components/ui/BackgroundRays";
import { TextShimmer } from "~/components/ui/text-shimmer";
import { GoogleLogin } from "@react-oauth/google";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [loginUri, setLoginUri] = useState("");

    useEffect(() => {
        setLoginUri(window.location.origin + "/api/auth/google");
    }, []);

    const { login, loginWithGoogle } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);
        const result = await login(email, password);
        setSubmitting(false);
        if (result.error) {
            setError(result.error);
        } else {
            router.push("/");
        }
    };

    return (
        <div className="">
            <BackgroundRays />
            <Card className="w-[400px] mx-4 relative z-10">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <img src="/logo-light-styled.png" alt="Falbor" className="w-24 inline-block dark:hidden" />
                        <img src="/logo-dark-styled.png" alt="Falbor" className="w-24 inline-block hidden dark:block" />
                    </div>
                    <CardTitle>Welcome back</CardTitle>
                    <CardDescription><TextShimmer as="span">Log in to your account to continue</TextShimmer></CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        {error && (
                            <div className="text-sm text-red-500 bg-red-500/10 rounded-md px-3 py-2">{error}</div>
                        )}
                        <div className="space-y-2">
                            <label className="text-sm text-falbor-elements-textSecondary">Email</label>
                            <Input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoFocus
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-falbor-elements-textSecondary">Password</label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex-col gap-3">
                        <Button type="submit" variant="outline" className="w-full" disabled={submitting}>
                            {submitting ? "Logging in..." : "Log in"}
                        </Button>
                        <div className="relative w-full py-2 flex items-center justify-center">
                            <div className="border-t border-falbor-elements-border flex-grow"></div>
                            <span className="bg-falbor-elements-background-depth-1 px-3 text-xs text-falbor-elements-textSecondary">OR</span>
                            <div className="border-t border-falbor-elements-border flex-grow"></div>
                        </div>
                        <div className="w-full flex justify-center h-[40px]">
                            {loginUri && (
                                <GoogleLogin
                                    ux_mode="redirect"
                                    login_uri={loginUri}
                                    useOneTap
                                    onSuccess={() => { }}
                                />
                            )}
                        </div>
                        <p className="text-sm text-falbor-elements-textSecondary mt-2">
                            Don&apos;t have an account?{" "}
                            <Link href="/signup" className="text-accent-500 hover:underline">
                                Sign up
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
