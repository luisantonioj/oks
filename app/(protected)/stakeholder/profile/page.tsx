// app/(protected)/stakeholder/profile/page.tsx
import { getCurrentUserProfile } from "@/lib/queries/user";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function StakeholderProfile() {
  const profile = await getCurrentUserProfile();

  if (!profile || profile.role !== "stakeholder") {
    redirect("/login");
  }

  const name = profile.name ?? "Stakeholder";
  const firstName = name.split(" ")[0];
  const p = profile as any;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage your personal information and account settings.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">

        {/* ── Left: Identity card ── */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-2xl p-6 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-muted border-2 border-border flex items-center justify-center text-2xl font-bold text-muted-foreground mb-4">
              {firstName[0]?.toUpperCase()}
            </div>
            <p className="text-base font-bold">{name}</p>
            <p className="text-xs text-muted-foreground mt-0.5 mb-3">{profile.email}</p>
            <span className="text-xs font-medium bg-muted text-muted-foreground border border-border px-2.5 py-1 rounded-full">
              Stakeholder
            </span>
            {p.community && (
              <span className="text-xs font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded-full mt-2 capitalize">
                {p.community}
              </span>
            )}
          </div>

          {/* Quick links */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-border">
              <p className="text-sm font-semibold">Quick Links</p>
            </div>
            <div className="p-3 space-y-1">
              {[
                { label: "Dashboard", href: "/stakeholder/dashboard", icon: "📊" },
                { label: "My Requests", href: "/stakeholder/help-requests", icon: "🆘" },
                { label: "Announcements", href: "/stakeholder/announcements", icon: "📢" },
                { label: "Surveys", href: "/stakeholder/surveys", icon: "📋" },
              ].map((l) => (
                <Link key={l.label} href={l.href}>
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-accent transition-colors cursor-pointer">
                    <span className="text-sm">{l.icon}</span>
                    <span className="text-xs font-medium">{l.label}</span>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="ml-auto text-muted-foreground">
                      <path d="M3 5h4M5.5 3L7 5l-1.5 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right: Info sections ── */}
        <div className="space-y-5">

          {/* Personal Information */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Personal Information</p>
                <p className="text-xs text-muted-foreground mt-0.5">Your basic account details</p>
              </div>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { label: "Full Name", value: name },
                { label: "Email Address", value: profile.email },
                { label: "Age", value: p.age ? String(p.age) : "—" },
                { label: "Community", value: p.community ?? "—" },
                { label: "Contact Number", value: p.contact ?? "—" },
                { label: "Role", value: "Stakeholder" },
              ].map((field) => (
                <div key={field.label}>
                  <p className="text-xs text-muted-foreground mb-1">{field.label}</p>
                  <p className="text-sm font-medium capitalize">{field.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <p className="text-sm font-semibold">Address Information</p>
              <p className="text-xs text-muted-foreground mt-0.5">Used for crisis response and location tracking</p>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { label: "Permanent Address", value: p.permanent_address ?? "—" },
                { label: "Current Address", value: p.current_address ?? "—" },
              ].map((field) => (
                <div key={field.label}>
                  <p className="text-xs text-muted-foreground mb-1">{field.label}</p>
                  <p className="text-sm font-medium">{field.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Account info */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <p className="text-sm font-semibold">Account Details</p>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { label: "Member Since", value: profile.created_at ? new Date(profile.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—" },
                { label: "Last Updated", value: profile.updated_at ? new Date(profile.updated_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—" },
              ].map((field) => (
                <div key={field.label}>
                  <p className="text-xs text-muted-foreground mb-1">{field.label}</p>
                  <p className="text-sm font-medium">{field.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Update notice */}
          <div className="bg-muted/50 border border-border rounded-2xl px-5 py-4 flex items-start gap-3">
            <div className="text-lg flex-shrink-0 mt-0.5">💡</div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              To update your profile information, please contact your system administrator or use the profile update form once it is available.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}