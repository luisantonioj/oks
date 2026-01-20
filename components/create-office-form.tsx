// components/create-office-form.tsx
"use client";

import { cn } from "@/lib/utils";
import { createOffice } from "@/app/actions/auth";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function CreateOfficeForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(createOffice, {});

  useEffect(() => {
    if (state?.success) {
      // Reset form or redirect after success
      const timer = setTimeout(() => {
        router.push('/admin/dashboard');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state?.success, router]);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Office Account Details</CardTitle>
          <CardDescription>
            Create a new office account for crisis management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            {/* Office Name (dropdown) */}
            <div className="grid gap-2">
              <Label htmlFor="office_name">Office Name *</Label>
              <Select name="office_name" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select office" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CIO">Community Involvement Office (CIO)</SelectItem>
                  <SelectItem value="ISESSO">ISESSO</SelectItem>
                  <SelectItem value="ICTC">ICTC</SelectItem>
                </SelectContent>
              </Select>
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

            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="office@dlsl.edu.ph"
                required
              />
            </div>

            {/* Password */}
            <div className="grid gap-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
              />
            </div>

            {/* Age */}
            <div className="grid gap-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                name="age"
                type="number"
                min="18"
                max="100"
              />
            </div>

            {/* Gender */}
            <div className="grid gap-2">
              <Label htmlFor="gender">Gender</Label>
              <Select name="gender">
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
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

            {/* Error / Success Messages */}
            {state?.error && (
              <div className="p-3 rounded bg-destructive/10 border border-destructive text-sm text-destructive">
                {state.error}
              </div>
            )}
            {state?.message && (
              <div className="p-3 rounded bg-green-50 border border-green-200 text-sm text-green-600">
                {state.message}
              </div>
            )}

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Creating account..." : "Create Office Account"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}