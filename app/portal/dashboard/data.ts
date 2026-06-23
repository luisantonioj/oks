import { getRecentAuditLogs } from "@/lib/queries/audit";
import { getAllOfficesForAdmin, getAllStakeholdersForAdmin } from "@/lib/queries/admin-users";
import { getCrisisBreakdown, getDashboardStats } from "@/lib/queries/crisis";
import { getHelpRequestBreakdown } from "@/lib/queries/help-request";
import { getCurrentUserProfile } from "@/lib/queries/user";

export async function getAdminDashboardData() {
  const profile = await getCurrentUserProfile();
  if (!profile || profile.role !== "admin") {
    return null;
  }

  const [offices, stakeholders, stats, crisisBreakdown, helpBreakdown, recentLogs] = await Promise.all([
    getAllOfficesForAdmin(),
    getAllStakeholdersForAdmin(),
    getDashboardStats(),
    getCrisisBreakdown(),
    getHelpRequestBreakdown(),
    getRecentAuditLogs(10),
  ]);

  const adminName = process.env.ADMIN_NAME || "Administrator";
  const adminEmail = process.env.ADMIN_EMAIL || "admin@dlsl.edu.ph";
  const firstName = adminName.split(" ")[0];

  return {
    offices,
    stakeholders,
    stats,
    crisisBreakdown,
    helpBreakdown,
    recentLogs,
    adminName,
    adminEmail,
    firstName,
  };
}
