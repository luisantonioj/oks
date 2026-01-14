// types/user.ts  (place at project root or src/types/)

export type UserRole = 'admin' | 'office' | 'stakeholder';

export interface BaseUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  age?: number;
  contact?: string;
  created_at: string;
  updated_at: string;
}

export interface AdminProfile extends BaseUser {
  role: 'admin';
  // Minimal/fixed — no extra fields
}

export interface OfficeProfile extends BaseUser {
  role: 'office';
  office_name: string;
  gender?: string;
}

export interface StakeholderProfile extends BaseUser {
  role: 'stakeholder';
  community?: string;
  permanent_address?: string;
  current_address?: string;
}

export type UserProfile =
  | AdminProfile
  | OfficeProfile
  | StakeholderProfile;