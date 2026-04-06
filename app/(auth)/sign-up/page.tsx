// app/(auth)/sign-up/page.tsx
import { SignUpFormEnhanced } from "@/components/sign-up-form-enhanced";
import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen flex bg-background">

      {/* ── Left: Form Panel ── */}
      <div className="flex-1 flex flex-col overflow-y-auto">

        {/* Top row: back button LEFT + logo RIGHT on same horizontal line */}
        <div className="flex-shrink-0 flex items-center gap-4 px-8 xl:px-16 pt-6 pb-0">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors border border-border bg-background px-3 py-1.5 rounded-lg hover:bg-accent flex-shrink-0"
          >
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path d="M8.5 2.5L4 7l4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </Link>

          {/* Logo — same row as back button */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-destructive flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M8 2L14 13H2L8 2Z" fill="white" />
              </svg>
            </div>
            <div className="leading-none">
              <p className="text-sm font-bold tracking-tight">Operation Keep Safe!</p>
              <p className="text-[10px] text-muted-foreground">De La Salle Lipa</p>
            </div>
          </div>
        </div>

        {/* Centered form content */}
        <div className="flex-1 flex items-center justify-center px-8 xl:px-16 py-8">
          <div className="w-full max-w-md">

            {/* Heading */}
            <div className="mb-5">
              <h1 className="text-3xl font-bold tracking-tight mb-1.5">Create account</h1>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Join OKS! as a stakeholder — available to DLSL students and faculty
                with a valid school email.
              </p>
            </div>

            {/* DLSL notice */}
            <div className="flex items-start gap-3 bg-muted/60 border border-border rounded-xl p-3.5 mb-4">
              <div className="w-6 h-6 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 mt-0.5 text-sm">
                📧
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                You must use a valid{" "}
                <span className="font-semibold text-foreground">@dlsl.edu.ph</span>{" "}
                email address. Non-DLSL emails will be rejected.
              </p>
            </div>

            {/* Form */}
            <SignUpFormEnhanced />

          </div>
        </div>
      </div>

      {/* ── Right: Illustration Panel ── */}
      <div className="hidden lg:flex flex-1 bg-card border-l border-border items-center justify-center p-8 xl:p-16 relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-destructive/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-24 w-80 h-80 rounded-full bg-muted/50 blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full max-w-sm">
          <div className="flex flex-wrap gap-2 mb-8">
            {[
              { icon: "🚨", label: "SOS Alerts" },
              { icon: "📢", label: "Announcements" },
              { icon: "🗺️", label: "Crisis Map" },
              { icon: "📋", label: "Surveys" },
              { icon: "🤝", label: "Volunteer" },
              { icon: "📦", label: "Donations" },
              { icon: "📊", label: "Progress Reports" },
              { icon: "📬", label: "Inbox" },
            ].map((tag) => (
              <span
                key={tag.label}
                className="inline-flex items-center gap-1.5 text-xs font-medium bg-background border border-border px-3 py-2 rounded-full text-muted-foreground"
              >
                {tag.icon} {tag.label}
              </span>
            ))}
          </div>
          <div className="bg-background border border-border rounded-2xl p-6 mb-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center text-base flex-shrink-0">
                🛡️
              </div>
              <div>
                <p className="text-xs font-semibold">Your campus, safer together</p>
                <p className="text-[10px] text-muted-foreground">Operation Keep Safe!</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              OKS! replaces scattered group chats and manual spreadsheets with
              a single, reliable platform so that when emergencies happen,
              everyone knows exactly what to do and where to go.
            </p>
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-2">Be prepared, not caught off guard</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            OKS! gives every DLSL community member the tools they need to navigate emergencies with confidence.
          </p>
        </div>
      </div>
    </div>
  );
}