//app/(protected)/stakeholder/surveys/[id]/page.tsx
import { getCurrentUserProfile } from '@/lib/queries/user';
import { getSurveyById, getStakeholderSurveyResponse } from '@/lib/queries/survey';
import { submitSurveyResponse } from '@/app/actions/survey';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ClipboardList, CheckCircle2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PageProps {
  params: Promise<{ id: string }>;
}

interface SurveyQuestion {
  id: string;
  text: string;
  type: 'text' | 'radio' | 'checkbox';
  options?: string[];
}

export default async function StakeholderSurveyDetailPage({ params }: PageProps) {
  const profile = await getCurrentUserProfile();
  if (!profile || profile.role !== 'stakeholder') redirect('/login');

  const { id } = await params;
  const survey = await getSurveyById(id);
  if (!survey) notFound();

  const existingResponse = await getStakeholderSurveyResponse(id, profile.id);

  let questions: SurveyQuestion[] = [];
  try { questions = JSON.parse(survey.questions); } catch { questions = []; }

  let parsedAnswers: Record<string, string | string[]> = {};
  if (existingResponse?.answers) {
    try { parsedAnswers = JSON.parse(existingResponse.answers); } catch { parsedAnswers = {}; }
  }

  const isClosed = survey.status !== 'active';
  const hasResponded = !!existingResponse;

  const boundAction = submitSurveyResponse.bind(null, null) as (formData: FormData) => void;

  return (
    <div className="flex flex-col gap-6 p-6 max-w-2xl mx-auto">
      <Link
        href="/stakeholder/surveys"
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Surveys
      </Link>

      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center flex-shrink-0">
          <ClipboardList className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold">{survey.title}</h1>
          <div className="flex items-center gap-2 mt-1">
            {isClosed ? (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Lock className="h-3 w-3" /> Closed
              </span>
            ) : (
              <span className="text-xs text-blue-600 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                Active
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Already responded */}
      {hasResponded && (
        <div className="rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/40 px-4 py-4">
          <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-semibold mb-3">
            <CheckCircle2 className="h-5 w-5" />
            You've already responded to this survey
          </div>
          <div className="space-y-3">
            {questions.map((q, idx) => (
              <div key={q.id} className="text-sm">
                <p className="font-medium text-muted-foreground">Q{idx + 1}: {q.text}</p>
                <p className="mt-0.5">
                  {Array.isArray(parsedAnswers[q.id])
                    ? (parsedAnswers[q.id] as string[]).join(', ')
                    : parsedAnswers[q.id] || (
                        <span className="text-muted-foreground italic">No answer</span>
                      )}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Survey closed, no response */}
      {isClosed && !hasResponded && (
        <div className="rounded-lg bg-muted/40 border px-4 py-4 text-sm text-muted-foreground flex items-center gap-2">
          <Lock className="h-4 w-4" />
          This survey is now closed and no longer accepting responses.
        </div>
      )}

      {/* Survey Form */}
      {!hasResponded && !isClosed && (
        <form action={boundAction} className="space-y-6">
          <input type="hidden" name="survey_id" value={survey.id} />

          {questions.map((q, idx) => (
            <div key={q.id} className="rounded-lg border bg-card p-5 space-y-3">
              <label className="text-sm font-semibold leading-tight block">
                <span className="text-muted-foreground mr-2">{idx + 1}.</span>
                {q.text}
                <span className="text-red-500 ml-1">*</span>
              </label>

              {q.type === 'text' && (
                <textarea
                  name={`q_${q.id}`}
                  required
                  rows={3}
                  placeholder="Your answer..."
                  className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                />
              )}

              {q.type === 'radio' && (
                <div className="space-y-2">
                  {(q.options || []).map((opt, i) => (
                    <label key={i} className="flex items-center gap-2.5 cursor-pointer group">
                      <input
                        type="radio"
                        name={`q_${q.id}`}
                        value={opt}
                        required
                        className="w-4 h-4 accent-primary"
                      />
                      <span className="text-sm group-hover:text-foreground transition-colors">
                        {opt}
                      </span>
                    </label>
                  ))}
                </div>
              )}

              {q.type === 'checkbox' && (
                <div className="space-y-2">
                  {(q.options || []).map((opt, i) => (
                    <label key={i} className="flex items-center gap-2.5 cursor-pointer group">
                      <input
                        type="checkbox"
                        name={`q_${q.id}`}
                        value={opt}
                        className="w-4 h-4 accent-primary rounded"
                      />
                      <span className="text-sm group-hover:text-foreground transition-colors">
                        {opt}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}

          <Button type="submit" className="w-full h-11 gap-2 font-semibold">
            <ClipboardList className="h-4 w-4" />
            Submit Response
          </Button>
        </form>
      )}
    </div>
  );
}