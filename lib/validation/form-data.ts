export function getOptionalString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

export function getRequiredString(formData: FormData, key: string) {
  const value = getOptionalString(formData, key);
  return value ?? "";
}

export function parseCommaSeparated(value?: string) {
  if (!value) return [];

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
