// components/reports/reports.data.ts

export type Report = {
  id: string;
  crisis: string;
  crisis_id: string;
  title: string;
  content: string;
  icon: string;
  posted_by: string;
  posted_at: string;
  timestamp: number;
};

export type ReportCrisis = {
  id: string;
  name: string;
  status: string;
};

export const dummyCrises: ReportCrisis[] = [
  { id: "crisis-001", name: "Typhoon Jacinto",    status: "active"   },
  { id: "crisis-002", name: "Earthquake Batangas", status: "active"   },
  { id: "crisis-003", name: "Flood — Lipa City",  status: "resolved" },
];

export const iconOptions = ["🍱", "🏥", "👥", "🏗️", "🚒", "✅", "📦", "💧", "⚡", "🔧"];

export const officeOptions = ["CIO Office", "ISESSO", "ICTC"];

export const initialReports: Report[] = [
  {
    id: "rpt-1",
    crisis: "Typhoon Jacinto",
    crisis_id: "crisis-001",
    title: "Food Distribution",
    content: "Food distribution center in Barangay San Miguel is now fully operational. Serving 500+ families daily. Volunteers are coordinating smoothly with barangay officials.",
    icon: "🍱",
    posted_by: "CIO Office",
    posted_at: "May 20, 2025, 12:15 PM",
    timestamp: new Date("2025-05-20T12:15:00").getTime(),
  },
  {
    id: "rpt-2",
    crisis: "Typhoon Jacinto",
    crisis_id: "crisis-001",
    title: "Medical Team Deployed",
    content: "Medical team successfully treated 45 patients today. Minor injuries mostly, everyone is recovering well. First aid stations are operational at 3 evacuation centers.",
    icon: "🏥",
    posted_by: "ISESSO",
    posted_at: "May 20, 2025, 11:30 AM",
    timestamp: new Date("2025-05-20T11:30:00").getTime(),
  },
  {
    id: "rpt-3",
    crisis: "Typhoon Jacinto",
    crisis_id: "crisis-001",
    title: "Youth Volunteer Cleanup",
    content: "Youth volunteers organized a cleanup drive on Main Street. Amazing community spirit! Over 60 volunteers participated clearing debris from 3 barangays.",
    icon: "👥",
    posted_by: "CIO Office",
    posted_at: "May 20, 2025, 07:00 AM",
    timestamp: new Date("2025-05-20T07:00:00").getTime(),
  },
  {
    id: "rpt-4",
    crisis: "Earthquake Batangas",
    crisis_id: "crisis-002",
    title: "Search & Rescue Complete",
    content: "Search and rescue operations completed. All trapped individuals have been safely evacuated. Structural assessment teams are now conducting building inspections.",
    icon: "🚒",
    posted_by: "ISESSO",
    posted_at: "May 19, 2025, 10:00 AM",
    timestamp: new Date("2025-05-19T10:00:00").getTime(),
  },
  {
    id: "rpt-5",
    crisis: "Flood — Lipa City",
    crisis_id: "crisis-003",
    title: "Cleanup Complete",
    content: "Community cleanup operations completed. All evacuation centers are now closed. Families have returned to their homes and normalcy is restored.",
    icon: "✅",
    posted_by: "CIO Office",
    posted_at: "May 14, 2025, 04:00 PM",
    timestamp: new Date("2025-05-14T16:00:00").getTime(),
  },
];