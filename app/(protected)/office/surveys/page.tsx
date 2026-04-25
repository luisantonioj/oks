//app/(protected)/office/surveys/page.tsx
import { getCurrentUserProfile } from '@/lib/queries/user';
import { getSurveys, getSurveyResponseCountMap } from '@/lib/queries/survey';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { SurveyCard } from '@/components/SurveyCard';
import { Button } from '@/components/ui/button';
import { ClipboardList, Plus } from 'lucide-react';

export default async function OfficeSurveysPage() {
  const profile = await getCurrentUserProfile();
  if (!profile || profile.role !== 'office') redirect('/login-office');

  const surveys = await getSurveys({ office_id: profile.id });
  const surveyIds = surveys.map((s) => s.id);
  const responseCounts = await getSurveyResponseCountMap(surveyIds);

  const activeSurveys = surveys.filter((s) => s.status === 'active');
  const closedSurveys = surveys.filter((s) => s.status !== 'active');

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-blue-500" />Surveys
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{surveys.length} survey{surveys.length !== 1 ? 's' : ''} created</p>
        </div>
        <Link href="/office/surveys/new">
          <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" />New Survey</Button>
        </Link>
      </div>

      {activeSurveys.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-blue-600 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />Active ({activeSurveys.length})
          </h2>
          {activeSurveys.map((survey) => (
            <SurveyCard key={survey.id} survey={survey} viewMode="office" responseCount={responseCounts[survey.id] ?? 0} />
          ))}
        </section>
      )}

      {closedSurveys.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Closed ({closedSurveys.length})</h2>
          {closedSurveys.map((survey) => (
            <SurveyCard key={survey.id} survey={survey} viewMode="office" responseCount={responseCounts[survey.id] ?? 0} />
          ))}
        </section>
      )}

      {surveys.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-16 text-center border-2 border-dashed rounded-lg">
          <ClipboardList className="h-10 w-10 text-muted-foreground/40" />
          <p className="font-medium text-muted-foreground">No surveys yet</p>
          <Link href="/office/surveys/new">
            <Button variant="outline" size="sm" className="gap-1.5"><Plus className="h-4 w-4" />Create your first survey</Button>
          </Link>
        </div>
      )}
    </div>
  );
}