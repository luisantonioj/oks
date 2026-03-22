// app/(protected)/office/crises/[id]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";

// --- TYPES ---
type CrisisFeatures = {
  survey: boolean;
  help_button: boolean;
  progress: boolean;
  donation: boolean;
  volunteer: boolean;
};

type Crisis = {
  id: string;
  name: string;
  type: string;
  summary: string;
  description: string;
  affected_areas: string[];
  severity: string;
  status: string;
  students_at_risk: number;
  created_at: string;
  updated_at: string;
  help_requests: { id: string; name: string; location: string; status: string; time: string }[];
  announcements: { id: string; title: string; content: string; posted_at: string }[];
  progress_updates: { id: string; title: string; content: string; time: string; icon: string }[];
  volunteers: number;
  donations_count: number;
  features: CrisisFeatures;
};

// --- DUMMY DATA ---
const dummyCrises: Crisis[] = [
  {
    id: "crisis-001",
    name: "Typhoon Jacinto",
    type: "Category 4 Typhoon",
    summary: "A strong typhoon making landfall in Northern Luzon with wind speeds of 150 km/h and storm surges of up to 4 meters expected.",
    description: "Typhoon Jacinto is a Category 4 super typhoon currently making landfall in Northern Luzon, Philippines. The storm is generating sustained winds of 150 km/h with gusts reaching 200 km/h. Storm surges of up to 4 meters are expected along coastal areas. PAGASA has issued Typhoon Signal No. 4 for several provinces in Batangas.",
    affected_areas: ["Lipa City", "Batangas City", "Malvar", "Mataasnakahoy", "Lima"],
    severity: "high",
    status: "active",
    students_at_risk: 200,
    created_at: "2025-05-20T08:00:00Z",
    updated_at: "2025-05-20T14:30:00Z",
    help_requests: [
      { id: "hr-1", name: "Maria Santos", location: "Brgy. Tambo, Lipa City", status: "pending", time: "2 hours ago" },
      { id: "hr-2", name: "Juan Dela Cruz", location: "Brgy. Dagatan, Batangas City", status: "resolved", time: "5 hours ago" },
      { id: "hr-3", name: "Ana Reyes", location: "Malvar, Batangas", status: "pending", time: "1 hour ago" },
    ],
    announcements: [
      { id: "ann-1", title: "Answer the Survey", content: "Please answer the safety survey to help us assess your current situation and provide timely assistance.", posted_at: "May 20, 2025, 10:32 AM" },
      { id: "ann-2", title: "Reminder: Stay Indoors", content: "All DLSL stakeholders are advised to stay indoors and avoid flood-prone areas. Classes are suspended.", posted_at: "May 20, 2025, 09:00 AM" },
    ],
    progress_updates: [
      { id: "pu-1", title: "Food Distribution", content: "Food distribution center in Barangay San Miguel is now fully operational. Serving 500+ families daily.", time: "15 minutes ago", icon: "🍱" },
      { id: "pu-2", title: "Medical Team", content: "Medical team successfully treated 45 patients today. Minor injuries mostly, everyone is recovering well.", time: "30 minutes ago", icon: "🏥" },
    ],
    volunteers: 18,
    donations_count: 45,
    features: { survey: true, help_button: true, progress: true, donation: true, volunteer: true },
  },
  {
    id: "crisis-002",
    name: "Earthquake Batangas",
    type: "Magnitude 6.2 Earthquake",
    summary: "A strong earthquake struck Batangas province causing structural damage to several buildings and infrastructure.",
    description: "A magnitude 6.2 earthquake struck Batangas province at 3:22 AM local time. The epicenter was located 15km southwest of Batangas City at a depth of 10km. Several buildings reported structural damage and aftershocks continue to be felt.",
    affected_areas: ["Batangas City", "Taal", "Lemery"],
    severity: "high",
    status: "active",
    students_at_risk: 85,
    created_at: "2025-05-18T03:22:00Z",
    updated_at: "2025-05-19T10:00:00Z",
    help_requests: [
      { id: "hr-4", name: "Pedro Ramirez", location: "Taal, Batangas", status: "pending", time: "3 hours ago" },
      { id: "hr-5", name: "Luisa Garcia", location: "Lemery, Batangas", status: "resolved", time: "8 hours ago" },
    ],
    announcements: [
      { id: "ann-3", title: "Structural Safety Advisory", content: "Do not enter buildings that show visible cracks or damage. Report any unsafe structures to ISESSO immediately.", posted_at: "May 18, 2025, 06:00 AM" },
    ],
    progress_updates: [
      { id: "pu-5", title: "Search & Rescue", content: "Search and rescue operations completed. All trapped individuals have been safely evacuated.", time: "2 hours ago", icon: "🚒" },
    ],
    volunteers: 9,
    donations_count: 23,
    features: { survey: true, help_button: true, progress: true, donation: false, volunteer: false },
  },
  {
    id: "crisis-003",
    name: "Flood — Lipa City",
    type: "Flash Flood",
    summary: "Heavy monsoon rains caused flash flooding in low-lying areas of Lipa City, displacing hundreds of families.",
    description: "Intense monsoon rainfall over 24 hours caused flash flooding in several barangays of Lipa City. Water levels reached up to 1.5 meters in the most severely affected areas. An estimated 350 families were displaced.",
    affected_areas: ["Barangay Tambo", "Barangay Halang", "Barangay Dagatan"],
    severity: "low",
    status: "resolved",
    students_at_risk: 40,
    created_at: "2025-05-10T11:00:00Z",
    updated_at: "2025-05-14T16:00:00Z",
    help_requests: [
      { id: "hr-6", name: "Rosa Villanueva", location: "Brgy. Tambo, Lipa City", status: "resolved", time: "4 days ago" },
    ],
    announcements: [
      { id: "ann-4", title: "All Clear — Flood Subsided", content: "Flood waters have fully receded. Families may return to their homes. Cleanup operations are underway.", posted_at: "May 14, 2025, 04:00 PM" },
    ],
    progress_updates: [
      { id: "pu-6", title: "Cleanup Complete", content: "Community cleanup operations completed. All evacuation centers are now closed.", time: "4 days ago", icon: "✅" },
    ],
    volunteers: 14,
    donations_count: 31,
    features: { survey: false, help_button: true, progress: true, donation: true, volunteer: true },
  },
];

