// types/database.ts
export interface Office {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  office_name: string;
  age: number;
  gender: string;
  contact: string;
  created_at: string;
  updated_at: string;
}

export interface Stakeholder {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  age: number;
  community: string;
  contact: string;
  permanent_address: string;
  current_address: string;
  created_at: string;
  updated_at: string;
}

export interface Crisis {
  id: string;
  type: string;
  summary: string;
  affected_areas: string;
  severity: string;
  status: string;
  office_id: string;
  created_at: string;
  updated_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: string;
  crisis_id: string;
  office_id: string;
  created_at: string;
  updated_at: string;
}

export interface Survey {
  id: string;
  title: string;
  questions: string; // Likely JSON string or array, but schema says 'questions'
  crisis_id: string;
  office_id: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface SurveyResponse {
  id: string;
  survey_id: string;
  stakeholder_id: string;
  answers: string; // Likely JSON string
  created_at: string;
}

export interface HelpRequest {
  id: string;
  stakeholder_id: string;
  location: string;
  status: string; // Note: schema has two 'status', assuming one
  notes: string;
  crisis_id: string;
  office_id: string;
  created_at: string;
  updated_at: string;
}

export interface ProgressReport {
  id: string;
  crisis_id: string;
  content: string;
  office_id: string;
  created_at: string;
}

// Inferred from features; not in provided schema snippet, but mentioned in docs
export interface Donation {
  id: string;
  stakeholder_id: string;
  crisis_id: string;
  amount: number | null;
  items: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

// Inferred from features; not in provided schema snippet, but mentioned in docs
export interface Volunteer {
  id: string;
  stakeholder_id: string;
  crisis_id: string;
  skills: string;
  availability: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export type UserRole = "admin" | "office" | "stakeholder";

// Generic UserData, adaptable for Office or Stakeholder
export type UserData = {
  id?: string;
  name?: string;
  email?: string;
  role?: UserRole;
  age?: number;
  contact?: string;
  created_at?: string;
  updated_at?: string;
};

// Example composite type, e.g., Crisis with Announcements
export interface CrisisWithAnnouncements extends Crisis {
  announcements: Announcement[];
}