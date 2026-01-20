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
      const timer = setTimeout(() => {
        router.push("/admin/dashboard");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state?.success, router]);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Create Office Staff Account</CardTitle>
          <CardDescription>
            Add a new staff member to manage crisis operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            {/* Office Name */}
            <div className="grid gap-2">
              <Label htmlFor="office_name">Office Name *</Label>
              <Select name="office_name" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select office" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CIO">
                    Community Involvement Office (CIO)
                  </SelectItem>
                  <SelectItem value="ISESSO">
                    Institutional Safety, Security, and Emergency Services Office
                    (ISESSO)
                  </SelectItem>
                  <SelectItem value="ICTC">
                    Information and Communication Technologies Center (ICTC)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Full Name */}
            <div className="grid gap-2">
              <Label htmlFor="name">Staff Full Name *</Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                placeholder="e.g., Juan Dela Cruz"
              />
            </div>

            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="staff.email@dlsl.edu.ph"
              />
              <p className="text-xs text-muted-foreground">
                This will be used for login
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
                minLength={6}
                placeholder="Minimum 6 characters"
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
