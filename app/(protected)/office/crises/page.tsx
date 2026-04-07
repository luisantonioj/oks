// app/(protected)/office/crises/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getCrises } from "@/lib/queries/crisis";
import { ActiveCrisisCard, ResolvedCrisisCard } from "../../../../components/crisis/CrisisCard";
import { CrisisModalWrapper } from "./CrisisModalWrapper";
import { Crisis } from "../../../../components/crisis/crisis.types"; // <-- ADDED IMPORT

export default async function OfficeCrisesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login-portal");
  }

  // Fetch REAL data from Supabase and cast it to the UI type to satisfy TypeScript
  const rawCrises = await getCrises();
  const crises = rawCrises as unknown as Crisis[]; 
  
  // Notice we filter by lowercase "active" and "resolved" to match your DB
  const activeCrises = crises.filter((c) => c.status === "active");
  const resolvedCrises = crises.filter((c) => c.status === "resolved");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Crisis Management</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Monitor and manage all active and past crises</p>
          </div>
          {/* This client component handles the modal state */}
          <CrisisModalWrapper />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Crises",  value: crises.length,          color: "text-foreground" },
            { label: "Active",        value: activeCrises.length,    color: "text-[#00C48C]" },
            { label: "Resolved",      value: resolvedCrises.length,  color: "text-muted-foreground" },
          ].map((s) => (
            <div key={s.label} className="bg-card rounded-xl border border-border p-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{s.label}</p>
              <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Active Crises */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Active Crises</h2>
          {activeCrises.length === 0 ? (
            <div className="bg-card rounded-xl border border-border p-10 text-center">
              <p className="text-muted-foreground text-sm">No active crises. All clear!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeCrises.map((crisis) => (
                <ActiveCrisisCard key={crisis.id} crisis={crisis} />
              ))}
            </div>
          )}
        </section>

        {/* Resolved Crises */}
        {resolvedCrises.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Resolved Crises</h2>
            <div className="space-y-3">
              {resolvedCrises.map((crisis) => (
                <ResolvedCrisisCard key={crisis.id} crisis={crisis} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}