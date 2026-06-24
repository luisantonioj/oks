// app/actions/report.ts
'use server';

import { revalidatePath } from 'next/cache';
import { requireAnyRole } from '@/lib/auth/guards';
import {
  createProgressReportForProfile,
  ProgressReportInput,
  updateProgressReportForProfile,
} from '@/lib/services/report-service';
import { routes } from '@/lib/routes';

type ReportActionResult =
  | { error: string; success?: never }
  | { error?: never; success: true };

export async function createProgressReport(data: ProgressReportInput): Promise<ReportActionResult> {
  const auth = await requireAnyRole(['office', 'admin']);
  if (!auth.ok) {
    return { error: auth.error };
  }

  const result = await createProgressReportForProfile(auth.profile, data);
  if (result.error) return { error: result.error };

  revalidatePath(routes.office.reports);
  return { success: true };
}

export async function updateProgressReport(
  reportId: string,
  data: ProgressReportInput,
): Promise<ReportActionResult> {
  const auth = await requireAnyRole(['office', 'admin']);
  if (!auth.ok) {
    return { error: auth.error };
  }

  const result = await updateProgressReportForProfile(auth.profile, reportId, data);
  if (result.error) return { error: result.error };

  revalidatePath(routes.office.reports);
  return { success: true };
}
