import { getCurrentUserProfile } from "@/lib/queries/user";
import { redirect } from "next/navigation";
import { OfficeProfileClient } from "./OfficeProfileClient"; 

export default async function OfficeProfile() {
  const profile = await getCurrentUserProfile();

  if (!profile || profile.role !== "office") {
    redirect("/login-office");
  }

  const p = profile as any;

  // Dummy data fallbacks
  const displayData = {
    name: p.name || "CIO Officer 1",
    email: p.email || "cio.officer1@dlsl.edu.ph",
    age: p.age ? String(p.age) : "35",
    gender: p.gender || "Male",
    contact: p.contact || "+63 917 123 4567",
    office_name: p.office_name || "CIO",
    role: "office",
    created_at: p.created_at || "2026-03-02T00:00:00Z",
    updated_at: p.updated_at || "2026-03-02T00:00:00Z",
  };

  return (
    <OfficeProfileClient
      initialData={displayData}
      userId={p.id}
    />
  );
}