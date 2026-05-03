//app/components/SurveyBuilder.tsx
"use client";

import { useState, useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, GripVertical, Loader2, ClipboardList } from "lucide-react";
import { Crisis } from "@/types/database";

interface SurveyQuestion {
  id: string;
  text: string;
  type: "text" | "radio" | "checkbox";
  options?: string[];
}

type SurveyActionState = { error?: string; success?: boolean; message?: string } | null;

interface SurveyBuilderProps {
  crises: Crisis[];
  onSubmit: (prevState: SurveyActionState, formData: FormData) => Promise<SurveyActionState>;
}

function generateDonationTemplate(): SurveyQuestion[] {
  return [
    {
      id: crypto.randomUUID(),
      text: "Are you willing to make a donation?",
      type: "radio",
      options: ["Yes", "No"],
    },
    {
      id: crypto.randomUUID(),
      text: "Are you donating on your own behalf, or on behalf of someone else?",
      type: "radio",
      options: ["Yes, myself", "No, on behalf of someone else"],
    },
    {
      id: crypto.randomUUID(),
      text: "If donating on behalf of someone else, please provide their name:",
      type: "text",
    },
    {
      id: crypto.randomUUID(),
      text: "Would you like your donation to remain anonymous?",
      type: "radio",
      options: ["Yes, keep my donation anonymous", "No, you may record my name"],
    },
    {
      id: crypto.randomUUID(),
      text: "Type of donation:",
      type: "radio",
      options: ["Monetary Donation", "In-Kind Donation (Goods and supplies)"],
    },
    {
      id: crypto.randomUUID(),
      text: "Reference Number / Transaction ID:",
      type: "text",
    },
    {
      id: crypto.randomUUID(),
      text: "Select items to donate:",
      type: "checkbox",
      options: [
        "Rice / Grain",
        "Canned Goods / Preserved Food",
        "Drinking Water / Water Containers",
        "Ready-to-eat Meals / Snacks",
        "Clothing (Adults)",
        "Clothing (Children)",
        "Blankets / Sleeping Bags",
        "Hygiene Kits",
        "First Aid Kits",
        "Medicines / Medical Supplies",
        "Baby / Infant Supplies",
        "School Supplies",
        "Tools & Equipment",
        "Other",
      ],
    },
    {
      id: crypto.randomUUID(),
      text: "Quantity and description of donated items:",
      type: "text",
    },
    {
      id: crypto.randomUUID(),
      text: "Preferred handover date:",
      type: "text",
    },
  ];
}

function generateVolunteerTemplate(): SurveyQuestion[] {
  return [
    {
      id: crypto.randomUUID(),
      text: "Are you willing to volunteer?",
      type: "radio",
      options: ["Yes", "No"],
    },
    {
      id: crypto.randomUUID(),
      text: "What is your availability?",
      type: "checkbox",
      options: [
        "Weekdays (Morning)", "Weekdays (Afternoon)", "Weekdays (Evening)",
        "Weekends (Morning)", "Weekends (Afternoon)", "Weekends (Evening)",
      ],
    },
    {
      id: crypto.randomUUID(),
      text: "How many hours can you commit per shift?",
      type: "radio",
      options: ["2–4 hours", "4–6 hours", "6–8 hours", "Full day (8+ hours)"],
    },
    {
      id: crypto.randomUUID(),
      text: "What skills or roles can you offer?",
      type: "checkbox",
      options: [
        "First Aid / Medical Support",
        "Food & Water Distribution",
        "Logistics & Supply Management",
        "Search & Rescue",
        "Psychological Support / Counseling",
        "Community Coordination",
        "Documentation & Reporting",
        "Driver / Transportation",
      ],
    },
    {
      id: crypto.randomUUID(),
      text: "What resources can you bring?",
      type: "checkbox",
      options: [
        "Personal vehicle",
        "Communication equipment (radio, phone)",
        "First aid kit",
        "Food & water supplies",
        "Tools & equipment",
        "None",
      ],
    },
    {
      id: crypto.randomUUID(),
      text: "I agree to the volunteer waiver and consent to participate in disaster relief activities.",
      type: "radio",
      options: ["I agree", "I do not agree"],
    },
  ];
}

