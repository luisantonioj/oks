// app/(protected)/office/surveys/page.tsx
import { getCurrentUserProfile } from '@/lib/queries/user';
import { getSurveys, getSurveyResponseCountMap } from '@/lib/queries/survey';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { OfficeSurveysClient } from './OfficeSurveysClient';

export default async function OfficeSurveysPage() {
  const profile = await getCurrentUserProfile();
  if (!profile || profile.role !== 'office') redirect('/login-office');

  // 1. Fetch ALL surveys, without filtering by office_id
  const surveys = await getSurveys(); 
  const surveyIds = surveys.map((s) => s.id);
  const responseCounts = await getSurveyResponseCountMap(surveyIds);

  // 2. Fetch all offices to map the survey's office_id to an actual office name
  const supabase = await createClient();
  const { data: offices } = await supabase.from('office').select('id, name');
  const officeMap: Record<string, string> = {};
  
  if (offices) {
    offices.forEach((o) => {
      if (o.id && o.name) officeMap[o.id] = o.name;
    });
  }
  
  return (
    <OfficeSurveysClient 
      surveys={surveys} 
      responseCounts={responseCounts} 
      officeMap={officeMap}
      currentOfficeId={profile.id}
    />
  );
}