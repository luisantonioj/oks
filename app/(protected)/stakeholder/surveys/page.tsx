// app/(protected)/stakeholder/surveys/page.tsx
import { getCurrentUserProfile } from '@/lib/queries/user';
import { getSurveys, getStakeholderRespondedSurveyIds } from '@/lib/queries/survey';
import { getCrises } from '@/lib/queries/crisis';
import { redirect } from 'next/navigation';
import { StakeholderSurveysClient, MappedSurvey, SurveyType } from './StakeholderSurveysClient';

export default async function StakeholderSurveysPage() {
  const profile = await getCurrentUserProfile();
  if (!profile || profile.role !== 'stakeholder') redirect('/login');

  // Fetch all DB records concurrently for speed
  const [surveys, respondedIds, crises] = await Promise.all([
    getSurveys(),
    getStakeholderRespondedSurveyIds(profile.id),
    getCrises()
  ]);

  // Map the DB schema to match your UI's expected format
  const mappedSurveys: MappedSurvey[] = surveys.map((s) => {
    // Derive the type dynamically based on title keywords
    const titleLower = s.title.toLowerCase();
    let type: SurveyType = "safety"; // default
    if (titleLower.includes("volunteer")) type = "volunteer";
    else if (titleLower.includes("donat") || titleLower.includes("goods") || titleLower.includes("relief")) type = "donation";

    // Grab the actual crisis name
    const crisis = crises.find(c => c.id === s.crisis_id);
    const crisisName = crisis 
      ? `${crisis.type} — ${crisis.affected_areas?.[0] || 'Local Area'}` 
      : 'General Crisis';

    return {
      id: s.id,
      title: s.title,
      type,
      crisis: crisisName,
      status: (s.status as "active" | "closed") || "active",
      created_at: s.created_at,
      hasResponded: respondedIds.includes(s.id)
    };
  });

  return <StakeholderSurveysClient initialSurveys={mappedSurveys} />;
}