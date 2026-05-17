import { getAdminUsers } from "@/lib/actions/admin";
import { AdminUsersClient } from "@/components/admin/admin-users-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; plan?: string; page?: string }>;
}) {
  const params = await searchParams;
  const data = await getAdminUsers({
    search: params.search,
    plan: params.plan,
    page: params.page ? parseInt(params.page) : 1,
  });

  return <AdminUsersClient data={data} currentSearch={params.search ?? ""} currentPlan={params.plan ?? "all"} />;
}
