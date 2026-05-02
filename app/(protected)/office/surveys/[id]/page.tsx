// app/(protected)/office/surveys/[id]/page.tsx
import { getCurrentUserProfile } from '@/lib/queries/user';
import { getSurveyById, getSurveyResponses } from '@/lib/queries/survey';
import { closeSurvey } from '@/app/actions/survey';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, ClipboardList, Users, BarChart3, Lock, 
  ShieldAlert, HeartHandshake 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PageProps {
  params: Promise<{ id: string }>;
}

interface SurveyQuestion {
  id: string;
  text: string;
  type: 'text' | 'radio' | 'checkbox';
  options?: string[];
}

// Map the survey types to their respective UI styles
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

export default async function OfficeSurveyDetailPage({ params }: PageProps) {
  const profile = await getCurrentUserProfile();
  if (!profile || profile.role !== 'office') redirect('/login-office');

  const { id } = await params;
  const [survey, responses] = await Promise.all([getSurveyById(id), getSurveyResponses(id)]);
  if (!survey) notFound();

  // FIX: Supabase returns JSONB as parsed objects, so JSON.parse crashes if we don't check typeof
  let questions: SurveyQuestion[] = [];
  try { 
    questions = typeof survey.questions === 'string' 
      ? JSON.parse(survey.questions) 
      : (survey.questions || []); 
  } catch { questions = []; }

  const answerMap: Record<string, Record<string, number>> = {};
  for (const q of questions) {
    if (q.type !== 'text') {
      answerMap[q.id] = {};
      for (const opt of q.options || []) answerMap[q.id][opt] = 0;
    }
  }
  
  // Safely parse analytics map
  for (const response of responses) {
    let answers: Record<string, string | string[]> = {};
    try { 
      answers = typeof response.answers === 'string' 
        ? JSON.parse(response.answers) 
        : (response.answers || {}); 
    } catch { continue; }
    
    for (const [qId, val] of Object.entries(answers)) {
      if (!answerMap[qId]) continue;
      const values = Array.isArray(val) ? val : [val];
      for (const v of values) { answerMap[qId][v] = (answerMap[qId][v] || 0) + 1; }
    }
  }

  const isActive = survey.status === 'active';
  const typeStyle = survey.survey_type ? typeConfig[survey.survey_type] : null;

  return (
    <div className="flex flex-col gap-6 p-6 max-w-3xl mx-auto">
      <Link href="/office/surveys" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit">
        <ArrowLeft className="h-4 w-4" /> Back to Surveys
      </Link>

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center flex-shrink-0">
            <ClipboardList className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold">{survey.title}</h1>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              
              {/* Active/Closed Status Badge */}
              <Badge variant="outline" className={isActive ? "border-blue-400 text-blue-600 bg-blue-50 dark:bg-blue-950/20 text-xs" : "text-xs text-muted-foreground"}>
                {isActive ? (
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    Active
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Lock className="h-3 w-3" /> Closed
                  </span>
                )}
              </Badge>

              {/* Survey Type Badge */}
              {typeStyle && (
                <Badge variant="outline" className={`text-xs gap-1 ${typeStyle.color} ${typeStyle.bg} ${typeStyle.border}`}>
                  {typeStyle.icon}
                  {typeStyle.label}
                </Badge>
              )}

              {/* Response Count */}
              <span className="text-xs text-muted-foreground flex items-center gap-1 ml-1">
                <Users className="h-3 w-3" />{responses.length} response{responses.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
        {isActive && (
          <form action={async () => { 'use server'; await closeSurvey(id); }}>
            <Button type="submit" variant="outline" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
              <Lock className="h-3.5 w-3.5" />Close Survey
            </Button>
          </form>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Users className="h-4 w-4" /><span className="text-xs uppercase tracking-wide font-medium">Responses</span>
          </div>
          <p className="text-3xl font-bold">{responses.length}</p>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <BarChart3 className="h-4 w-4" /><span className="text-xs uppercase tracking-wide font-medium">Questions</span>
          </div>
          <p className="text-3xl font-bold">{questions.length}</p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />Response Summary
        </h2>

        {questions.length === 0 && (
          <p className="text-sm text-muted-foreground italic border rounded-lg p-6 text-center bg-card">
            No questions found in this survey.
          </p>
        )}

        {questions.map((q, idx) => (
          <div key={q.id} className="rounded-lg border bg-card p-5 space-y-3 shadow-sm">
            <p className="text-sm font-semibold">
              <span className="text-muted-foreground mr-2">{idx + 1}.</span>{q.text}
              <span className="ml-2 text-xs font-normal text-muted-foreground">({q.type})</span>
            </p>
            {q.type === 'text' ? (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {(() => {
                  // Extract valid text answers specifically for this question
                  const validAnswers = responses.map((r) => {
                    let ans: Record<string, string | string[]> = {};
                    try {
                      ans = typeof r.answers === 'string' 
                        ? JSON.parse(r.answers) 
                        : (r.answers || {});
                    } catch { return null; }
                    const val = ans[q.id];
                    return val ? { id: r.id, val } : null;
                  }).filter(Boolean) as { id: string, val: string | string[] }[];

                  if (validAnswers.length === 0) {
                    return <p className="text-xs text-muted-foreground italic">No responses yet</p>;
                  }

                  return validAnswers.map((item) => (
                    <div key={item.id} className="text-sm bg-muted/40 rounded px-3 py-2 leading-relaxed">
                      {Array.isArray(item.val) ? item.val.join(', ') : item.val}
                    </div>
                  ));
                })()}
              </div>
            ) : (
              <div className="space-y-2">
                {(q.options || []).map((opt) => {
                  const count = answerMap[q.id]?.[opt] ?? 0;
                  const pct = responses.length > 0 ? Math.round((count / responses.length) * 100) : 0;
                  return (
                    <div key={opt} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium">{opt}</span>
                        <span className="text-muted-foreground">{count} ({pct}%)</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-blue-500 transition-all duration-500" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}