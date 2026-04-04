// components/reports/ReportsSidebar.tsx

import { Report, ReportCrisis } from "./reports.data";

interface ReportsSidebarProps {
  crises: ReportCrisis[];
  reports: Report[];
  filterCrisis: string;
  onFilter: (id: string) => void;
}

export function ReportsSidebar({ crises, reports, filterCrisis, onFilter }: ReportsSidebarProps) {
  const reportsByCrisis = crises.map((c) => ({
    ...c,
    count: reports.filter((r) => r.crisis_id === c.id).length,
  }));

  return (
    <div className="w-64 shrink-0 sticky top-6">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        Crises
      </p>
      <div className="space-y-2">

        {/* All */}
        <button
          onClick={() => onFilter("all")}
          className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
            filterCrisis === "all"
              ? "bg-[#00C48C]/10 border-[#00C48C]"
              : "bg-card border-border hover:border-muted-foreground"
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">All Crises</p>
            <span className="text-xs font-bold text-muted-foreground">{reports.length}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {reports.length} total update{reports.length !== 1 ? "s" : ""}
          </p>
        </button>

        {/* Per crisis */}
        {reportsByCrisis.map((c) => (
          <button
            key={c.id}
            onClick={() => onFilter(c.id)}
            className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
              filterCrisis === c.id
                ? "bg-[#00C48C]/10 border-[#00C48C]"
                : "bg-card border-border hover:border-muted-foreground"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full capitalize ${
                c.status === "active"
                  ? "bg-[#00C48C]/10 text-[#00C48C]"
                  : "bg-muted text-muted-foreground"
              }`}>
                {c.status}
              </span>
              <span className="text-xs font-bold text-muted-foreground">{c.count}</span>
            </div>
            <p className="text-sm font-semibold text-foreground leading-tight">{c.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {c.count} update{c.count !== 1 ? "s" : ""}
            </p>
          </button>
        ))}

      </div>
    </div>
  );
}