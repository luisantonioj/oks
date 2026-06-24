import type { Office, Stakeholder, UserRole } from "@/types/database";

export type { UserRole };

export interface BaseUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  age?: number | null;
  contact?: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminProfile extends BaseUser {
  role: "admin";
}

export type OfficeProfile = Office;
export type StakeholderProfile = Stakeholder;

export type UserProfile = AdminProfile | OfficeProfile | StakeholderProfile;
