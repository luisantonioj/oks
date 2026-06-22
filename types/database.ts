// types/database.ts
export type UserRole = "admin" | "office" | "stakeholder";
export type CrisisStatus = "active" | "resolved";
export type HelpRequestStatus = "pending" | "resolved";
export type SurveyStatus = "active" | "closed";
export type SurveyType = "safety" | "donation" | "volunteer";

export interface CrisisFeatures {
  survey: boolean;
  help_button: boolean;
  progress: boolean;
  donation: boolean;
  volunteer: boolean;
  notify_stakeholders: boolean;
  sound_alarm: boolean;
  request_backup: boolean;
  lockdown_areas: boolean;
}

export interface SurveyQuestion {
  id: string;
  text: string;
  type: "text" | "radio" | "checkbox";
  options?: string[];
}

export type SurveyAnswers = Record<string, string | string[]>;

export interface Office {
  id: string;
  name: string;
  email: string;
  role: "office";
  office_name: string;
  age: number | null;
  gender: string | null;
  contact: string | null;
  created_at: string;
  updated_at: string;
}

export interface Stakeholder {
  id: string;
  name: string;
  email: string;
  role: "stakeholder";
  age: number | null;
  community: string | null;
  contact: string | null;
  permanent_address: string | null;
  current_address: string | null;
  created_at: string;
  updated_at: string;
}

export interface Crisis {
  id: string;
  name: string;
  type: string;
  summary: string | null;
  affected_areas: string[];
  severity: string;
  status: CrisisStatus;
  office_id: string;
  created_at: string;
  updated_at: string;
  required_actions?: string | null;
  resolution_notes?: string | null;
  features?: Partial<CrisisFeatures>;
  help_requests?: Array<{ id: string; name?: string; location?: string; status?: HelpRequestStatus; time?: string }>;
  announcements?: Announcement[];
  progress_updates?: ProgressReport[];
  volunteers?: number;
  donations_count?: number;
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
  survey_type: SurveyType;
  questions: string; 
  crisis_id: string;
  office_id: string;
  status: SurveyStatus;
  created_at: string;
  updated_at: string;
}

export interface SurveyResponse {
  id: string;
  survey_id: string;
  stakeholder_id: string;
  answers: string;
  created_at: string;
}

export interface HelpRequest {
  id: string;
  stakeholder_id: string;
  location: string;
  status: HelpRequestStatus;
  notes: string | null;
  crisis_id: string;
  office_id: string | null;
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

export interface AuditLog {
  id: string;
  actor_id: string;
  actor_role: string;
  actor_name: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

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
