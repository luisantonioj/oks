// app/(main)/office/dashboard/page.tsx
import { getCurrentUserProfile } from "@/lib/queries/user";
import { redirect } from "next/navigation";

export default async function OfficeDashboard() {
  const profile = await getCurrentUserProfile();

  if (!profile || profile.role !== 'office') {
    redirect('/login-office');
  }

  return (
    <div className="flex flex-col gap-8 p-6">
      <div>
        <h1 className="text-3xl font-bold">Office Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome, {profile.name} - {(profile as any).office_name}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Crisis Management</h2>
          <p className="text-sm text-muted-foreground">
            Create and manage crisis information
          </p>
        </div>

        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Announcements</h2>
          <p className="text-sm text-muted-foreground">
            Send announcements to stakeholders
          </p>
        </div>

        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Help Requests</h2>
          <p className="text-sm text-muted-foreground">
            View and respond to emergency requests
          </p>
        </div>

        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Donations</h2>
          <p className="text-sm text-muted-foreground">
            Manage donation tracking
          </p>
        </div>

        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Volunteers</h2>
          <p className="text-sm text-muted-foreground">
            Coordinate volunteer assignments
          </p>
        </div>

        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Reports</h2>
          <p className="text-sm text-muted-foreground">
            Generate progress reports
          </p>
        </div>
      </div>
    </div>
  );
}