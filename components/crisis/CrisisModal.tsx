// components/crisis/CrisisModal.tsx
"use client";

import { useActionState, useEffect } from "react";
import { createCrisis, updateCrisis, CrisisActionState } from "@/app/actions/crisis"; 
import { CrisisFeatures } from "./crisis.types";
import { crisisTypes, optionalFeatures } from "./crisis.data";

export type CrisisFormState = {
  id?: string;
  name: string;
  type: string;
  summary: string;
  affected_areas: string;
  severity: string;
  required_actions: string;
};

interface CrisisModalProps {
  mode: "create" | "edit";
  form: CrisisFormState;
  features: CrisisFeatures;
  onClose: () => void;
  onFormChange: (updates: Partial<CrisisFormState>) => void;
  onToggleFeature: (key: keyof CrisisFeatures) => void;
}

// 1. Define the type for the Action State
type ActionState = {
  error?: string;
  success?: boolean;
};

// 2. Define a clean initial state
const initialState: ActionState = {};

export function CrisisModal({
  mode, form, features,
  onClose, onFormChange, onToggleFeature,
}: CrisisModalProps) {
  const isCreate = mode === "create";
  const titleText = isCreate ? "Create New Crisis" : "Edit Crisis";
  const submitLabel = isCreate ? "Create Crisis" : "Save Changes";
  
  // 3. Pass the typed initial state here!
  const actionToUse = isCreate ? createCrisis : updateCrisis;
  const [state, formAction, isPending] = useActionState(actionToUse, initialState);

  // Note: We don't actually need an effect to close the modal on success 
  // because the Server Action triggers a full route redirect on success!
  // If it doesn't redirect, it means there was an error, which we show in the UI.

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-border">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-card rounded-t-2xl">
          <h2 className="font-bold text-foreground text-lg">{titleText}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-xl leading-none">×</button>
        </div>

        <form action={formAction} className="p-6 space-y-4">
          
          {/* HIDDEN INPUTS */}
          <input type="hidden" name="severity" value={form.severity} />
          {features.notify_stakeholders && <input type="hidden" name="feature_notify" value="on" />}
          {features.sound_alarm && <input type="hidden" name="feature_alarm" value="on" />}
          {features.request_backup && <input type="hidden" name="feature_backup" value="on" />}
          {features.lockdown_areas && <input type="hidden" name="feature_lockdown" value="on" />}
          {mode === "edit" && form.id && <input type="hidden" name="id" value={form.id} />}
          <input type="hidden" name="severity" value={form.severity} />

          {/* Crisis Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Crisis Name <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              name="name" 
              defaultValue={form.name || ""} 
              onChange={(e) => onFormChange({ name: e.target.value })}
              placeholder="e.g., Typhoon... Earthquake..."
              required
              className="w-full text-sm border border-input rounded-lg px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Crisis Type */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Crisis Type <span className="text-destructive">*</span>
            </label>
            <select
              name="type" 
              defaultValue={form.type}
              onChange={(e) => onFormChange({ type: e.target.value })}
              required
              className="w-full text-sm border border-input rounded-lg px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select a type...</option>
              {crisisTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* Summary */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Summary <span className="text-destructive">*</span>
            </label>
            <textarea
              name="summary" 
              rows={3}
              defaultValue={form.summary}
              onChange={(e) => onFormChange({ summary: e.target.value })}
              required
              placeholder="Brief description of the crisis situation..."
              className="w-full text-sm border border-input rounded-lg px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          {/* Immediate Actions Required */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Immediate Actions Required
            </label>
            <textarea
              name="required_actions" 
              rows={2}
              defaultValue={form.required_actions || ""}
              onChange={(e) => onFormChange({ required_actions: e.target.value })}
              placeholder="e.g., Evacuate immediately, avoid North Wing..."
              className="w-full text-sm border border-input rounded-lg px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          {/* Affected Areas */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Affected Areas <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              name="affected_areas" 
              defaultValue={form.affected_areas}
              onChange={(e) => onFormChange({ affected_areas: e.target.value })}
              required
              placeholder="e.g., Lipa City, Batangas City, Taal"
              className="w-full text-sm border border-input rounded-lg px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <p className="text-xs text-muted-foreground mt-1">Separate multiple areas with commas</p>
          </div>

          {/* Severity */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Severity</label>
            <div className="flex gap-3">
              {[
                { value: "low",    label: "🟡 Low" },
                { value: "medium", label: "🟠 Medium" },
                { value: "high",   label: "🔴 High" },
              ].map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => onFormChange({ severity: s.value })}
                  className={`flex-1 text-sm font-medium py-2 rounded-lg border transition-colors ${
                    form.severity === s.value
                      ? s.value === "high"
                        ? "bg-destructive/10 border-destructive text-destructive"
                        : s.value === "medium"
                        ? "bg-orange-100 border-orange-400 text-orange-700 dark:bg-orange-900/20 dark:border-orange-600 dark:text-orange-400"
                        : "bg-yellow-100 border-yellow-400 text-yellow-700 dark:bg-yellow-900/20 dark:border-yellow-600 dark:text-yellow-400"
                      : "border-border text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Optional Features */}
          <div>
            <p className="text-sm font-medium text-foreground mb-0.5">Optional Features</p>
            <p className="text-xs text-muted-foreground mb-3">
              Home and Announcements are always enabled. Toggle the rest as needed.
            </p>

            <div className="space-y-2">
              {optionalFeatures.map((f) => (
                <div
                  key={f.key}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg border transition-colors ${
                    features[f.key] ? "bg-[#00C48C]/5 border-[#00C48C]/30" : "bg-muted/30 border-border"
                  }`}
                >
                  <div>
                    <p className={`text-sm font-medium ${features[f.key] ? "text-foreground" : "text-muted-foreground"}`}>
                      {f.label}
                    </p>
                    <p className="text-xs text-muted-foreground">{f.desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onToggleFeature(f.key)}
                    className={`relative w-10 h-5 rounded-full transition-colors focus:outline-none ${
                      features[f.key] ? "bg-[#00C48C]" : "bg-muted-foreground/30"
                    }`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      features[f.key] ? "translate-x-5" : "translate-x-0"
                    }`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Server Feedback */}
          {state?.error && (
            <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">{state.error}</p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="flex-1 text-sm font-medium py-2.5 rounded-lg border border-border text-foreground hover:bg-accent transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 text-sm font-semibold py-2.5 rounded-lg bg-[#00C48C] hover:bg-[#00a876] text-white transition-colors"
            >
              {isPending ? "Creating..." : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}