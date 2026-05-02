// components/SurveyCard.tsx
import Link from "next/link";
import { Survey } from "@/types/database";
import { Badge } from "@/components/ui/badge";
import { 
  ClipboardList, ChevronRight, CheckCircle2, Clock, 
  Lock, ShieldAlert, HeartHandshake, Users 
} from "lucide-react";

// UPDATE: Added optional officeName and isOwner props
interface SurveyCardProps {
  survey: Survey;
  viewMode: "stakeholder" | "office";
  hasResponded?: boolean;
  responseCount?: number;
  officeName?: string;
  isOwner?: boolean;
}

const typeConfig: Record<string, { label: string; icon: React.ReactNode; color: string; bg: string; border: string }> = {
  safety: {
    label: "Safety",
    icon: <ShieldAlert className="h-3.5 w-3.5" />,
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-50 dark:bg-orange-950/20",
    border: "border-orange-300 dark:border-orange-800",
  },
  donation: {
    label: "Donation",
    icon: <HeartHandshake className="h-3.5 w-3.5" />,
    color: "text-pink-600 dark:text-pink-400",
    bg: "bg-pink-50 dark:bg-pink-950/20",
    border: "border-pink-300 dark:border-pink-800",
  },
  volunteer: {
    label: "Volunteer",
    icon: <Users className="h-3.5 w-3.5" />,
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-950/20",
    border: "border-green-300 dark:border-green-800",
  },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function SurveyCard({ survey, viewMode, hasResponded, responseCount, officeName, isOwner }: SurveyCardProps) {
  const href =
    viewMode === "stakeholder"
      ? `/stakeholder/surveys/${survey.id}`
      : `/office/surveys/${survey.id}`;

  const isActive = survey.status === "active";
  const type = survey.survey_type ? typeConfig[survey.survey_type] : null;

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
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 text-muted-foreground"><Lock size={12}/></span>
                    Closed
                  </span>
                )}
              </Badge>

              {type && (
                <Badge variant="outline" className={`text-xs gap-1 ${type.color} ${type.bg} ${type.border}`}>
                  {type.icon}
                  {type.label}
                </Badge>
              )}

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

            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDate(survey.created_at)}
              </span>
              
              {/* UPDATE: Display "Created by" label */}
              {viewMode === "office" && officeName && (
                <span className="flex items-center gap-1 text-muted-foreground/80 truncate">
                  • Created by: <span className={isOwner ? "font-semibold text-foreground" : ""}>{isOwner ? "You" : officeName}</span>
                </span>
              )}

              {viewMode === "office" && responseCount !== undefined && (
                <span className="flex items-center gap-1">
                  • <ClipboardList className="h-3 w-3 ml-0.5" />
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