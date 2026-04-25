//components/HelpRequestTable.tsx
"use client";

import { useState, useTransition } from "react";
import { updateHelpRequestStatus } from "@/app/actions/help-request";
import { HelpRequest } from "@/types/database";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, CheckCircle2, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";

interface HelpRequestTableProps {
  requests: HelpRequest[];
  viewMode?: "stakeholder" | "office";
}

const statusConfig = {
  pending: {
    label: "Pending",
    variant: "outline" as const,
    icon: <Clock className="h-3 w-3" />,
    className: "border-orange-400 text-orange-600 bg-orange-50 dark:bg-orange-950/20",
  },
  resolved: {
    label: "Resolved",
    variant: "outline" as const,
    icon: <CheckCircle2 className="h-3 w-3" />,
    className: "border-green-500 text-green-600 bg-green-50 dark:bg-green-950/20",
  },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString("en-PH", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function HelpRequestTable({ requests, viewMode = "office" }: HelpRequestTableProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusChange = (id: string, newStatus: "pending" | "resolved") => {
    setUpdatingId(id);
    startTransition(async () => {
      await updateHelpRequestStatus(id, newStatus);
      setUpdatingId(null);
    });
  };

  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <AlertCircle className="h-10 w-10 text-muted-foreground/40" />
        <p className="text-muted-foreground font-medium">No help requests found</p>
        <p className="text-sm text-muted-foreground/60">
          {viewMode === "stakeholder"
            ? "You haven't submitted any emergency requests yet."
            : "No incoming help requests at this time."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {requests.map((req) => {
        const status = statusConfig[req.status as keyof typeof statusConfig] || statusConfig.pending;
        const isExpanded = expanded === req.id;

        return (
          <div
            key={req.id}
            className="rounded-lg border bg-card shadow-sm overflow-hidden transition-all"
          >
            <div className="flex items-center gap-3 p-4">
              <div
                className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  req.status === "pending" ? "bg-orange-500 animate-pulse" : "bg-green-500"
                }`}
              />

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <Badge className={`text-xs gap-1 ${status.className}`}>
                    {status.icon}
                    {status.label}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{formatDate(req.created_at)}</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                  <span className="truncate font-medium">{req.location}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {viewMode === "office" && req.status === "pending" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-7 border-green-500 text-green-600 hover:bg-green-50"
                    disabled={updatingId === req.id}
                    onClick={() => handleStatusChange(req.id, "resolved")}
                  >
                    {updatingId === req.id ? "..." : "Resolve"}
                  </Button>
                )}
                <button
                  onClick={() => setExpanded(isExpanded ? null : req.id)}
                  className="p-1 rounded hover:bg-muted transition-colors"
                >
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {isExpanded && (
              <div className="border-t bg-muted/30 px-4 py-3 space-y-2">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                      Crisis ID
                    </span>
                    <p className="font-mono text-xs mt-0.5 text-muted-foreground truncate">{req.crisis_id}</p>
                  </div>
                  {req.office_id && (
                    <div>
                      <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                        Assigned Office
                      </span>
                      <p className="font-mono text-xs mt-0.5 text-muted-foreground truncate">{req.office_id}</p>
                    </div>
                  )}
                </div>
                {req.notes && (
                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                      Notes
                    </span>
                    <p className="text-sm mt-0.5 leading-relaxed">{req.notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}