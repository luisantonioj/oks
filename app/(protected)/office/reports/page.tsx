// app/(protected)/office/reports/page.tsx
"use client";

import { useState } from "react";
import { Report, dummyCrises, initialReports } from "../../../../components/reports/reports.data";
import { ReportsSidebar } from "../../../../components/reports/ReportsSidebar";
import { ReportsFeed } from "../../../../components/reports/ReportsFeed";
import { ReportsModal, ReportFormState } from "../../../../components/reports/ReportsModal";

const emptyForm: ReportFormState = {
  crisis_id: "", title: "", content: "", posted_by: "CIO Office",
};

export default function OfficeReportsPage() {
  const [reports, setReports] = useState<Report[]>(initialReports);
  const [showForm, setShowForm] = useState(false);
  const [filterCrisis, setFilterCrisis] = useState("all");
  const [selectedIcon, setSelectedIcon] = useState("📦");
  const [form, setForm] = useState<ReportFormState>(emptyForm);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);

  function closeModal() {
    setShowForm(false);
    setFormError("");
    setFormSuccess(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.crisis_id || !form.title.trim() || !form.content.trim()) {
      setFormError("Please fill in all required fields.");
      return;
    }

    const crisis = dummyCrises.find((c) => c.id === form.crisis_id);
    const now = new Date();
    const newReport: Report = {
      id: `rpt-${Date.now()}`,
      crisis: crisis?.name ?? "Unknown",
      crisis_id: form.crisis_id,
      title: form.title.trim(),
      content: form.content.trim(),
      icon: selectedIcon,
      posted_by: form.posted_by,
      posted_at: now.toLocaleString("en-PH", {
        month: "short", day: "numeric", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      }),
      timestamp: now.getTime(),
    };

    setReports([newReport, ...reports]);
    setForm(emptyForm);
    setSelectedIcon("📦");
    setFormError("");
    setFormSuccess(true);
    setTimeout(() => { setFormSuccess(false); closeModal(); }, 1500);
  }

  return (
    <div className="min-h-screen bg-background">

      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Progress Reports</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Real-time community response and recovery updates
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 bg-[#00C48C] hover:bg-[#00a876] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            📝 Add Update
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex gap-6 items-start">
          <ReportsSidebar
            crises={dummyCrises}
            reports={reports}
            filterCrisis={filterCrisis}
            onFilter={setFilterCrisis}
          />
          <ReportsFeed
            reports={reports}
            crises={dummyCrises}
            filterCrisis={filterCrisis}
          />
        </div>
      </div>

      {/* Modal */}
      {showForm && (
        <ReportsModal
          crises={dummyCrises}
          form={form}
          selectedIcon={selectedIcon}
          formError={formError}
          formSuccess={formSuccess}
          onClose={closeModal}
          onSubmit={handleSubmit}
          onFormChange={(updates) => setForm((prev) => ({ ...prev, ...updates }))}
          onIconChange={setSelectedIcon}
        />
      )}
    </div>
  );
}