const DLSL_EMAIL_DOMAIN = "dlsl.edu.ph";

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function isDlslEmail(email: string) {
  const normalized = normalizeEmail(email);
  const [localPart, domain, ...extraParts] = normalized.split("@");

  return Boolean(localPart && domain === DLSL_EMAIL_DOMAIN && extraParts.length === 0);
}

export function isDlslEmailAllowedForSignup(email: string) {
  if (process.env.NODE_ENV === "development") {
    return true;
  }

  return isDlslEmail(email);
}
