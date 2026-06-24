// types/database.ts
import type { Database } from "@/types/supabase";

export type Tables = Database["public"]["Tables"];
export type TableName = keyof Tables;
export type TableRow<T extends TableName> = Tables[T]["Row"];
export type TableInsert<T extends TableName> = Tables[T]["Insert"];
export type TableUpdate<T extends TableName> = Tables[T]["Update"];

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

export type Office = Omit<TableRow<"office">, "created_at" | "office_name" | "role" | "updated_at"> & {
  created_at: string;
  office_name: string;
  role: "office";
  updated_at: string;
};
export type Stakeholder = Omit<TableRow<"stakeholder">, "created_at" | "role" | "updated_at"> & {
  created_at: string;
  role: "stakeholder";
  updated_at: string;
};
export type Announcement = Omit<
  TableRow<"announcement">,
  "created_at" | "crisis_id" | "office_id" | "priority" | "updated_at"
> & {
  created_at: string;
  crisis_id: string;
  office_id: string;
  priority: string;
  updated_at: string;
};
export type Survey = Omit<
  TableRow<"survey">,
  "created_at" | "crisis_id" | "office_id" | "questions" | "status" | "survey_type" | "updated_at"
> & {
  created_at: string;
  crisis_id: string;
  office_id: string;
  questions: string;
  status: SurveyStatus;
  survey_type: SurveyType;
  updated_at: string;
};
export type SurveyResponse = Omit<
  TableRow<"survey_response">,
  "answers" | "created_at" | "stakeholder_id" | "survey_id"
> & {
  answers: string;
  created_at: string;
  stakeholder_id: string;
  survey_id: string;
};
export type HelpRequest = Omit<
  TableRow<"help_request">,
  "created_at" | "crisis_id" | "location" | "stakeholder_id" | "status" | "updated_at"
> & {
  created_at: string;
  crisis_id: string;
  location: string;
  stakeholder_id: string;
  status: HelpRequestStatus;
  updated_at: string;
};
export type ProgressReport = Omit<
  TableRow<"progress_report">,
  "created_at" | "crisis_id" | "icon" | "office_id" | "title"
> & {
  created_at: string;
  crisis_id: string;
  icon: string;
  office_id: string;
  title: string;
};
export type AuditLog = Omit<TableRow<"audit_log">, "metadata"> & {
  metadata: Record<string, unknown> | null;
};

export type AnnouncementInsert = TableInsert<"announcement">;
export type AnnouncementUpdate = TableUpdate<"announcement">;
export type CrisisInsert = Omit<TableInsert<"crisis">, "features"> & {
  features?: Partial<CrisisFeatures> | null;
};
export type CrisisUpdate = Omit<TableUpdate<"crisis">, "features"> & {
  features?: Partial<CrisisFeatures> | null;
};
export type HelpRequestInsert = TableInsert<"help_request">;
export type HelpRequestUpdate = TableUpdate<"help_request">;
export type MessageInsert = TableInsert<"message">;
export type OfficeUpdate = TableUpdate<"office">;
export type ProgressReportInsert = TableInsert<"progress_report">;
export type ProgressReportUpdate = TableUpdate<"progress_report">;
export type StakeholderUpdate = TableUpdate<"stakeholder">;
export type SurveyInsert = TableInsert<"survey">;
export type SurveyUpdate = TableUpdate<"survey">;
export type SurveyResponseInsert = TableInsert<"survey_response">;

export type Crisis = Omit<
  TableRow<"crisis">,
  "affected_areas" | "created_at" | "features" | "name" | "office_id" | "severity" | "status" | "updated_at"
> & {
  affected_areas: string[];
  created_at: string;
  features?: Partial<CrisisFeatures>;
  name: string;
  office_id: string;
  severity: string;
  status: CrisisStatus;
  updated_at: string;
  help_requests?: Array<{
    id: string;
    name?: string;
    location?: string;
    status?: HelpRequestStatus;
    time?: string;
  }>;
  announcements?: Announcement[];
  progress_updates?: ProgressReport[];
  volunteers?: number;
  donations_count?: number;
};

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

export interface CrisisWithAnnouncements extends Crisis {
  announcements: Announcement[];
}
