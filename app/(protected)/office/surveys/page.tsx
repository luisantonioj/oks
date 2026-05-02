// app/(protected)/office/surveys/page.tsx
import { getCurrentUserProfile } from '@/lib/queries/user';
import { getSurveys, getSurveyResponseCountMap } from '@/lib/queries/survey';
import { redirect } from 'next/navigation';
import { OfficeSurveysClient } from './OfficeSurveysClient';

export default async function OfficeSurveysPage() {
  const profile = await getCurrentUserProfile();
  if (!profile || profile.role !== 'office') redirect('/login-office');

  const surveys = await getSurveys({ office_id: profile.id });
  const surveyIds = surveys.map((s) => s.id);
  const responseCounts = await getSurveyResponseCountMap(surveyIds);

  return <OfficeSurveysClient surveys={surveys} responseCounts={responseCounts} />;
}