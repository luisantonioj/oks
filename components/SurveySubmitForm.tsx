"use client";

import { useActionState } from "react";
import { submitSurveyResponse } from "@/app/actions/survey";
import { Button } from "@/components/ui/button";
import { ClipboardList, Loader2 } from "lucide-react";

interface SurveyQuestion {
  id: string;
  text: string;
  type: 'text' | 'radio' | 'checkbox';
  options?: string[];
}

export function SurveySubmitForm({ surveyId, questions }: { surveyId: string, questions: SurveyQuestion[] }) {
  const [state, formAction, isPending] = useActionState(submitSurveyResponse, null);

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="survey_id" value={surveyId} />

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
                  <input type="radio" name={`q_${q.id}`} value={opt} required className="w-4 h-4 accent-primary" />
                  <span className="text-sm group-hover:text-foreground transition-colors">{opt}</span>
                </label>
              ))}
            </div>
          )}

          {q.type === 'checkbox' && (
            <div className="space-y-2">
              {(q.options || []).map((opt, i) => (
                <label key={i} className="flex items-center gap-2.5 cursor-pointer group">
                  <input type="checkbox" name={`q_${q.id}`} value={opt} className="w-4 h-4 accent-primary rounded" />
                  <span className="text-sm group-hover:text-foreground transition-colors">{opt}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* This will explicitly show you if Supabase rejects the save! */}
      {state?.error && (
        <div className="p-3 rounded-md bg-destructive/10 border border-destructive/30 text-sm text-destructive font-medium">
          {state.error}
        </div>
      )}

      <Button type="submit" disabled={isPending} className="w-full h-11 gap-2 font-semibold">
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ClipboardList className="h-4 w-4" />}
        {isPending ? "Submitting..." : "Submit Response"}
      </Button>
    </form>
  );
}