// app/(protected)/office/surveys/OfficeSurveysClient.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { SurveyCard } from "@/components/SurveyCard";
import { Button } from "@/components/ui/button";
import { Survey } from "@/types/database";
import { 
  ClipboardList, Plus, ShieldAlert, 
  HeartHandshake, Users 
} from "lucide-react";

type FilterTab = "all" | "safety" | "donation" | "volunteer";

function TabButton({ label, icon, active, count, onClick }: { label: string; icon: React.ReactNode; active: boolean; count: number; onClick: () => void; }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        active ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-accent"
      }`}
    >
      {icon}
      {label}
      <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${active ? "bg-white/20 text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
        {count}
      </span>
    </button>
  );
}

// UPDATE: Add officeMap and currentOfficeId to props
interface OfficeSurveysClientProps {
  surveys: Survey[];
  responseCounts: Record<string, number>;
  officeMap: Record<string, string>;
  currentOfficeId: string;
}

export function OfficeSurveysClient({ surveys, responseCounts, officeMap, currentOfficeId }: OfficeSurveysClientProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const filtered = activeTab === "all" ? surveys : surveys.filter((s) => s.survey_type === activeTab);
  const activeSurveys = filtered.filter((s) => s.status === "active");
  const closedSurveys = filtered.filter((s) => s.status !== "active");

  const tabCounts: Record<FilterTab, number> = {
    all: surveys.length,
    safety: surveys.filter((s) => s.survey_type === "safety").length,
    donation: surveys.filter((s) => s.survey_type === "donation").length,
    volunteer: surveys.filter((s) => s.survey_type === "volunteer").length,
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-blue-500" /> Surveys
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {surveys.length} survey{surveys.length !== 1 ? "s" : ""} across all offices
          </p>
        </div>
        <Link href="/office/surveys/new">
          <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" />New Survey</Button>
        </Link>
      </div>

      {surveys.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <TabButton label="All" icon={<ClipboardList className="h-3.5 w-3.5" />} active={activeTab === "all"} count={tabCounts.all} onClick={() => setActiveTab("all")} />
          <TabButton label="Safety" icon={<ShieldAlert className="h-3.5 w-3.5" />} active={activeTab === "safety"} count={tabCounts.safety} onClick={() => setActiveTab("safety")} />
          <TabButton label="Donation" icon={<HeartHandshake className="h-3.5 w-3.5" />} active={activeTab === "donation"} count={tabCounts.donation} onClick={() => setActiveTab("donation")} />
          <TabButton label="Volunteer" icon={<Users className="h-3.5 w-3.5" />} active={activeTab === "volunteer"} count={tabCounts.volunteer} onClick={() => setActiveTab("volunteer")} />
        </div>
      )}

      {activeSurveys.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-blue-600 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" /> Active ({activeSurveys.length})
          </h2>
          {activeSurveys.map((survey) => (
            <SurveyCard 
              key={survey.id} 
              survey={survey} 
              viewMode="office" 
              responseCount={responseCounts[survey.id] ?? 0} 
              officeName={survey.office_id ? officeMap[survey.office_id] : 'Unknown Office'}
              isOwner={survey.office_id === currentOfficeId}
            />
          ))}
        </section>
      )}

      {closedSurveys.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Closed ({closedSurveys.length})</h2>
          {closedSurveys.map((survey) => (
            <SurveyCard 
              key={survey.id} 
              survey={survey} 
              viewMode="office" 
              responseCount={responseCounts[survey.id] ?? 0} 
              officeName={survey.office_id ? officeMap[survey.office_id] : 'Unknown Office'}
              isOwner={survey.office_id === currentOfficeId}
            />
          ))}
        </section>
      )}

      {filtered.length === 0 && surveys.length > 0 && (
        <div className="flex flex-col items-center gap-3 py-16 text-center border border-dashed rounded-lg bg-card">
          <ClipboardList className="h-10 w-10 text-muted-foreground/40" />
          <p className="font-medium text-muted-foreground">No {activeTab} surveys found</p>
        </div>
      )}

      {surveys.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-16 text-center border-2 border-dashed rounded-lg">
          <ClipboardList className="h-10 w-10 text-muted-foreground/40" />
          <p className="font-medium text-muted-foreground">No surveys yet</p>
          <Link href="/office/surveys/new">
            <Button variant="outline" size="sm" className="gap-1.5"><Plus className="h-4 w-4" />Create your first survey</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default OfficeSurveysClient;