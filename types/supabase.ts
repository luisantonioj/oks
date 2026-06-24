// Supabase database type boundary.
//
// Replace this file with live generated output by running `npm run db:types`
// after Supabase CLI authentication is configured.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      announcement: {
        Row: {
          id: string;
          title: string;
          content: string;
          priority: "normal" | "high" | "urgent";
          crisis_id: string;
          office_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          priority?: "normal" | "high" | "urgent";
          crisis_id: string;
          office_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          priority?: "normal" | "high" | "urgent";
          crisis_id?: string;
          office_id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "announcement_crisis_id_fkey";
            columns: ["crisis_id"];
            isOneToOne: false;
            referencedRelation: "crisis";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "announcement_office_id_fkey";
            columns: ["office_id"];
            isOneToOne: false;
            referencedRelation: "office";
            referencedColumns: ["id"];
          },
        ];
      };
      audit_log: {
        Row: {
          id: string;
          actor_id: string;
          actor_role: string;
          actor_name: string | null;
          action: string;
          entity_type: string;
          entity_id: string | null;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor_id: string;
          actor_role: string;
          actor_name?: string | null;
          action: string;
          entity_type: string;
          entity_id?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          actor_id?: string;
          actor_role?: string;
          actor_name?: string | null;
          action?: string;
          entity_type?: string;
          entity_id?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Relationships: [];
      };
      crisis: {
        Row: {
          id: string;
          name: string;
          type: string;
          summary: string | null;
          affected_areas: string[];
          severity: string;
          status: "active" | "resolved";
          office_id: string;
          required_actions: string | null;
          resolution_notes: string | null;
          features: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type: string;
          summary?: string | null;
          affected_areas: string[];
          severity: string;
          status?: "active" | "resolved";
          office_id: string;
          required_actions?: string | null;
          resolution_notes?: string | null;
          features?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: string;
          summary?: string | null;
          affected_areas?: string[];
          severity?: string;
          status?: "active" | "resolved";
          office_id?: string;
          required_actions?: string | null;
          resolution_notes?: string | null;
          features?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "crisis_office_id_fkey";
            columns: ["office_id"];
            isOneToOne: false;
            referencedRelation: "office";
            referencedColumns: ["id"];
          },
        ];
      };
      emergency_contact: {
        Row: {
          id: string;
          office_id: string;
          label: string;
          number: string;
          note: string;
          icon: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          office_id: string;
          label: string;
          number: string;
          note: string;
          icon: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          office_id?: string;
          label?: string;
          number?: string;
          note?: string;
          icon?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "emergency_contact_office_id_fkey";
            columns: ["office_id"];
            isOneToOne: false;
            referencedRelation: "office";
            referencedColumns: ["id"];
          },
        ];
      };
      help_request: {
        Row: {
          id: string;
          stakeholder_id: string;
          location: string;
          status: "pending" | "resolved";
          notes: string | null;
          crisis_id: string;
          office_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          stakeholder_id: string;
          location: string;
          status?: "pending" | "resolved";
          notes?: string | null;
          crisis_id: string;
          office_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          stakeholder_id?: string;
          location?: string;
          status?: "pending" | "resolved";
          notes?: string | null;
          crisis_id?: string;
          office_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "help_request_crisis_id_fkey";
            columns: ["crisis_id"];
            isOneToOne: false;
            referencedRelation: "crisis";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "help_request_office_id_fkey";
            columns: ["office_id"];
            isOneToOne: false;
            referencedRelation: "office";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "help_request_stakeholder_id_fkey";
            columns: ["stakeholder_id"];
            isOneToOne: false;
            referencedRelation: "stakeholder";
            referencedColumns: ["id"];
          },
        ];
      };
      message: {
        Row: {
          id: string;
          help_request_id: string;
          sender_id: string;
          sender_role: "office" | "stakeholder";
          sender_name: string | null;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          help_request_id: string;
          sender_id: string;
          sender_role: "office" | "stakeholder";
          sender_name?: string | null;
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          help_request_id?: string;
          sender_id?: string;
          sender_role?: "office" | "stakeholder";
          sender_name?: string | null;
          content?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "message_help_request_id_fkey";
            columns: ["help_request_id"];
            isOneToOne: false;
            referencedRelation: "help_request";
            referencedColumns: ["id"];
          },
        ];
      };
      office: {
        Row: {
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
        };
        Insert: {
          id: string;
          name: string;
          email: string;
          role?: "office";
          office_name: string;
          age?: number | null;
          gender?: string | null;
          contact?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          role?: "office";
          office_name?: string;
          age?: number | null;
          gender?: string | null;
          contact?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      progress_report: {
        Row: {
          id: string;
          crisis_id: string;
          title: string;
          content: string;
          icon: string;
          office_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          crisis_id: string;
          title: string;
          content: string;
          icon: string;
          office_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          crisis_id?: string;
          title?: string;
          content?: string;
          icon?: string;
          office_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "progress_report_crisis_id_fkey";
            columns: ["crisis_id"];
            isOneToOne: false;
            referencedRelation: "crisis";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "progress_report_office_id_fkey";
            columns: ["office_id"];
            isOneToOne: false;
            referencedRelation: "office";
            referencedColumns: ["id"];
          },
        ];
      };
      stakeholder: {
        Row: {
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
        };
        Insert: {
          id: string;
          name: string;
          email: string;
          role?: "stakeholder";
          age?: number | null;
          community?: string | null;
          contact?: string | null;
          permanent_address?: string | null;
          current_address?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          role?: "stakeholder";
          age?: number | null;
          community?: string | null;
          contact?: string | null;
          permanent_address?: string | null;
          current_address?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      survey: {
        Row: {
          id: string;
          title: string;
          survey_type: "safety" | "donation" | "volunteer";
          questions: string;
          crisis_id: string;
          office_id: string;
          status: "active" | "closed";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          survey_type: "safety" | "donation" | "volunteer";
          questions: string;
          crisis_id: string;
          office_id: string;
          status?: "active" | "closed";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          survey_type?: "safety" | "donation" | "volunteer";
          questions?: string;
          crisis_id?: string;
          office_id?: string;
          status?: "active" | "closed";
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "survey_crisis_id_fkey";
            columns: ["crisis_id"];
            isOneToOne: false;
            referencedRelation: "crisis";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "survey_office_id_fkey";
            columns: ["office_id"];
            isOneToOne: false;
            referencedRelation: "office";
            referencedColumns: ["id"];
          },
        ];
      };
      survey_response: {
        Row: {
          id: string;
          survey_id: string;
          stakeholder_id: string;
          answers: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          survey_id: string;
          stakeholder_id: string;
          answers: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          survey_id?: string;
          stakeholder_id?: string;
          answers?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "survey_response_stakeholder_id_fkey";
            columns: ["stakeholder_id"];
            isOneToOne: false;
            referencedRelation: "stakeholder";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "survey_response_survey_id_fkey";
            columns: ["survey_id"];
            isOneToOne: false;
            referencedRelation: "survey";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
