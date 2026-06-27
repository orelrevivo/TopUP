"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "~/hooks/useAuth";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "~/components/ui/Card";
import BackgroundRays from "~/components/ui/BackgroundRays";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setSubmitting(true);
    const result = await register(email, password);
    setSubmitting(false);

    if (result.error) {
      setError(result.error);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bolt-elements-background-depth-1 relative">
      <BackgroundRays />
      <Card className="w-full max-w-md mx-4 relative z-10">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img src="/logo-light-styled.png" alt="Bolt" className="w-24 inline-block dark:hidden" />
            <img src="/logo-dark-styled.png" alt="Bolt" className="w-24 inline-block hidden dark:block" />
          </div>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>Sign up to start building with Bolt</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="text-sm text-red-500 bg-red-500/10 rounded-md px-3 py-2">{error}</div>
            )}
            <div className="space-y-2">
              <label className="text-sm text-bolt-elements-textSecondary">Email</label>
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
              <label className="text-sm text-bolt-elements-textSecondary">Password</label>
              <Input
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-bolt-elements-textSecondary">Confirm password</label>
              <Input
                type="password"
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-3">
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Creating account..." : "Create account"}
            </Button>
            <p className="text-sm text-bolt-elements-textSecondary">
              Already have an account?{" "}
              <Link href="/login" className="text-accent-500 hover:underline">
                Log in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
