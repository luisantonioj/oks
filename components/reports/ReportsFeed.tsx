// components/reports/ReportsFeed.tsx

import { Report, ReportCrisis } from "./reports.data";

interface ReportsFeedProps {
  reports: Report[];
  crises: ReportCrisis[];
  filterCrisis: string;
}

export function ReportsFeed({ reports, crises, filterCrisis }: ReportsFeedProps) {
  const filtered = filterCrisis === "all"
    ? [...reports].sort((a, b) => b.timestamp - a.timestamp)
    : [...reports].filter((r) => r.crisis_id === filterCrisis).sort((a, b) => b.timestamp - a.timestamp);

  const activeLabel = filterCrisis === "all"
    ? "All Crises"
    : crises.find((c) => c.id === filterCrisis)?.name;

  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Community Updates
          </p>
          <p className="text-sm text-foreground font-semibold mt-0.5">{activeLabel}</p>
        </div>
        <span className="text-xs text-muted-foreground">
          {filtered.length} update{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="bg-card rounded-xl border border-border divide-y divide-border">
        {filtered.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-muted-foreground text-sm">No updates yet. Check back later.</p>
          </div>
        ) : (
          filtered.map((report) => (
            <div key={report.id} className="flex items-start gap-4 p-5">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-xl shrink-0">
                {report.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-bold text-foreground">{report.title}</p>
                    <p className="text-xs text-[#00C48C] font-medium">{report.crisis}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-muted-foreground">{report.posted_at}</p>
                    <p className="text-xs text-muted-foreground/60 mt-0.5">by {report.posted_by}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{report.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}