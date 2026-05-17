"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Shield, ShieldOff, ChevronLeft, ChevronRight, Eye, Ban, Trash2, X } from "lucide-react";
import type { Profile } from "@/types";
import { adminUpdateUser, adminDeleteUser, getAdminUserDetail } from "@/lib/actions/admin";

interface UsersData {
  users: Profile[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export function AdminUsersClient({
  data,
  currentSearch,
  currentPlan,
}: {
  data: UsersData;
  currentSearch: string;
  currentPlan: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(currentSearch);
  const [isPending, startTransition] = useTransition();
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [userDetail, setUserDetail] = useState<Awaited<ReturnType<typeof getAdminUserDetail>> | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    startTransition(() => {
      router.push(`/admin/users?${params.toString()}`);
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams("search", search);
  };

  const handleViewDetail = async (user: Profile) => {
    setSelectedUser(user);
    const detail = await getAdminUserDetail(user.id);
    setUserDetail(detail);
  };

  const handleCloseDetail = () => {
    setSelectedUser(null);
    setUserDetail(null);
    setShowDeleteConfirm(false);
  };

  const handleUpdateUser = async (userId: string, updates: { plan?: string; role?: string; banned?: boolean }) => {
    await adminUpdateUser(userId, updates);
    handleCloseDetail();
    router.refresh();
  };

  const handleDeleteUser = async (userId: string) => {
    await adminDeleteUser(userId);
    handleCloseDetail();
    router.refresh();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Users</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {data.total} total users
      </p>

      {/* Filters */}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <form onSubmit={handleSearch} className="flex flex-1 gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-border bg-card px-3 py-2 pl-9 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition"
          >
            Search
          </button>
        </form>
        <select
          value={currentPlan}
          onChange={(e) => updateParams("plan", e.target.value)}
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="all">All Plans</option>
          <option value="free">Free</option>
          <option value="pro">Pro</option>
          <option value="enterprise">Enterprise</option>
        </select>
      </div>

      {/* Table */}
      <div className="mt-4 overflow-x-auto rounded-xl border border-border/50">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50 bg-muted/30">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">User</th>
              <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground sm:table-cell">Plan</th>
              <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground md:table-cell">Role</th>
              <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground lg:table-cell">Joined</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  No users found
                </td>
              </tr>
            ) : (
              data.users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-border/30 transition hover:bg-muted/20"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {(user.display_name || "U")[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium">{user.display_name || "Unnamed"}</div>
                        <div className="text-xs text-muted-foreground">{user.id.slice(0, 8)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      user.plan === "pro" ? "bg-primary/10 text-primary" :
                      user.plan === "enterprise" ? "bg-accent/10 text-accent" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {user.plan}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    <span className={`text-xs ${user.role === "admin" ? "text-primary font-medium" : "text-muted-foreground"}`}>
                      {user.role || "user"}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleViewDetail(user)}
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted/50 hover:text-foreground transition"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            onClick={() => updateParams("page", String(data.page - 1))}
            disabled={data.page <= 1}
            className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-muted/50 transition disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm text-muted-foreground">
            {data.page} / {data.totalPages}
          </span>
          <button
            onClick={() => updateParams("page", String(data.page + 1))}
            disabled={data.page >= data.totalPages}
            className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-muted/50 transition disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={handleCloseDetail}>
          <div
            className="w-full max-w-lg rounded-2xl border border-border bg-background p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">User Details</h2>
              <button onClick={handleCloseDetail} className="rounded-lg p-1 text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                {(selectedUser.display_name || "U")[0].toUpperCase()}
              </div>
              <div>
                <div className="font-semibold">{selectedUser.display_name || "Unnamed"}</div>
                <div className="text-xs text-muted-foreground font-mono">{selectedUser.id}</div>
              </div>
            </div>

            {/* Editable Fields */}
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-muted/30 px-4 py-2.5">
                <span className="text-sm text-muted-foreground">Plan</span>
                <select
                  defaultValue={selectedUser.plan}
                  onChange={(e) => handleUpdateUser(selectedUser.id, { plan: e.target.value })}
                  className="rounded-md border border-border bg-card px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="free">Free</option>
                  <option value="pro">Pro</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-muted/30 px-4 py-2.5">
                <span className="text-sm text-muted-foreground">Role</span>
                <select
                  defaultValue={selectedUser.role || "user"}
                  onChange={(e) => handleUpdateUser(selectedUser.id, { role: e.target.value })}
                  className="rounded-md border border-border bg-card px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-muted/30 px-4 py-2.5">
                <span className="text-sm text-muted-foreground">Banned</span>
                <button
                  onClick={() => handleUpdateUser(selectedUser.id, { banned: !(selectedUser as any).banned })}
                  className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                    (selectedUser as any).banned
                      ? "bg-destructive/10 text-destructive"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {(selectedUser as any).banned ? "Banned — Click to Unban" : "Active — Click to Ban"}
                </button>
              </div>
            </div>

            {/* Usage Info */}
            {userDetail && (
              <div className="mt-4 space-y-2">
                <h3 className="text-sm font-semibold">Activity</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-muted/30 px-3 py-2">
                    <div className="text-xs text-muted-foreground">Conversations</div>
                    <div className="text-sm font-bold">{userDetail.conversations.length}</div>
                  </div>
                  <div className="rounded-lg bg-muted/30 px-3 py-2">
                    <div className="text-xs text-muted-foreground">Tokens (30d)</div>
                    <div className="text-sm font-bold">{userDetail.totalTokens.toLocaleString()}</div>
                  </div>
                </div>

                {userDetail.conversations.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <div className="text-xs text-muted-foreground">Recent conversations</div>
                    {userDetail.conversations.slice(0, 5).map((c) => (
                      <div key={c.id} className="flex items-center justify-between rounded-md bg-muted/20 px-3 py-1.5 text-xs">
                        <span className="truncate max-w-[200px]">{c.title}</span>
                        <span className="text-muted-foreground">{c.model}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Danger Zone */}
            <div className="mt-4 border-t border-border pt-4">
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-2 text-xs text-destructive hover:underline"
                >
                  <Trash2 className="h-3 w-3" />
                  Delete user and all data
                </button>
              ) : (
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                  <p className="text-xs text-destructive font-medium">⚠️ This will permanently delete this user and all their data.</p>
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => handleDeleteUser(selectedUser.id)}
                      className="rounded-md bg-destructive px-3 py-1 text-xs font-medium text-white hover:bg-destructive/90"
                    >
                      Confirm Delete
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="rounded-md border border-border px-3 py-1 text-xs text-muted-foreground"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
