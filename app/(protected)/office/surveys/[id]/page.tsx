import { getCurrentUserProfile } from '@/lib/queries/user';
import { getSurveyById, getSurveyResponses } from '@/lib/queries/survey';
import { closeSurvey } from '@/app/actions/survey';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ClipboardList, Users, BarChart3, Lock } from 'lucide-react';
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

export default async function OfficeSurveyDetailPage({ params }: PageProps) {
  const profile = await getCurrentUserProfile();
  if (!profile || profile.role !== 'office') redirect('/login-office');

  const { id } = await params;
  const [survey, responses] = await Promise.all([getSurveyById(id), getSurveyResponses(id)]);
  if (!survey) notFound();

  let questions: SurveyQuestion[] = [];
  try { questions = JSON.parse(survey.questions); } catch { questions = []; }

  const answerMap: Record<string, Record<string, number>> = {};
  for (const q of questions) {
    if (q.type !== 'text') {
      answerMap[q.id] = {};
      for (const opt of q.options || []) answerMap[q.id][opt] = 0;
    }
  }
  for (const response of responses) {
    let answers: Record<string, string | string[]> = {};
    try { answers = JSON.parse(response.answers); } catch { continue; }
    for (const [qId, val] of Object.entries(answers)) {
      if (!answerMap[qId]) continue;
      const values = Array.isArray(val) ? val : [val];
      for (const v of values) { answerMap[qId][v] = (answerMap[qId][v] || 0) + 1; }
    }
  }

  const isActive = survey.status === 'active';

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
              <Badge variant="outline" className={isActive ? "border-blue-400 text-blue-600 bg-blue-50 dark:bg-blue-950/20 text-xs" : "text-xs text-muted-foreground"}>
                {isActive ? <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />Active</span> : "Closed"}
              </Badge>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
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
        {questions.map((q, idx) => (
          <div key={q.id} className="rounded-lg border bg-card p-5 space-y-3">
            <p className="text-sm font-semibold">
              <span className="text-muted-foreground mr-2">{idx + 1}.</span>{q.text}
              <span className="ml-2 text-xs font-normal text-muted-foreground">({q.type})</span>
            </p>
            {q.type === 'text' ? (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {responses.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">No responses yet</p>
                ) : (
                  responses.map((r) => {
                    let ans: Record<string, string | string[]> = {};
                    try { ans = JSON.parse(r.answers); } catch { return null; }
                    const val = ans[q.id];
                    if (!val) return null;
                    return (
                      <div key={r.id} className="text-sm bg-muted/40 rounded px-3 py-2 leading-relaxed">
                        {Array.isArray(val) ? val.join(', ') : val}
                      </div>
                    );
                  }).filter(Boolean)
                )}
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