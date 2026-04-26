// app/(protected)/office/reports/page.tsx
import { getCurrentUserProfile } from '@/lib/queries/user';
import { getCrises } from '@/lib/queries/crisis';
import { getProgressReports } from '@/lib/queries/report';
import { redirect } from 'next/navigation';
import { OfficeReportsClient } from './OfficeReportsClient';

export default async function OfficeReportsPage() {
  const profile = await getCurrentUserProfile();
  if (!profile || profile.role !== 'office') redirect('/login-office');

  // Fetch crises and reports in parallel for speed
  const [dbCrises, dbReports] = await Promise.all([
    getCrises(),
    getProgressReports()
  ]);

  // Format the crises for the sidebar
  const crises = dbCrises.map((c) => ({
    id: c.id,
    name: c.name,
    status: c.status,
  }));

  // Format the reports to match your Report UI type
  const reports = dbReports.map((r: any) => ({
    id: r.id,
    crisis: r.crisis?.name || 'Unknown',
    crisis_id: r.crisis_id,
    title: r.title || 'Update',
    content: r.content,
    icon: r.icon || '📦',
    posted_by: r.office?.name || 'Unknown Office',
    posted_at: new Date(r.created_at).toLocaleString('en-PH', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    }),
    timestamp: new Date(r.created_at).getTime(),
  }));

  return (
    <OfficeReportsClient 
      initialReports={reports} 
      crises={crises} 
      officeName={profile.name || "Office"} 
    />
  );
}