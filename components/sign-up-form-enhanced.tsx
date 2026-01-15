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
import { useActionState } from "react";

export function SignUpFormEnhanced({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [state, formAction, isPending] = useActionState(signUpStakeholder, {});

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

            {/* Age */}
            <div className="grid gap-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                name="age"
                type="number"
                min={1}
                max={150}
                placeholder="18"
              />
            </div>

            {/* Community - Using native select */}
            <div className="grid gap-2">
              <Label htmlFor="community">Community</Label>
              <select
                id="community"
                name="community"
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select your community</option>
                <option value="college">College</option>
                <option value="shs">Senior High School</option>
                <option value="jhs">Junior High School</option>
                <option value="gs">Grade School</option>
                <option value="preschool">Preschool</option>
              </select>
            </div>

            {/* Contact */}
            <div className="grid gap-2">
              <Label htmlFor="contact">Contact Number</Label>
              <Input
                id="contact"
                name="contact"
                type="tel"
                placeholder="+63 912 345 6789"
              />
            </div>

            {/* Permanent Address */}
            <div className="grid gap-2">
              <Label htmlFor="permanent_address">Permanent Address</Label>
              <Input
                id="permanent_address"
                name="permanent_address"
                type="text"
                placeholder="123 Main St, Lipa City, Batangas"
              />
            </div>

            {/* Current Address */}
            <div className="grid gap-2">
              <Label htmlFor="current_address">Current Address</Label>
              <Input
                id="current_address"
                name="current_address"
                type="text"
                placeholder="Dormitory/Boarding house address"
              />
            </div>

            {/* Error/Success Messages */}
            {state?.error && (
              <div className="p-3 rounded bg-destructive/10 border border-destructive">
                <p className="text-sm text-destructive">{state.error}</p>
              </div>
            )}
            {state?.message && (
              <div className="p-3 rounded bg-green-50 border border-green-200">
                <p className="text-sm text-green-600">{state.message}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Creating account..." : "Sign up"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/auth/login" className="underline underline-offset-4">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}