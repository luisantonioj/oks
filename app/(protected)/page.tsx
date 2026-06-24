import { redirect } from "next/navigation";

import { getCurrentUserProfile } from "@/lib/queries/user";
import { dashboardRouteForRole, routes } from "@/lib/routes";

export default async function ProtectedPage() {
  const profile = await getCurrentUserProfile();

  if (!profile) {
    redirect(routes.auth.login.stakeholder);
  }

  redirect(dashboardRouteForRole(profile.role));
}
