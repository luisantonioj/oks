"use client";

// components/emergency-contacts-editor.tsx
// Office staff can view and edit emergency contact numbers.
// The updated numbers are immediately reflected in this component's state.

import { useState } from "react";
import { updateEmergencyContacts } from "@/app/actions/office"; // Your server action!

export interface Contact {
  id: string;
  label: string;
  number: string;
  note: string;
  icon: string;
}

interface Props {
  officeId: string;
  initialContacts?: Contact[];
}

const DEFAULT_CONTACTS: Contact[] = [
  { id: "1", label: "DLSL Security Office",     number: "109",            note: "On-campus security & emergency dispatch",      icon: "🏫" },
  { id: "2", label: "DLSL Health Services",     number: "110",            note: "Medical assistance & first aid on campus",     icon: "🏥" },
  { id: "3", label: "ISESSO Hotline",           number: "112",            note: "Institutional Safety & Emergency Services",    icon: "🛡️" },
  { id: "4", label: "Lipa City Fire Station",   number: "(043) 756-2873", note: "Fire emergencies in Lipa City",                icon: "🚒" },
  { id: "5", label: "Lipa City Police Station", number: "(043) 756-0099", note: "Law enforcement & public safety",              icon: "🚔" },
  { id: "6", label: "National Emergency",       number: "911",            note: "Police, fire & medical emergencies",           icon: "📞" },
];

export function EmergencyContactsEditor({ officeId, initialContacts }: Props) {
  // Use data from Supabase if it exists, otherwise fall back to DEFAULT_CONTACTS
  const startingData = initialContacts && initialContacts.length > 0 ? initialContacts : DEFAULT_CONTACTS;

  const [contacts, setContacts] = useState<Contact[]>(startingData);
  const [editing, setEditing]   = useState(false);
  const [draft, setDraft]       = useState<Contact[]>(startingData);
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);

  function handleChange(id: string, field: keyof Contact, value: string) {
    setDraft((d) => d.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  }

  function handleCancel() {
    setDraft(contacts);
    setEditing(false);
  }

  async function handleSave() {
    setSaving(true);
    
    // Call your Supabase Server Action
    const result = await updateEmergencyContacts(officeId, draft);
    
    if (result.error) {
      console.error(result.error);
      alert("Failed to save emergency contacts.");
      setSaving(false);
      return;
    }

    // Success! Update local UI state
    setContacts(draft);
    setSaving(false);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">

      {/* Header */}
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-destructive/10 flex items-center justify-center flex-shrink-0">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 3.5A1.5 1.5 0 014.5 2h.879a1 1 0 01.95.684l.73 2.19a1 1 0 01-.23 1.02L5.5 6.72A9.015 9.015 0 009.28 10.5l.826-1.33a1 1 0 011.02-.23l2.19.73A1 1 0 0114 10.621V11.5A1.5 1.5 0 0112.5 13C6.701 13 2 8.299 2 2.5A1.5 1.5 0 013.5 1h.5"
                stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold">Emergency Contacts</p>
            <p className="text-xs text-muted-foreground">Shown to all stakeholders on their dashboard</p>
          </div>
        </div>

        {!editing ? (
          <button
            onClick={() => { setDraft(contacts); setEditing(true); }}
            className="text-xs font-medium border border-border px-3 py-1.5 rounded-lg hover:bg-accent transition-colors"
          >
            Edit Numbers
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              className="text-xs font-medium border border-border px-3 py-1.5 rounded-lg hover:bg-accent transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="text-xs font-semibold bg-foreground text-background px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        )}
      </div>

      {/* Save confirmation banner */}
      {saved && (
        <div className="px-5 py-2.5 bg-green-500/10 border-b border-green-500/20">
          <p className="text-xs font-medium text-green-600 dark:text-green-400">
            ✓ Emergency contacts updated. Stakeholders will see the new numbers.
          </p>
        </div>
      )}

      {/* Body */}
      <div className="p-5">
        {editing ? (
          /* ── Edit mode ── */
          <div className="space-y-3">
            {draft.map((c) => (
              <div
                key={c.id}
                className="grid grid-cols-[32px_1fr_160px] gap-3 items-center p-3 rounded-xl bg-muted/30 border border-border"
              >
                <span className="text-xl text-center">{c.icon}</span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold mb-1">{c.label}</p>
                  <input
                    type="text"
                    value={c.note}
                    onChange={(e) => handleChange(c.id, "note", e.target.value)}
                    className="w-full text-[11px] text-muted-foreground border border-border rounded-md px-2 py-1 bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                    placeholder="Short description"
                  />
                </div>
                <input
                  type="text"
                  value={c.number}
                  onChange={(e) => handleChange(c.id, "number", e.target.value)}
                  className="text-sm font-black border border-border rounded-lg px-3 py-1.5 bg-background focus:outline-none focus:ring-1 focus:ring-ring text-center"
                  placeholder="Number"
                />
              </div>
            ))}
            <p className="text-[10px] text-muted-foreground mt-1">
              Changes will be visible to all stakeholders immediately after saving.
            </p>
          </div>
        ) : (
          /* ── View mode ── */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {contacts.map((c) => (
              <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border">
                <span className="text-xl flex-shrink-0">{c.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate">{c.label}</p>
                  <p className="text-xs text-muted-foreground">{c.note}</p>
                </div>
                <p className="text-sm font-black text-foreground flex-shrink-0">{c.number}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}