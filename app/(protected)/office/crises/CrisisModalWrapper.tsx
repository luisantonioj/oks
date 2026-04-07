// app/(protected)/office/crises/CrisisModalWrapper.tsx
"use client";

import { useState } from "react";
import { CrisisModal, CrisisFormState } from "../../../../components/crisis/CrisisModal";
import { defaultFeatures } from "../../../../components/crisis/crisis.data";
import { CrisisFeatures } from "../../../../components/crisis/crisis.types";

const emptyForm: CrisisFormState = {
  name: "",
  type: "",
  summary: "",
  affected_areas: "",
  severity: "medium", // Important: Default severity
  required_actions: "",
};

export function CrisisModalWrapper() {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<CrisisFormState>(emptyForm);
  const [features, setFeatures] = useState<CrisisFeatures>({ ...defaultFeatures });

  function openCreate() {
    setForm(emptyForm);
    setFeatures({ ...defaultFeatures });
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
    setForm(emptyForm);
    setFeatures({ ...defaultFeatures });
  }

  return (
    <>
      <button
        onClick={openCreate}
        className="inline-flex items-center gap-2 bg-[#00C48C] hover:bg-[#00a876] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
      >
        <span className="text-lg leading-none">+</span> New Crisis
      </button>

      {isOpen && (
        <CrisisModal
          mode="create"
          form={form}
          features={features}
          onClose={closeModal}
          onFormChange={(updates) => setForm((prev) => ({ ...prev, ...updates }))}
          onToggleFeature={(key) => setFeatures((prev) => ({ ...prev, [key]: !prev[key] }))}
        />
      )}
    </>
  );
}