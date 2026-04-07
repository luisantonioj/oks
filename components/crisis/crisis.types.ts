// components/crisis/crisis.types.ts

export type CrisisFeatures = {
  survey: boolean;
  help_button: boolean;
  progress: boolean;
  donation: boolean;
  volunteer: boolean;
  notify_stakeholders?: boolean;
  sound_alarm?: boolean;
  request_backup?: boolean;
  lockdown_areas?: boolean;
};

export type Crisis = {
  id: string;
  name: string;
  type: string;
  summary: string;
  description: string;
  affected_areas: string[];
  severity: string;
  status: string;
  required_actions?: string;
  resolution_notes?: string;
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