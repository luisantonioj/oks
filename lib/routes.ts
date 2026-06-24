export type AppRole = 'admin' | 'office' | 'stakeholder';

export const routes = {
  home: '/',
  auth: {
    callback: '/callback',
    confirm: '/confirm',
    error: '/error',
    forgotPassword: '/forgot-password',
    updatePassword: '/update-password',
    signUp: '/sign-up',
    signUpSuccess: '/sign-up-success',
    login: {
      admin: '/login-portal',
      office: '/login-office',
      stakeholder: '/login',
    },
  },
  admin: {
    root: '/portal',
    dashboard: '/portal/dashboard',
    offices: '/portal/offices',
    createOffice: '/portal/offices/create',
    stakeholders: '/portal/stakeholders',
    settings: '/portal/settings',
  },
  office: {
    root: '/office',
    dashboard: '/office/dashboard',
    crises: '/office/crises',
    crisis: (id: string) => `/office/crises/${id}`,
    announcements: '/office/announcements',
    helpRequests: '/office/help-requests',
    inbox: '/office/inbox',
    inboxThread: (requestId: string) => `/office/inbox/${requestId}`,
    profile: '/office/profile',
    reports: '/office/reports',
    surveys: '/office/surveys',
    survey: (id: string) => `/office/surveys/${id}`,
    newSurvey: '/office/surveys/new',
    newSurveyForCrisis: (crisisId: string) => `/office/surveys/new?crisis_id=${crisisId}`,
  },
  stakeholder: {
    root: '/stakeholder',
    dashboard: '/stakeholder/dashboard',
    announcements: '/stakeholder/announcements',
    helpRequests: '/stakeholder/help-requests',
    newHelpRequest: '/stakeholder/help-requests/new',
    newHelpRequestForCrisis: (crisisId: string) => `/stakeholder/help-requests/new?crisis_id=${crisisId}`,
    inbox: '/stakeholder/inbox',
    inboxThread: (requestId: string) => `/stakeholder/inbox/${requestId}`,
    profile: '/stakeholder/profile',
    surveys: '/stakeholder/surveys',
    survey: (id: string) => `/stakeholder/surveys/${id}`,
  },
} as const;

export const dashboardRoutes = {
  admin: routes.admin.dashboard,
  office: routes.office.dashboard,
  stakeholder: routes.stakeholder.dashboard,
} as const satisfies Record<AppRole, string>;

export const loginRoutes = {
  admin: routes.auth.login.admin,
  office: routes.auth.login.office,
  stakeholder: routes.auth.login.stakeholder,
} as const satisfies Record<AppRole, string>;

export function dashboardRouteForRole(role: AppRole) {
  return dashboardRoutes[role];
}

export function loginRouteForRole(role: AppRole) {
  return loginRoutes[role];
}
