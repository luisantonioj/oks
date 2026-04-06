"use client";

// components/office-profile-client.tsx
import { useState } from "react";

interface ProfileData {
  name: string;
  email: string;
  age: string;
  gender: string;
  contact: string;
  office_name: string;
  role: string;
  created_at: string;
  updated_at: string;
}

interface Props {
  initialData: ProfileData;
  userId?: string;
}

export function OfficeProfileClient({ initialData }: Props) {
  const [editing, setEditing] = useState(false);
  const [data, setData] = useState<ProfileData>(initialData);
  const [draft, setDraft] = useState<ProfileData>(initialData);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const firstName = data.name.split(" ")[0];

  function handleChange(key: keyof ProfileData, value: string) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function handleCancel() {
    setDraft(data);
    setEditing(false);
  }

  async function handleSave() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setData(draft);
    setSaving(false);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const memberSince = new Date(data.created_at).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
  const lastUpdated = new Date(data.updated_at).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Your office account information and settings.</p>
        </div>
        {!editing ? (
          <button
            onClick={() => { setDraft(data); setEditing(true); }}
            className="text-sm font-semibold bg-foreground text-background px-4 py-2 rounded-xl hover:opacity-90 transition-opacity"
          >
            Edit Profile
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              className="text-sm font-medium border border-border px-4 py-2 rounded-xl hover:bg-accent transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="text-sm font-semibold bg-foreground text-background px-4 py-2 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        )}
      </div>

      {saved && (
        <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">
          <span className="text-green-600 dark:text-green-400 text-sm font-medium">✓ Profile updated successfully.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">

        {/* Left: Identity card — no Quick Links */}
        <div className="bg-card border border-border rounded-2xl p-6 flex flex-col items-center text-center h-fit">
          <div className="w-20 h-20 rounded-full bg-blue-500/20 border-2 border-blue-500/30 flex items-center justify-center text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">
            {firstName[0]?.toUpperCase()}
          </div>
          <p className="text-base font-bold">{data.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5 mb-3">{data.email}</p>
          <span className="text-xs font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded-full">
            Office Staff
          </span>
          <span className="text-xs font-medium bg-muted text-muted-foreground border border-border px-2.5 py-1 rounded-full mt-2">
            {data.office_name}
          </span>
        </div>

        {/* Right: Info sections */}
        <div className="space-y-5">

          {/* Personal Information */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <p className="text-sm font-semibold">Personal Information</p>
              <p className="text-xs text-muted-foreground mt-0.5">Your basic account details</p>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Full Name */}
              <div>
                <p className="text-xs text-muted-foreground mb-1">Full Name</p>
                {editing ? (
                  <input
                    type="text"
                    value={draft.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="w-full text-sm border border-border rounded-lg px-3 py-1.5 bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                ) : (
                  <p className="text-sm font-medium">{data.name}</p>
                )}
              </div>
              {/* Email — read only */}
              <div>
                <p className="text-xs text-muted-foreground mb-1">Email Address</p>
                <p className="text-sm font-medium">{data.email}</p>
              </div>
              {/* Age */}
              <div>
                <p className="text-xs text-muted-foreground mb-1">Age</p>
                {editing ? (
                  <input
                    type="number"
                    value={draft.age}
                    onChange={(e) => handleChange("age", e.target.value)}
                    className="w-full text-sm border border-border rounded-lg px-3 py-1.5 bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                ) : (
                  <p className="text-sm font-medium">{data.age || "—"}</p>
                )}
              </div>
              {/* Gender */}
              <div>
                <p className="text-xs text-muted-foreground mb-1">Gender</p>
                {editing ? (
                  <select
                    value={draft.gender}
                    onChange={(e) => handleChange("gender", e.target.value)}
                    className="w-full text-sm border border-border rounded-lg px-3 py-1.5 bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                ) : (
                  <p className="text-sm font-medium">{data.gender || "—"}</p>
                )}
              </div>
              {/* Contact */}
              <div>
                <p className="text-xs text-muted-foreground mb-1">Contact Number</p>
                {editing ? (
                  <input
                    type="text"
                    value={draft.contact}
                    onChange={(e) => handleChange("contact", e.target.value)}
                    className="w-full text-sm border border-border rounded-lg px-3 py-1.5 bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                ) : (
                  <p className="text-sm font-medium">{data.contact || "—"}</p>
                )}
              </div>
              {/* Role */}
              <div>
                <p className="text-xs text-muted-foreground mb-1">Role</p>
                <p className="text-sm font-medium">Office Staff</p>
              </div>
            </div>
          </div>

          {/* Office Information — read only */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <p className="text-sm font-semibold">Office Information</p>
              <p className="text-xs text-muted-foreground mt-0.5">Your assigned office and responsibilities</p>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Office Name</p>
                <p className="text-sm font-medium">{data.office_name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Office Role</p>
                <p className="text-sm font-medium">office</p>
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <p className="text-sm font-semibold">Account Details</p>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Member Since</p>
                <p className="text-sm font-medium">{memberSince}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Last Updated</p>
                <p className="text-sm font-medium">{lastUpdated}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}