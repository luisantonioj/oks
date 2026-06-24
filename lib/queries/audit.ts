// lib/queries/audit.ts
import { createAdminClient } from "@/lib/supabase/admin";
import { AuditLog } from "@/types/database";

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
