import { revalidatePath } from 'next/cache';
import { routes } from '@/lib/routes';

export function revalidateCrisisViews(crisisId?: string) {
  revalidatePath(routes.office.crises);
  revalidatePath(routes.office.dashboard);
  revalidatePath(routes.admin.dashboard);
  revalidatePath(routes.stakeholder.dashboard);
  revalidatePath(routes.stakeholder.newHelpRequest);

  if (crisisId) {
    revalidatePath(routes.office.crisis(crisisId));
  }
}

export function revalidateAnnouncementViews(crisisId?: string) {
  revalidatePath(routes.office.announcements);
  revalidatePath(routes.office.dashboard);
  revalidatePath(routes.admin.dashboard);
  revalidatePath(routes.stakeholder.dashboard);
  revalidatePath(routes.office.crises);

  if (crisisId) {
    revalidatePath(routes.office.crisis(crisisId));
  }
}

export function revalidateHelpRequestViews() {
  revalidatePath(routes.stakeholder.helpRequests);
  revalidatePath(routes.stakeholder.inbox);
  revalidatePath(routes.office.inbox);
  revalidatePath(routes.office.dashboard);
  revalidatePath(routes.office.helpRequests);
}

export function revalidateInboxViews(requestId?: string) {
  revalidatePath(routes.office.inbox);
  revalidatePath(routes.stakeholder.inbox);

  if (requestId) {
    revalidatePath(routes.office.inboxThread(requestId));
    revalidatePath(routes.stakeholder.inboxThread(requestId));
  }
}

export function revalidateSurveyViews(surveyId?: string) {
  revalidatePath(routes.office.surveys);
  revalidatePath(routes.stakeholder.surveys);

  if (surveyId) {
    revalidatePath(routes.office.survey(surveyId));
    revalidatePath(routes.stakeholder.survey(surveyId));
  }
}