// --- BADGES ---
function SeverityBadge({ severity }: { severity: string }) {
  const styles: Record<string, string> = {
    high: "bg-destructive/10 text-destructive",
    low: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
    medium: "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400",
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${styles[severity] ?? "bg-muted text-muted-foreground"}`}>
      {severity} severity
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${status === "active" ? "bg-[#00C48C] text-white" : "bg-muted text-muted-foreground"}`}>
      {status}
    </span>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString("en-PH", {
    year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

// --- PAGE ---
export default async function CrisisDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const crisis = dummyCrises.find((c) => c.id === id);

  if (!crisis) notFound();

  const { features } = crisis;

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="max-w-5xl mx-auto">
          <Link href="/office/crises" className="text-sm text-muted-foreground hover:text-[#00C48C] transition-colors flex items-center gap-1 mb-3">
            ← Back to Crisis List
          </Link>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-2xl font-bold text-foreground">{crisis.name}</h1>
                <StatusBadge status={crisis.status} />
                <span className="text-xs bg-[#00C48C]/10 text-[#00C48C] font-semibold px-2.5 py-0.5 rounded-full">{crisis.type}</span>
              </div>
              <p className="text-xs text-muted-foreground">Last updated: {formatDate(crisis.updated_at)}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {/* Edit — links back to list where modal lives */}
              <Link
                href="/office/crises"
                className="text-sm bg-muted hover:bg-accent text-foreground font-medium px-4 py-2 rounded-lg border border-border transition-colors"
              >
                ✏️ Edit
              </Link>
              {crisis.status === "active" && (
                <button className="text-sm bg-muted hover:bg-accent text-foreground font-medium px-4 py-2 rounded-lg border border-border transition-colors">
                  Mark as Resolved
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">

        {/* Crisis Overview + Affected Areas */}
        <div className="grid md:grid-cols-2 gap-5">
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-foreground">Crisis Overview</h2>
              <SeverityBadge severity={crisis.severity} />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{crisis.description}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-5">
            <h2 className="font-bold text-foreground mb-3">Affected Areas</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {crisis.affected_areas.map((area) => (
                <span key={area} className="text-sm bg-[#00C48C]/10 text-[#00C48C] font-medium px-3 py-1 rounded-full">{area}</span>
              ))}
            </div>
            <div className="pt-3 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Students at risk: <span className="font-bold text-foreground">{crisis.students_at_risk} students</span>
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-card rounded-xl border border-border p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{crisis.help_requests.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Help Requests</p>
            <p className="text-xs text-destructive font-medium mt-0.5">
              {crisis.help_requests.filter((r) => r.status === "pending").length} pending
            </p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{crisis.volunteers}</p>
            <p className="text-xs text-muted-foreground mt-1">Volunteers</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{crisis.donations_count}</p>
            <p className="text-xs text-muted-foreground mt-1">Donations</p>
          </div>
        </div>

        {/* ── SURVEY (optional) ── */}
        {features.survey && (
          <div className="bg-card rounded-xl border border-border p-5">
            <h2 className="font-bold text-foreground mb-1">Survey</h2>
            <p className="text-xs text-muted-foreground mb-4">Gather real-time safety status from stakeholders affected by this crisis.</p>
            <div className="bg-muted/40 rounded-xl p-6 text-center border border-border">
              <p className="text-2xl mb-2">📋</p>
              <h3 className="font-bold text-foreground text-base mb-1">Why Your Voice Matters</h3>
              <p className="text-sm text-muted-foreground mb-1">
                Following <span className="font-medium text-foreground">{crisis.name}</span>'s impact on our communities, we need your insights to strengthen our response strategies.
              </p>
              <p className="text-xs text-muted-foreground mb-4">This short survey takes less than 3 minutes to complete.</p>
              <div className="text-left max-w-sm mx-auto mb-5">
                <p className="text-xs font-semibold text-foreground mb-2">What you'll be asked:</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Your current preparedness level</li>
                  <li>• Knowledge of safety protocols</li>
                  <li>• Access to emergency supplies</li>
                  <li>• Suggestions for improving this app</li>
                </ul>
              </div>
              <button className="inline-flex items-center gap-2 bg-[#00C48C] hover:bg-[#00a876] text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors">
                📋 Take the Survey Now
              </button>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
              <span>0 responses so far</span>
              <Link href="/office/surveys" className="text-[#00C48C] hover:underline font-medium">Manage surveys →</Link>
            </div>
          </div>
        )}

        {/* ── HELP REQUESTS (optional) ── */}
        {features.help_button && (
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-foreground">Help Requests</h2>
              <Link href="/office/help-requests" className="text-xs text-[#00C48C] hover:underline font-medium">View all →</Link>
            </div>
            {crisis.help_requests.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No help requests yet.</p>
            ) : (
              <div className="space-y-3">
                {crisis.help_requests.map((req) => (
                  <div key={req.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{req.name}</p>
                      <p className="text-xs text-muted-foreground">{req.location}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${req.status === "pending" ? "bg-destructive/10 text-destructive" : "bg-[#00C48C]/10 text-[#00C48C]"}`}>
                        {req.status}
                      </span>
                      <p className="text-xs text-muted-foreground mt-1">{req.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── ANNOUNCEMENTS (always shown) ── */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-foreground">Announcements</h2>
            <Link href="/office/announcements" className="text-xs text-[#00C48C] hover:underline font-medium">Manage announcements →</Link>
          </div>
          {crisis.announcements.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No announcements yet.</p>
          ) : (
            <div className="space-y-3">
              {crisis.announcements.map((ann) => (
                <div key={ann.id} className="p-3 rounded-lg bg-muted/50 border border-border">
                  <div className="flex items-start justify-between">
                    <p className="text-sm font-semibold text-foreground">{ann.title}</p>
                    <p className="text-xs text-muted-foreground shrink-0 ml-4">{ann.posted_at}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{ann.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── PROGRESS (optional) ── */}
        {features.progress && (
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-foreground">Crisis Progress</h2>
              <Link href="/office/reports" className="text-xs text-[#00C48C] hover:underline font-medium">View full reports →</Link>
            </div>
            {crisis.progress_updates.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No updates yet.</p>
            ) : (
              <div className="space-y-3">
                {crisis.progress_updates.map((update) => (
                  <div key={update.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border">
                    <span className="text-xl leading-none">{update.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-foreground">{update.title}</p>
                        <p className="text-xs text-muted-foreground shrink-0 ml-4">{update.time}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{update.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── DONATION (optional) ── */}
        {features.donation && (
          <div className="bg-card rounded-xl border border-border p-5">
            <h2 className="font-bold text-foreground mb-4">Donations</h2>
            <div className="grid grid-cols-3 gap-4 mb-3">
              {[
                { icon: "💰", label: "Total Funds Raised", value: "₱0" },
                { icon: "🥫", label: "Total Food Raised", value: "0 kg" },
                { icon: "📦", label: "Other Consumables", value: "0 kg" },
              ].map((d) => (
                <div key={d.label} className="bg-muted/40 rounded-xl p-4 text-center border border-border">
                  <p className="text-2xl mb-1">{d.icon}</p>
                  <p className="text-lg font-bold text-foreground">{d.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{d.label}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground text-center">Updated in real-time</p>
          </div>
        )}

        {/* ── VOLUNTEER (optional) ── */}
        {features.volunteer && (
          <div className="bg-card rounded-xl border border-border p-5">
            <h2 className="font-bold text-foreground mb-1">Volunteer Coordination</h2>
            <p className="text-xs text-muted-foreground mb-4">Coordinating relief efforts and volunteer deployment</p>
            <div className="bg-muted/40 rounded-xl p-5 border border-border">
              <h3 className="font-semibold text-foreground text-sm mb-3">Volunteer Needs</h3>
              <p className="text-xs font-medium text-muted-foreground mb-2">Expected volunteer work:</p>
              <ul className="text-xs text-muted-foreground space-y-1 mb-5">
                <li>• Distributing food, water, and clothing</li>
                <li>• Providing emotional support and psychological first aid</li>
                <li>• Loading and unloading supplies</li>
                <li>• Cleaning up debris or damaged areas</li>
                <li>• Packing emergency kits and supplies</li>
                <li>• Conducting wellness checks on vulnerable individuals</li>
              </ul>
              <button className="inline-flex items-center gap-2 bg-[#00C48C] hover:bg-[#00a876] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors">
                🙋 Sign up to Volunteer
              </button>
            </div>
            <div className="mt-3 text-xs text-muted-foreground text-right">
              {crisis.volunteers} volunteer{crisis.volunteers !== 1 ? "s" : ""} registered
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-2">
          <Link href="/office/announcements" className="inline-flex items-center gap-2 bg-[#00C48C] hover:bg-[#00a876] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors">
            📢 Post Announcement
          </Link>
          {features.progress && (
            <Link href="/office/reports" className="inline-flex items-center gap-2 bg-muted hover:bg-accent text-foreground text-sm font-semibold px-4 py-2.5 rounded-lg border border-border transition-colors">
              📊 Add Progress Report
            </Link>
          )}
        </div>

      </div>
    </div>
  );
}