// app/(protected)/office/reports/OfficeReportsClient.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Report, ReportCrisis } from "../../../../components/reports/reports.data";
import { ReportsSidebar } from "../../../../components/reports/ReportsSidebar";
import { ReportsFeed } from "../../../../components/reports/ReportsFeed";
import { ReportsModal, ReportFormState } from "../../../../components/reports/ReportsModal";
import { createProgressReport } from "@/app/actions/report";

interface OfficeReportsClientProps {
  initialReports: Report[];
  crises: ReportCrisis[];
  officeName: string;
}

export function OfficeReportsClient({ initialReports, crises, officeName }: OfficeReportsClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const emptyForm: ReportFormState = {
    crisis_id: "", title: "", content: "", posted_by: officeName,
  };

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
    setForm(emptyForm);
    setSelectedIcon("📦");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.crisis_id || !form.title.trim() || !form.content.trim()) {
      setFormError("Please fill in all required fields.");
      return;
    }

    setFormError("");
    
    // Use transition to show a loading state while saving to DB
    startTransition(async () => {
      try {
        await createProgressReport({
          crisis_id: form.crisis_id,
          title: form.title.trim(),
          content: form.content.trim(),
          icon: selectedIcon,
        });
        
        setFormSuccess(true);
        setTimeout(() => { 
          closeModal();
          router.refresh(); // Tells Next.js to fetch the new DB data
        }, 1500);
      } catch (error: any) {
        setFormError(error.message || "Failed to post update.");
      }
    });
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
            disabled={isPending}
            className="inline-flex items-center gap-2 bg-[#00C48C] hover:bg-[#00a876] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50"
          >
            📝 {isPending ? "Posting..." : "Add Update"}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex gap-6 items-start">
          <ReportsSidebar
            crises={crises}
            reports={initialReports}
            filterCrisis={filterCrisis}
            onFilter={setFilterCrisis}
          />
          <ReportsFeed
            reports={initialReports}
            crises={crises}
            filterCrisis={filterCrisis}
          />
        </div>
      </div>

      {/* Modal */}
      {showForm && (
        <ReportsModal
          crises={crises}
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