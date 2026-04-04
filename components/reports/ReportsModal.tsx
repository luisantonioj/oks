// components/reports/ReportsModal.tsx
"use client";

import { ReportCrisis, iconOptions, officeOptions } from "./reports.data";

export type ReportFormState = {
  crisis_id: string;
  title: string;
  content: string;
  posted_by: string;
};

interface ReportsModalProps {
  crises: ReportCrisis[];
  form: ReportFormState;
  selectedIcon: string;
  formError: string;
  formSuccess: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onFormChange: (updates: Partial<ReportFormState>) => void;
  onIconChange: (icon: string) => void;
}

export function ReportsModal({
  crises, form, selectedIcon, formError, formSuccess,
  onClose, onSubmit, onFormChange, onIconChange,
}: ReportsModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-border">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-card rounded-t-2xl">
          <h2 className="font-bold text-foreground text-lg">Add Progress Update</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-xl leading-none">
            ×
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-4">

          {/* Crisis */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Crisis <span className="text-destructive">*</span>
            </label>
            <select
              value={form.crisis_id}
              onChange={(e) => onFormChange({ crisis_id: e.target.value })}
              className="w-full text-sm border border-input rounded-lg px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select a crisis...</option>
              {crises.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Icon Picker */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Icon</label>
            <div className="flex flex-wrap gap-2">
              {iconOptions.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => onIconChange(icon)}
                  className={`w-9 h-9 rounded-lg text-xl flex items-center justify-center transition-all ${
                    selectedIcon === icon
                      ? "bg-[#00C48C]/20 ring-2 ring-[#00C48C]"
                      : "bg-muted hover:bg-accent"
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Update Title <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => onFormChange({ title: e.target.value })}
              placeholder="e.g., Food Distribution Update"
              className="w-full text-sm border border-input rounded-lg px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Update Details <span className="text-destructive">*</span>
            </label>
            <textarea
              rows={4}
              value={form.content}
              onChange={(e) => onFormChange({ content: e.target.value })}
              placeholder="Describe the progress update in detail..."
              className="w-full text-sm border border-input rounded-lg px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          {/* Posted By */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Posted By</label>
            <select
              value={form.posted_by}
              onChange={(e) => onFormChange({ posted_by: e.target.value })}
              className="w-full text-sm border border-input rounded-lg px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {officeOptions.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>

          {/* Feedback */}
          {formError && (
            <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">{formError}</p>
          )}
          {formSuccess && (
            <p className="text-sm text-[#00C48C] bg-[#00C48C]/10 px-3 py-2 rounded-lg">
              ✅ Progress update posted!
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 text-sm font-medium py-2.5 rounded-lg border border-border text-foreground hover:bg-accent transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 text-sm font-semibold py-2.5 rounded-lg bg-[#00C48C] hover:bg-[#00a876] text-white transition-colors"
            >
              Post Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}