// app/admin/create-office/page.tsx
import { redirect } from "next/navigation";
import { routes } from "@/lib/routes";

export default async function CreateOfficePage() {
  redirect(routes.admin.createOffice);
}
