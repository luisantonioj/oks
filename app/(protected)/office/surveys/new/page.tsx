import { getCurrentUserProfile } from '@/lib/queries/user';
import { getCrises } from '@/lib/queries/crisis';
import { createSurvey } from '@/app/actions/survey';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { SurveyBuilder } from '@/components/SurveyBuilder';
import { ArrowLeft, ClipboardList } from 'lucide-react';

export default async function NewSurveyPage() {
  const profile = await getCurrentUserProfile();
  if (!profile || profile.role !== 'office') redirect('/login-office');

  const crises = await getCrises();

  return (
    <div className="flex flex-col gap-6 p-6 max-w-2xl mx-auto">
      <Link href="/office/surveys" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit">
        <ArrowLeft className="h-4 w-4" /> Back to Surveys
      </Link>
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ClipboardList className="h-6 w-6 text-blue-500" />Create New Survey
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Build a survey to collect welfare data from stakeholders.</p>
      </div>
      <div className="rounded-lg border bg-card shadow-sm p-6">
        <SurveyBuilder crises={crises} onSubmit={createSurvey} />
      </div>
    </div>
  );
}