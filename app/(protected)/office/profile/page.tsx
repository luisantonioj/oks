//app/(protected)/office/profile/page.tsx
import { getCurrentUserProfile } from "@/lib/queries/user";
import { createClient } from "@/lib/supabase/server"; // Import the client
import { redirect } from "next/navigation";
import { OfficeProfileClient } from "./OfficeProfileClient"; 
import { EmergencyContactsEditor } from "@/components/emergency-contacts-editor"; 

export default async function OfficeProfile() {
  const profile = await getCurrentUserProfile();

  if (!profile || profile.role !== "office") {
    redirect("/login-office");
  }

  // FETCH FROM THE NEW TABLE:
  const supabase = await createClient();
  const { data: dbContacts } = await supabase
    .from('emergency_contact')
    .select('*')
    .eq('office_id', profile.id)
    .order('created_at', { ascending: true }); // Keep them in the order they were added

  // Dummy data fallbacks
  const displayData = {
    name: profile.name || "CIO Officer 1",
    email: profile.email || "cio.officer1@dlsl.edu.ph",
    age: profile.age ? String(profile.age) : "35",
    gender: profile.gender || "Male",
    contact: profile.contact || "+63 917 123 4567",
    office_name: profile.office_name || "CIO",
    role: "office",
    created_at: profile.created_at || "2026-03-02T00:00:00Z",
    updated_at: profile.updated_at || "2026-03-02T00:00:00Z",
  };

  return (
    <div className="space-y-6"> 
      <OfficeProfileClient
        initialData={displayData}
        userId={profile.id}
      />
      
      <div className="mt-8">
        <EmergencyContactsEditor 
          officeId={profile.id} 
          // Pass the data fetched from the new table
          initialContacts={dbContacts ?? []} 
        />
      </div>
    </div>
  );
}
