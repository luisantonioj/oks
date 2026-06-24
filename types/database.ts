// types/database.ts
import type { Database } from "@/types/supabase";

export type Tables = Database["public"]["Tables"];
export type TableName = keyof Tables;
export type TableRow<T extends TableName> = Tables[T]["Row"];
export type TableInsert<T extends TableName> = Tables[T]["Insert"];
export type TableUpdate<T extends TableName> = Tables[T]["Update"];

export type UserRole = "admin" | TableRow<"office">["role"] | TableRow<"stakeholder">["role"];
export type CrisisStatus = TableRow<"crisis">["status"];
export type HelpRequestStatus = TableRow<"help_request">["status"];
export type SurveyStatus = TableRow<"survey">["status"];
export type SurveyType = TableRow<"survey">["survey_type"];

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

export type Office = TableRow<"office">;
export type Stakeholder = TableRow<"stakeholder">;
export type Announcement = TableRow<"announcement">;
export type Survey = TableRow<"survey">;
export type SurveyResponse = TableRow<"survey_response">;
export type HelpRequest = TableRow<"help_request">;
export type ProgressReport = TableRow<"progress_report">;
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

export type Crisis = Omit<TableRow<"crisis">, "features"> & {
  features?: Partial<CrisisFeatures>;
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