export function SurveyBuilder({ crises, onSubmit }: SurveyBuilderProps) {
  const [questions, setQuestions] = useState<SurveyQuestion[]>([
    { id: crypto.randomUUID(), text: "", type: "text" },
  ]);
  const [surveyType, setSurveyType] = useState<string>("");
  const [state, formAction, isPending] = useActionState(onSubmit, null);

  const handleSurveyTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value;
    setSurveyType(newType);
    if (newType === "volunteer") {
      setQuestions(generateVolunteerTemplate());
    } else if (newType === "donation") {
      setQuestions(generateDonationTemplate());
    }
  };

  const addQuestion = () => {
    setQuestions((prev) => [...prev, { id: crypto.randomUUID(), text: "", type: "text" }]);
  };

  const removeQuestion = (id: string) => {
    if (questions.length <= 1) return;
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const updateQuestion = (id: string, updates: Partial<SurveyQuestion>) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, ...updates } : q)));
  };

  const addOption = (questionId: string) => {
    setQuestions((prev) =>
      prev.map((q) => q.id === questionId ? { ...q, options: [...(q.options || []), ""] } : q)
    );
  };

  const updateOption = (questionId: string, idx: number, value: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== questionId) return q;
        const newOptions = [...(q.options || [])];
        newOptions[idx] = value;
        return { ...q, options: newOptions };
      })
    );
  };

  const removeOption = (questionId: string, idx: number) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== questionId) return q;
        return { ...q, options: (q.options || []).filter((_, i) => i !== idx) };
      })
    );
  };

  if (state?.success) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <ClipboardList className="w-7 h-7 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-green-700 dark:text-green-400">Survey Created!</h3>
        <p className="text-muted-foreground">{state.message}</p>
        <a href="/office/surveys" className="text-sm underline text-primary">Back to surveys</a>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="questions" value={JSON.stringify(questions)} />

      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-semibold">Survey Title *</Label>
        <Input id="title" name="title" required placeholder="e.g., Post-Typhoon Welfare Check" className="h-10" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="survey_type" className="text-sm font-semibold">Survey Type *</Label>
        <select
          id="survey_type"
          name="survey_type"
          value={surveyType}
          onChange={handleSurveyTypeChange}
          required
          className="flex h-9 w-full rounded-md border border-input bg-background text-foreground px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="">Select type...</option>
          <option value="safety">🛡️ Safety Check</option>
          <option value="donation">💝 Donation Pledge</option>
          <option value="volunteer">🙋 Volunteer Registration</option>
        </select>
        {surveyType === "volunteer" && (
          <p className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-md px-3 py-2">
            Volunteer template pre-loaded — questions are editable below.
          </p>
        )}
        {surveyType === "donation" && (
          <p className="text-xs text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-950/20 border border-pink-200 dark:border-pink-800 rounded-md px-3 py-2">
            Donation template pre-loaded — questions are editable below. For monetary donations, add payment channel details (GCash, bank transfer, PayPal, etc.) to your survey title or description.
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="crisis_id" className="text-sm font-semibold">Related Crisis *</Label>
        <select
          id="crisis_id"
          name="crisis_id"
          required
          className="flex h-9 w-full rounded-md border border-input bg-background text-foreground px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="">Select a crisis...</option>
          {crises.map((c) => (
            <option key={c.id} value={c.id}>{c.name || c.type} — {Array.isArray(c.affected_areas) ? c.affected_areas.join(", ") : c.affected_areas}</option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold">Questions *</Label>
          <span className="text-xs text-muted-foreground">{questions.length} question{questions.length !== 1 ? "s" : ""}</span>
        </div>

        {questions.map((q, idx) => (
          <div key={q.id} className="rounded-lg border bg-card p-4 space-y-3">
            <div className="flex items-start gap-2">
              <GripVertical className="h-4 w-4 text-muted-foreground mt-2.5 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Q{idx + 1}</span>
                  <select
                    value={q.type}
                    onChange={(e) => updateQuestion(q.id, {
                      type: e.target.value as SurveyQuestion["type"],
                      options: e.target.value !== "text" ? [""] : undefined
                    })}
                    className="text-xs h-7 rounded border border-input bg-transparent px-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="text">Short Answer</option>
                    <option value="radio">Single Choice</option>
                    <option value="checkbox">Multiple Choice</option>
                  </select>
                </div>
                <Input
                  value={q.text}
                  onChange={(e) => updateQuestion(q.id, { text: e.target.value })}
                  placeholder="Enter your question..."
                  className="h-9 text-sm"
                />
                {(q.type === "radio" || q.type === "checkbox") && (
                  <div className="space-y-2 pl-2">
                    {(q.options || []).map((opt, optIdx) => (
                      <div key={optIdx} className="flex items-center gap-2">
                        <div className={`flex-shrink-0 w-3.5 h-3.5 rounded-${q.type === "radio" ? "full" : "sm"} border-2 border-muted-foreground`} />
                        <Input
                          value={opt}
                          onChange={(e) => updateOption(q.id, optIdx, e.target.value)}
                          placeholder={`Option ${optIdx + 1}`}
                          className="h-7 text-xs flex-1"
                        />
                        <button type="button" onClick={() => removeOption(q.id, optIdx)} className="p-1 hover:text-destructive transition-colors">
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    <button type="button" onClick={() => addOption(q.id)} className="text-xs text-primary hover:underline flex items-center gap-1 pl-5">
                      <Plus className="h-3 w-3" />Add option
                    </button>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeQuestion(q.id)}
                disabled={questions.length <= 1}
                className="p-1.5 rounded hover:bg-destructive/10 hover:text-destructive transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        <Button type="button" variant="outline" onClick={addQuestion} className="w-full border-dashed gap-2 text-muted-foreground hover:text-foreground">
          <Plus className="h-4 w-4" />Add Question
        </Button>
      </div>

      {state?.error && (
        <div className="p-3 rounded-md bg-destructive/10 border border-destructive/30 text-sm text-destructive">{state.error}</div>
      )}

      <Button type="submit" disabled={isPending} className="w-full h-11 gap-2 font-semibold">
        {isPending ? (
          <><Loader2 className="h-4 w-4 animate-spin" />Creating Survey...</>
        ) : (
          <><ClipboardList className="h-4 w-4" />Create & Publish Survey</>
        )}
      </Button>
    </form>
  );
}