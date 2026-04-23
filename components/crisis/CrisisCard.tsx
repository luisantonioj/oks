// components/crisis/CrisisCard.tsx

import Link from "next/link";
import { Crisis } from "./crisis.types";
import { SeverityBadge, StatusBadge, formatDate, formatDateTime } from "./CrisisBadges";

interface CrisisCardProps {
  crisis: Crisis;
  onEdit?: (crisis: Crisis) => void; // Made optional since we removed it from the server component mapping
}

export function ActiveCrisisCard({ crisis, onEdit }: CrisisCardProps) {
  return (
    <div className="bg-card rounded-xl border border-border hover:border-[#00C48C] hover:shadow-md transition-all p-5 group">
      <div className="flex items-start justify-between gap-4">
        <Link href={`/office/crises/${crisis.id}`} className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-bold text-foreground text-base group-hover:text-[#00C48C] transition-colors">
              {crisis.name || "Untitled Crisis"}
            </h3>
            <StatusBadge status={crisis.status} />
            <SeverityBadge severity={crisis.severity} />
          </div>
          <p className="text-xs text-[#00C48C] font-medium mb-2">{crisis.type}</p>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{crisis.summary}</p>
          
          <div className="flex flex-wrap gap-1.5 mb-3">
            {/* FIX 2: Safe mapping for affected_areas */}
            {crisis.affected_areas?.map((area) => (
              <span key={area} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                {area}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-5 text-xs text-muted-foreground">
            {/* FIX 3: Safe access with default fallbacks (|| 0) for related data */}
            <span>🆘 <span className="font-semibold text-foreground">{crisis.help_requests?.length || 0}</span> help requests</span>
            <span>🙋 <span className="font-semibold text-foreground">{crisis.volunteers || 0}</span> volunteers</span>
            <span>💝 <span className="font-semibold text-foreground">{crisis.donations_count || 0}</span> donations</span>
          </div>
        </Link>

        <div className="text-right shrink-0 flex flex-col items-end gap-2">
          {/* Safe date formatting */}
          <p className="text-xs text-muted-foreground">
            Updated {crisis.updated_at ? formatDateTime(crisis.updated_at) : "N/A"}
          </p>
          <p className="text-xs text-muted-foreground">
            Created {crisis.created_at ? formatDateTime(crisis.created_at) : "N/A"}
          </p>
          <div className="flex items-center gap-2 mt-1">
            {/* Only render Edit button if onEdit is provided */}
            {onEdit && (
              <button
                onClick={() => onEdit(crisis)}
                className="text-xs font-medium px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                ✏️ Edit
              </button>
            )}
            <Link href={`/office/crises/${crisis.id}`} className="text-xs font-medium text-[#00C48C] hover:underline">
              View details →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ResolvedCrisisCard({ crisis, onEdit }: CrisisCardProps) {
  return (
    <div className="bg-card rounded-xl border border-border hover:border-muted-foreground transition-all p-5 group opacity-70 hover:opacity-100">
      <div className="flex items-start justify-between gap-4">
        <Link href={`/office/crises/${crisis.id}`} className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-bold text-foreground text-base">{crisis.name || "Untitled Crisis"}</h3>
            <StatusBadge status={crisis.status} />
            <SeverityBadge severity={crisis.severity} />
          </div>
          <p className="text-xs text-muted-foreground font-medium mb-2">{crisis.type}</p>
          <p className="text-sm text-muted-foreground line-clamp-1">{crisis.summary}</p>
        </Link>

        <div className="text-right shrink-0 flex flex-col items-end gap-2">
          <p className="text-xs text-muted-foreground">
            Resolved {crisis.updated_at ? formatDate(crisis.updated_at) : "N/A"}
          </p>
          <div className="flex items-center gap-2 mt-1">
            {/* Only render Edit button if onEdit is provided */}
            {onEdit && (
              <button
                onClick={() => onEdit(crisis)}
                className="text-xs font-medium px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                ✏️ Edit
              </button>
            )}
            <Link href={`/office/crises/${crisis.id}`} className="text-xs font-medium text-muted-foreground hover:text-foreground">
              View details →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}