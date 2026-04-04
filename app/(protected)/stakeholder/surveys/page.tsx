import { getCurrentUserProfile } from '@/lib/queries/user';
import { getSurveys, getStakeholderRespondedSurveyIds } from '@/lib/queries/survey';
import { redirect } from 'next/navigation';
import { SurveyCard } from '@/components/SurveyCard';
import { ClipboardList } from 'lucide-react';

export default async function StakeholderSurveysPage() {
  const profile = await getCurrentUserProfile();
  if (!profile || profile.role !== 'stakeholder') redirect('/login');

  const [surveys, respondedIds] = await Promise.all([
    getSurveys(),
    getStakeholderRespondedSurveyIds(profile.id),
  ]);

  const activeSurveys = surveys.filter((s) => s.status === 'active');
  const closedSurveys = surveys.filter((s) => s.status !== 'active');
  const pendingCount = activeSurveys.filter((s) => !respondedIds.includes(s.id)).length;

  return (
    <div className="flex flex-col gap-6 p-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ClipboardList className="h-6 w-6 text-blue-500" />
          Surveys
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {pendingCount > 0 ? `${pendingCount} survey${pendingCount !== 1 ? 's' : ''} awaiting your response` : 'All surveys up to date'}
        </p>
      </div>

      {activeSurveys.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-blue-600 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />Active Surveys
          </h2>
          {activeSurveys.map((survey) => (
            <SurveyCard key={survey.id} survey={survey} viewMode="stakeholder" hasResponded={respondedIds.includes(survey.id)} />
          ))}
        </section>
      )}

      {closedSurveys.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Closed Surveys</h2>
          {closedSurveys.map((survey) => (
            <SurveyCard key={survey.id} survey={survey} viewMode="stakeholder" hasResponded={respondedIds.includes(survey.id)} />
          ))}
        </section>
      )}

      {surveys.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-16 text-center border rounded-lg bg-card">
          <ClipboardList className="h-10 w-10 text-muted-foreground/40" />
          <p className="font-medium text-muted-foreground">No surveys yet</p>
          <p className="text-sm text-muted-foreground/60">Surveys from your office will appear here when available.</p>
        </div>
      )}
    </div>
  );
}