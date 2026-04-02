// app/(protected)/office/profile/page.tsx
import { getCurrentUserProfile } from "@/lib/queries/user";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function OfficeProfile() {
  const profile = await getCurrentUserProfile();

  if (!profile || profile.role !== "office") {
    redirect("/login-office");
  }

  const name = profile.name ?? "Officer";
  const firstName = name.split(" ")[0];
  const p = profile as any;
  const officeName = p.office_name ?? "Office";

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Your office account information and settings.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">

        {/* ── Left: Identity card ── */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-2xl p-6 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-blue-500/20 border-2 border-blue-500/30 flex items-center justify-center text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">
              {firstName[0]?.toUpperCase()}
            </div>
            <p className="text-base font-bold">{name}</p>
            <p className="text-xs text-muted-foreground mt-0.5 mb-3">{profile.email}</p>
            <span className="text-xs font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded-full">
              Office Staff
            </span>
            <span className="text-xs font-medium bg-muted text-muted-foreground border border-border px-2.5 py-1 rounded-full mt-2">
              {officeName}
            </span>
          </div>

          {/* Quick links */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-border">
              <p className="text-sm font-semibold">Quick Links</p>
            </div>
            <div className="p-3 space-y-1">
              {[
                { label: "Dashboard", href: "/office/dashboard", icon: "📊" },
                { label: "Help Requests", href: "/office/help-requests", icon: "🆘" },
                { label: "Announcements", href: "/office/announcements", icon: "📢" },
                { label: "Crises", href: "/office/crises", icon: "⚡" },
                { label: "Reports", href: "/office/reports", icon: "📋" },
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
            <div className="px-6 py-4 border-b border-border">
              <p className="text-sm font-semibold">Personal Information</p>
              <p className="text-xs text-muted-foreground mt-0.5">Your basic account details</p>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { label: "Full Name", value: name },
                { label: "Email Address", value: profile.email },
                { label: "Age", value: p.age ? String(p.age) : "—" },
                { label: "Gender", value: p.gender ?? "—" },
                { label: "Contact Number", value: p.contact ?? "—" },
                { label: "Role", value: "Office Staff" },
              ].map((field) => (
                <div key={field.label}>
                  <p className="text-xs text-muted-foreground mb-1">{field.label}</p>
                  <p className="text-sm font-medium capitalize">{field.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Office Information */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <p className="text-sm font-semibold">Office Information</p>
              <p className="text-xs text-muted-foreground mt-0.5">Your assigned office and responsibilities</p>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { label: "Office Name", value: officeName },
                { label: "Office Role", value: p.role ?? "office" },
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
              To update your profile information, please contact the system administrator. Office account details are managed at the admin level.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}