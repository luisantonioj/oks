"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  ChevronRight,
  Lock,
  HeartHandshake,
  Users,
  ShieldAlert,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// ── Types ──────────────────────────────────────────────────────────────────

type SurveyType = "safety" | "donation" | "volunteer";

interface DummySurvey {
  id: string;
  title: string;
  type: SurveyType;
  crisis: string;
  status: "active" | "closed";
  created_at: string;
  hasResponded: boolean;
}

// ── Dummy Data ─────────────────────────────────────────────────────────────

const dummySurveys: DummySurvey[] = [
  {
    id: "survey-001",
    title: "Safety Status Check — Typhoon Jacinto",
    type: "safety",
    crisis: "Typhoon Jacinto",
    status: "active",
    created_at: "2025-05-20T10:00:00Z",
    hasResponded: false,
  },
  {
    id: "survey-002",
    title: "Post-Earthquake Safety Assessment",
    type: "safety",
    crisis: "Earthquake Batangas",
    status: "active",
    created_at: "2025-05-18T08:00:00Z",
    hasResponded: true,
  },
  {
    id: "survey-003",
    title: "Donation Interest Form — Typhoon Jacinto",
    type: "donation",
    crisis: "Typhoon Jacinto",
    status: "active",
    created_at: "2025-05-20T11:00:00Z",
    hasResponded: false,
  },
  {
    id: "survey-004",
    title: "Relief Goods Donation — Flood Lipa City",
    type: "donation",
    crisis: "Flood — Lipa City",
    status: "closed",
    created_at: "2025-05-14T06:00:00Z",
    hasResponded: true,
  },
  {
    id: "survey-005",
    title: "Volunteer Sign-up — Typhoon Jacinto Relief",
    type: "volunteer",
    crisis: "Typhoon Jacinto",
    status: "active",
    created_at: "2025-05-20T12:00:00Z",
    hasResponded: false,
  },
  {
    id: "survey-006",
    title: "Medical Volunteer Registration — Earthquake Response",
    type: "volunteer",
    crisis: "Earthquake Batangas",
    status: "active",
    created_at: "2025-05-18T09:00:00Z",
    hasResponded: false,
  },
  {
    id: "survey-007",
    title: "Flood Recovery Needs Assessment",
    type: "safety",
    crisis: "Flood — Lipa City",
    status: "closed",
    created_at: "2025-05-14T07:00:00Z",
    hasResponded: true,
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const typeConfig: Record<
  SurveyType,
  { label: string; icon: React.ReactNode; color: string; bg: string; border: string }
> = {
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

// ── Survey Card ────────────────────────────────────────────────────────────

function SurveyCardDummy({ survey }: { survey: DummySurvey }) {
  const isActive = survey.status === "active";
  const type = typeConfig[survey.type];

  return (
    <Link href={`/stakeholder/surveys/${survey.id}`} className="block group">
      <div className="rounded-lg border bg-card shadow-sm hover:shadow-md transition-all duration-200 hover:border-primary/30 overflow-hidden">
        <div className="p-5 flex items-start gap-4">
          {/* Icon */}
          <div
            className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
              isActive
                ? "bg-blue-100 dark:bg-blue-950/40 text-blue-600"
                : "bg-muted text-muted-foreground"
            }`}
          >
            <ClipboardList className="h-5 w-5" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              {/* Active/Closed badge */}
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
                    <Lock className="h-3 w-3" />
                    Closed
                  </span>
                )}
              </Badge>

              {/* Type badge */}
              <Badge
                variant="outline"
                className={`text-xs gap-1 ${type.color} ${type.bg} ${type.border}`}
              >
                {type.icon}
                {type.label}
              </Badge>

              {/* Responded badge */}
              {survey.hasResponded && (
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
              <span className="text-[10px] font-medium text-muted-foreground/60">
                {survey.crisis}
              </span>
            </div>
          </div>

          <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 group-hover:text-primary transition-colors mt-0.5" />
        </div>

        {/* CTA strip */}
        {isActive && !survey.hasResponded && (
          <div className="px-5 py-2 bg-blue-50 dark:bg-blue-950/20 border-t border-blue-100 dark:border-blue-900/30">
            <p className="text-xs text-blue-600 font-medium">
              Tap to fill out this survey →
            </p>
          </div>
        )}
      </div>
    </Link>
  );
}

// ── Tab Button ─────────────────────────────────────────────────────────────

type FilterTab = "all" | SurveyType;

function TabButton({
  label,
  icon,
  active,
  count,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground hover:bg-accent"
      }`}
    >
      {icon}
      {label}
      <span
        className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
          active
            ? "bg-white/20 text-primary-foreground"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────

export default function StakeholderSurveysPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const filtered =
    activeTab === "all"
      ? dummySurveys
      : dummySurveys.filter((s) => s.type === activeTab);

  const activeSurveys = filtered.filter((s) => s.status === "active");
  const closedSurveys = filtered.filter((s) => s.status === "closed");

  const pendingCount = dummySurveys.filter(
    (s) => s.status === "active" && !s.hasResponded
  ).length;

  const tabCounts: Record<FilterTab, number> = {
    all: dummySurveys.length,
    safety: dummySurveys.filter((s) => s.type === "safety").length,
    donation: dummySurveys.filter((s) => s.type === "donation").length,
    volunteer: dummySurveys.filter((s) => s.type === "volunteer").length,
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ClipboardList className="h-6 w-6 text-blue-500" />
          Surveys
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {pendingCount > 0
            ? `${pendingCount} survey${pendingCount !== 1 ? "s" : ""} awaiting your response`
            : "All surveys up to date ✓"}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        <TabButton
          label="All"
          icon={<ClipboardList className="h-3.5 w-3.5" />}
          active={activeTab === "all"}
          count={tabCounts.all}
          onClick={() => setActiveTab("all")}
        />
        <TabButton
          label="Safety"
          icon={<ShieldAlert className="h-3.5 w-3.5" />}
          active={activeTab === "safety"}
          count={tabCounts.safety}
          onClick={() => setActiveTab("safety")}
        />
        <TabButton
          label="Donation"
          icon={<HeartHandshake className="h-3.5 w-3.5" />}
          active={activeTab === "donation"}
          count={tabCounts.donation}
          onClick={() => setActiveTab("donation")}
        />
        <TabButton
          label="Volunteer"
          icon={<Users className="h-3.5 w-3.5" />}
          active={activeTab === "volunteer"}
          count={tabCounts.volunteer}
          onClick={() => setActiveTab("volunteer")}
        />
      </div>

      {/* Active Surveys */}
      {activeSurveys.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-blue-600 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            Active Surveys
          </h2>
          {activeSurveys.map((s) => (
            <SurveyCardDummy key={s.id} survey={s} />
          ))}
        </section>
      )}

      {/* Closed Surveys */}
      {closedSurveys.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Closed Surveys
          </h2>
          {closedSurveys.map((s) => (
            <SurveyCardDummy key={s.id} survey={s} />
          ))}
        </section>
      )}

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-16 text-center border rounded-lg bg-card">
          <ClipboardList className="h-10 w-10 text-muted-foreground/40" />
          <p className="font-medium text-muted-foreground">
            No {activeTab !== "all" ? activeTab : ""} surveys yet
          </p>
          <p className="text-sm text-muted-foreground/60">
            Surveys from your office will appear here when available.
          </p>
        </div>
      )}
    </div>
  );
}
