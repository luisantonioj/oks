// lib/queries/audit.ts
import { createAdminClient } from "@/lib/supabase/admin";
import { AuditLog } from "@/types/database";

interface LogActionParams {
  actor_id: string;
  actor_role: string;
  actor_name?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  metadata?: Record<string, unknown>;
}

export async function logAction(params: LogActionParams): Promise<void> {
  try {
    const supabase = createAdminClient();
    await supabase.from("audit_log").insert({
      actor_id: params.actor_id,
      actor_role: params.actor_role,
      actor_name: params.actor_name ?? null,
      action: params.action,
      entity_type: params.entity_type,
      entity_id: params.entity_id ?? null,
      metadata: params.metadata ?? null,
    });
  } catch (e) {
    console.error("[audit] Failed to log action:", e);
  }
}

export async function getRecentAuditLogs(limit = 20): Promise<AuditLog[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("audit_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) return [];
    return (data as AuditLog[]) || [];
  } catch {
    return [];
  }
}
