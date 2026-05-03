//components/SurveySubmitForm.tsx
"use client";

import { useState } from "react";
import { useActionState } from "react";
import { submitSurveyResponse } from "@/app/actions/survey";
import { Button } from "@/components/ui/button";
import { ClipboardList, Loader2, User } from "lucide-react";

interface SurveyQuestion {
  id: string;
  text: string;
  type: 'text' | 'radio' | 'checkbox';
  options?: string[];
}

interface StakeholderProfile {
  name: string;
  email?: string;
  contact?: string;
  community?: string;
}

interface SurveySubmitFormProps {
  surveyId: string;
  questions: SurveyQuestion[];
  isVolunteerSurvey?: boolean;
  stakeholderProfile?: StakeholderProfile;
}

export function SurveySubmitForm({ surveyId, questions, isVolunteerSurvey, stakeholderProfile }: SurveySubmitFormProps) {
  const [state, formAction, isPending] = useActionState(submitSurveyResponse, null);
  const [q1Answer, setQ1Answer] = useState<string>("");

  const isWilling = isVolunteerSurvey && q1Answer === "Yes";

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="survey_id" value={surveyId} />
      {isWilling && stakeholderProfile && (
        <input type="hidden" name="__stake_name" value={stakeholderProfile.name} />
      )}

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
                    onChange={() => {
                      if (isVolunteerSurvey && idx === 0) setQ1Answer(opt);
                    }}
                  />
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

          {/* Auto-fill profile details after Q1 when volunteer answers Yes */}
          {isVolunteerSurvey && idx === 0 && isWilling && stakeholderProfile && (
            <div className="mt-3 rounded-md bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 p-3 flex items-start gap-2.5">
              <User className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs space-y-0.5">
                <p className="font-semibold text-green-700 dark:text-green-400">Your details will be automatically recorded:</p>
                <p className="text-muted-foreground">Name: <span className="font-medium text-foreground">{stakeholderProfile.name}</span></p>
                {stakeholderProfile.email && (
                  <p className="text-muted-foreground">Email: <span className="font-medium text-foreground">{stakeholderProfile.email}</span></p>
                )}
                {stakeholderProfile.contact && (
                  <p className="text-muted-foreground">Contact: <span className="font-medium text-foreground">{stakeholderProfile.contact}</span></p>
                )}
                {stakeholderProfile.community && (
                  <p className="text-muted-foreground">Community: <span className="font-medium text-foreground">{stakeholderProfile.community}</span></p>
                )}
              </div>
            </div>
          )}
        </div>
      ))}

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
