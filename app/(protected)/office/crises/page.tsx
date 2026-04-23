// app/(protected)/office/crises/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getCrises } from "@/lib/queries/crisis";
import CrisisDashboardClient from "./CrisisDashboardClient"; // Ensure default import
import { Crisis } from "@/components/crisis/crisis.types"; 

export default async function OfficeCrisesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login-portal");
  }

  // Fetch REAL data from Supabase
  const rawCrises = await getCrises();
  const crises = rawCrises as unknown as Crisis[]; 
  
  return <CrisisDashboardClient crises={crises} />;
}