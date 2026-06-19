// components/sign-up-form-enhanced.tsx
"use client";

import { cn } from "@/lib/utils";
import { signUpStakeholder } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function SignUpFormEnhanced({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [state, formAction, isPending] = useActionState(signUpStakeholder, {});
  const [isGooglePending, setIsGooglePending] = useState(false);
  const searchParams = useSearchParams();

  const errorParam = searchParams.get("error");
  const messageParam = searchParams.get("message");

  let errorDisplay = state?.error;
  if (errorParam) {
    if (errorParam === "dlsl_email_required") {
      errorDisplay = "Only DLSL (@dlsl.edu.ph) email addresses are allowed.";
    } else if (errorParam === "profile_creation_failed") {
      errorDisplay = `Failed to create profile: ${messageParam || "Unknown error"}`;
    } else {
      errorDisplay = messageParam || "Registration failed. Please try again.";
    }
  }

  const handleGoogleSignUp = async () => {
    try {
      setIsGooglePending(true);
      const supabase = createClient();
      const redirectTo = `${window.location.origin}/callback?role=stakeholder`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
        },
      });
      if (error) {
        setIsGooglePending(false);
        console.error("Google Sign-Up Error:", error);
      }
    } catch (err) {
      setIsGooglePending(false);
      console.error("Google Sign-Up Error:", err);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Sign up</CardTitle>
          <CardDescription>
            Create your stakeholder account for OKS!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@dlsl.edu.ph"
                required
                autoComplete="email"
              />
              <p className="text-xs text-muted-foreground">
                Must be a valid DLSL email address
              </p>
            </div>

            {/* Password */}
            <div className="grid gap-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="new-password"
                minLength={6}
              />
            </div>

            {/* Full Name */}
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Juan Dela Cruz"
              />
            </div>

            {/* Error / Success Messages */}
            {errorDisplay && (
              <div className="p-3 rounded bg-destructive/10 border border-destructive text-sm text-destructive text-center">
                {errorDisplay}
              </div>
            )}
            {state?.message && (
              <div className="p-3 rounded bg-green-50 border border-green-200 text-sm text-green-600 text-center">
                {state.message}
              </div>
            )}

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isPending || isGooglePending}>
              {isPending ? "Creating account..." : "Sign up"}
            </Button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center gap-2 border-border hover:bg-accent hover:text-foreground transition-all duration-200"
            disabled={isPending || isGooglePending}
            onClick={handleGoogleSignUp}
          >
            <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                fill="#EA4335"
              />
            </svg>
            {isGooglePending ? "Connecting..." : "Google"}
          </Button>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="underline underline-offset-4 hover:text-primary">
              Login
            </Link>
          </div>
          <div className="mt-4 text-center text-sm">
            <Link href="/" className="underline underline-offset-4 text-muted-foreground hover:text-primary">
              Back to home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}