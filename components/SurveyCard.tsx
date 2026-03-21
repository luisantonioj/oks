import Link from "next/link";
import { Survey } from "@/types/database";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, ChevronRight, CheckCircle2, Clock } from "lucide-react";

interface SurveyCardProps {
  survey: Survey;
  viewMode: "stakeholder" | "office";
  hasResponded?: boolean;
  responseCount?: number;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function SurveyCard({ survey, viewMode, hasResponded, responseCount }: SurveyCardProps) {
  const href =
    viewMode === "stakeholder"
      ? `/stakeholder/surveys/${survey.id}`
      : `/office/surveys/${survey.id}`;

  const isActive = survey.status === "active";

  return (
    <Link href={href} className="block group">
      <div className="rounded-lg border bg-card shadow-sm hover:shadow-md transition-all duration-200 hover:border-primary/30 overflow-hidden">
        <div className="p-5 flex items-start gap-4">
          <div
            className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
              isActive
                ? "bg-blue-100 dark:bg-blue-950/40 text-blue-600"
                : "bg-muted text-muted-foreground"
            }`}
          >
            <ClipboardList className="h-5 w-5" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <Badge
                variant="outline"
                className={
                  isActive
                    ? "border-blue-400 text-blue-600 bg-blue-50 dark:bg-blue-950/20 text-xs"
                    : "text-xs text-muted-foreground"
                }
              >
                {isActive ? (
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    Active
                  </span>
                ) : (
                  "Closed"
                )}
              </Badge>

              {viewMode === "stakeholder" && hasResponded && (
                <Badge
                  variant="outline"
                  className="border-green-500 text-green-600 bg-green-50 dark:bg-green-950/20 text-xs gap-1"
                >
                  <CheckCircle2 className="h-3 w-3" />
                  Responded
                </Badge>
              )}
            </div>

            <h3 className="font-semibold text-sm leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-2">
              {survey.title}
            </h3>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDate(survey.created_at)}
              </span>
              {viewMode === "office" && responseCount !== undefined && (
                <span className="flex items-center gap-1">
                  <ClipboardList className="h-3 w-3" />
                  {responseCount} {responseCount === 1 ? "response" : "responses"}
                </span>
              )}
            </div>
          </div>

          <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 group-hover:text-primary transition-colors mt-0.5" />
        </div>

        {viewMode === "stakeholder" && isActive && !hasResponded && (
          <div className="px-5 py-2 bg-blue-50 dark:bg-blue-950/20 border-t border-blue-100 dark:border-blue-900/30">
            <p className="text-xs text-blue-600 font-medium">Tap to fill out this survey →</p>
          </div>
        )}
      </div>
    </Link>
  );
}