//components/SurveySubmitForm.tsx
"use client";

import { useState } from "react";
import { useActionState } from "react";
import { submitSurveyResponse } from "@/app/actions/survey";
import { Button } from "@/components/ui/button";
import { ClipboardList, Loader2, User, QrCode, Upload, HeartHandshake } from "lucide-react";

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
  isDonationSurvey?: boolean;
  stakeholderProfile?: StakeholderProfile;
}

// Static mock QR cell pattern (finder pattern corners)
const MOCK_QR: boolean[] = [
  true,true,true,true,true,true,true,false,
  true,false,false,false,false,false,true,false,
  true,false,true,true,true,false,true,false,
  true,false,true,false,true,false,true,true,
  true,false,true,true,true,false,true,false,
  true,false,false,false,false,false,true,true,
  true,true,true,true,true,true,true,false,
  false,true,false,true,false,true,false,true,
];

export function SurveySubmitForm({
  surveyId,
  questions,
  isVolunteerSurvey,
  isDonationSurvey,
  stakeholderProfile,
}: SurveySubmitFormProps) {
  const [state, formAction, isPending] = useActionState(submitSurveyResponse, null);

  // Volunteer state
  const [q1Answer, setQ1Answer] = useState<string>("");

  // Donation state
  const [donationQ1, setDonationQ1] = useState<string>("");
  const [donationQ2, setDonationQ2] = useState<string>("");
  const [donationQ5, setDonationQ5] = useState<string>("");

  // Volunteer derived
  const isWilling = isVolunteerSurvey && q1Answer === "Yes";

  // Donation derived
  const isDonorWilling = isDonationSurvey && donationQ1 === "Yes";
  const isOnBehalf = isDonorWilling && donationQ2 === "No, on behalf of someone else";
  const isOwnDonation = isDonorWilling && donationQ2 === "Yes, myself";
  const isMonetary = isDonorWilling && donationQ5 === "Monetary Donation";
  const isInKind = isDonorWilling && donationQ5 === "In-Kind Donation (Goods and supplies)";

  const isDonationVisible = (idx: number): boolean => {
    if (idx === 0) return true;
    if (!isDonorWilling) return false;
    if (idx === 1) return true;
    if (idx === 2) return !!isOnBehalf;
    if (idx === 3) return true;
    if (idx === 4) return true;
    if (idx === 5) return !!isMonetary;
    if (idx === 6) return !!isInKind;
    if (idx === 7) return !!isInKind;
    if (idx === 8) return !!isInKind;
    return true;
  };

  const isDonationRequired = (idx: number): boolean => {
    if (idx === 0) return true;
    if (!isDonorWilling) return false;
    if (idx === 2) return !!isOnBehalf;
    if (idx === 6) return false; // checkbox, not strictly required
    if (idx === 5) return !!isMonetary;
    if (idx === 7) return !!isInKind;
    if (idx === 8) return !!isInKind;
    return true;
  };

  const handleOptionChange = (idx: number, opt: string) => {
    if (isVolunteerSurvey && idx === 0) setQ1Answer(opt);
    if (isDonationSurvey) {
      if (idx === 0) setDonationQ1(opt);
      if (idx === 1) setDonationQ2(opt);
      if (idx === 4) setDonationQ5(opt);
    }
  };

  // Precompute visible question display numbers
  const displayNumbers = questions.map((_, idx) => {
    if (isDonationSurvey && !isDonationVisible(idx)) return 0;
    return true;
  });
  let counter = 0;
  const displayNums = displayNumbers.map((v) => (v ? ++counter : 0));

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="survey_id" value={surveyId} />
      {isWilling && stakeholderProfile && (
        <input type="hidden" name="__stake_name" value={stakeholderProfile.name} />
      )}
      {isDonorWilling && stakeholderProfile && (
        <input type="hidden" name="__stake_name" value={stakeholderProfile.name} />
      )}

      {questions.map((q, idx) => {
        const isVisible = !isDonationSurvey || isDonationVisible(idx);
        if (!isVisible) return null;

        const isRequired = isDonationSurvey ? isDonationRequired(idx) : true;
        const displayNum = isDonationSurvey ? displayNums[idx] : idx + 1;

        return (
          <div key={q.id} className="space-y-4">
            <div className="rounded-lg border bg-card p-5 space-y-3">
              <label className="text-sm font-semibold leading-tight block">
                <span className="text-muted-foreground mr-2">{displayNum}.</span>
                {q.text}
                {isRequired && <span className="text-red-500 ml-1">*</span>}
              </label>

              {q.type === 'text' && (
                <textarea
                  name={`q_${q.id}`}
                  required={isRequired}
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
                        required={isRequired}
                        className="w-4 h-4 accent-primary"
                        onChange={() => handleOptionChange(idx, opt)}
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

              {/* Volunteer: auto-fill profile after Q1 when willing */}
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

              {/* Donation: show donor profile info after Q1 when willing */}
              {isDonationSurvey && idx === 0 && isDonorWilling && stakeholderProfile && (
                <div className="mt-3 rounded-md bg-pink-50 dark:bg-pink-950/20 border border-pink-200 dark:border-pink-800 p-3 flex items-start gap-2.5">
                  <HeartHandshake className="h-4 w-4 text-pink-600 mt-0.5 flex-shrink-0" />
                  <div className="text-xs space-y-0.5">
                    <p className="font-semibold text-pink-700 dark:text-pink-400">Your details will be recorded with this donation:</p>
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

            {/* Donation: QR code mock + receipt upload after Q5 (idx 4) when monetary */}
            {isDonationSurvey && idx === 4 && isMonetary && (
              <div className="rounded-lg border border-pink-200 dark:border-pink-800 bg-pink-50 dark:bg-pink-950/20 p-5 space-y-5">
                <div className="flex items-center gap-2">
                  <QrCode className="h-4 w-4 text-pink-600" />
                  <p className="text-sm font-semibold text-pink-700 dark:text-pink-400">Payment Details</p>
                </div>

                {/* QR Code Mock */}
                <div className="flex flex-col items-center gap-3">
                  <div className="w-36 h-36 bg-white border-2 border-pink-200 rounded-xl flex items-center justify-center p-3 shadow-sm">
                    <div className="grid gap-0.5" style={{ gridTemplateColumns: "repeat(8, 1fr)" }}>
                      {MOCK_QR.map((cell, i) => (
                        <div
                          key={i}
                          className={`w-3 h-3 rounded-sm ${cell ? "bg-gray-900" : "bg-white"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    Scan QR code to send payment · Details provided by the office
                  </p>
                </div>

                {/* Receipt Upload */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-pink-700 dark:text-pink-400 flex items-center gap-1.5">
                    <Upload className="h-3.5 w-3.5" />
                    Upload Receipt / Proof of Payment
                  </label>
                  <input
                    type="file"
                    name="__receipt"
                    accept="image/*,.pdf"
                    className="flex w-full text-sm text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-pink-100 dark:file:bg-pink-900/40 file:text-pink-700 dark:file:text-pink-300 hover:file:bg-pink-200 dark:hover:file:bg-pink-900/60 transition-colors cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground">Accepted formats: image or PDF</p>
                </div>
              </div>
            )}
          </div>
        );
      })}

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
