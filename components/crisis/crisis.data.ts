// components/crisis/crisis.data.ts

import { Crisis, CrisisFeatures } from "./crisis.types";

export const crisisTypes = [
  "Typhoon", "Earthquake", "Flood", "Fire",
  "Volcanic Eruption", "Landslide", "Tsunami", "Other",
];

export const optionalFeatures: { key: keyof CrisisFeatures; label: string; desc: string }[] = [
  { key: "survey",      label: "📋 Survey",      desc: "Collect safety status from stakeholders" },
  { key: "help_button", label: "🆘 Help Button",  desc: "Allow stakeholders to request assistance" },
  { key: "progress",    label: "📊 Progress",     desc: "Post community response updates" },
  { key: "donation",    label: "💝 Donation",     desc: "Accept donation pledges for relief" },
  { key: "volunteer",   label: "🙋 Volunteer",    desc: "Coordinate community volunteers" },
];

export const defaultFeatures: CrisisFeatures = {
  survey: true, help_button: true, progress: true, donation: true, volunteer: true,
};

export const emptyForm = {
  name: "", type: "", summary: "", affected_areas: "", severity: "high",
};

export const initialCrises: Crisis[] = [
  {
    id: "crisis-001",
    name: "Typhoon Jacinto",
    type: "Category 4 Typhoon",
    summary: "A strong typhoon making landfall in Northern Luzon with wind speeds of 150 km/h and storm surges of up to 4 meters expected.",
    description: "Typhoon Jacinto is a Category 4 super typhoon currently making landfall in Northern Luzon, Philippines. The storm is generating sustained winds of 150 km/h with gusts reaching 200 km/h. Storm surges of up to 4 meters are expected along coastal areas.",
    affected_areas: ["Lipa City", "Batangas City", "Malvar", "Mataasnakahoy"],
    severity: "high",
    status: "active",
    students_at_risk: 200,
    created_at: "2025-05-20T08:00:00Z",
    updated_at: "2025-05-20T14:30:00Z",
    help_requests: [
      { id: "hr-1", name: "Maria Santos", location: "Brgy. Tambo, Lipa City", status: "pending", time: "2 hours ago" },
      { id: "hr-2", name: "Juan Dela Cruz", location: "Brgy. Dagatan, Batangas City", status: "resolved", time: "5 hours ago" },
    ],
    announcements: [
      { id: "ann-1", title: "Answer the Survey", content: "Please answer the safety survey.", posted_at: "May 20, 2025, 10:32 AM" },
    ],
    progress_updates: [
      { id: "pu-1", title: "Food Distribution", content: "Serving 500+ families daily.", time: "15 minutes ago", icon: "🍱" },
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
    description: "A magnitude 6.2 earthquake struck Batangas province at 3:22 AM local time. The epicenter was located 15km southwest of Batangas City at a depth of 10km.",
    affected_areas: ["Batangas City", "Taal", "Lemery"],
    severity: "high",
    status: "active",
    students_at_risk: 85,
    created_at: "2025-05-18T03:22:00Z",
    updated_at: "2025-05-19T10:00:00Z",
    help_requests: [
      { id: "hr-4", name: "Pedro Ramirez", location: "Taal, Batangas", status: "pending", time: "3 hours ago" },
    ],
    announcements: [
      { id: "ann-3", title: "Structural Safety Advisory", content: "Do not enter buildings that show visible cracks.", posted_at: "May 18, 2025, 06:00 AM" },
    ],
    progress_updates: [
      { id: "pu-5", title: "Search & Rescue", content: "All trapped individuals safely evacuated.", time: "2 hours ago", icon: "🚒" },
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
    description: "Intense monsoon rainfall over 24 hours caused flash flooding in several barangays of Lipa City. Water levels reached up to 1.5 meters.",
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
      { id: "ann-4", title: "All Clear — Flood Subsided", content: "Flood waters have fully receded.", posted_at: "May 14, 2025, 04:00 PM" },
    ],
    progress_updates: [
      { id: "pu-6", title: "Cleanup Complete", content: "All evacuation centers now closed.", time: "4 days ago", icon: "✅" },
    ],
    volunteers: 14,
    donations_count: 31,
    features: { survey: false, help_button: true, progress: true, donation: true, volunteer: true },
  },
];