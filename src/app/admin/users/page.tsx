"use client";

import { useEffect, useState } from "react";
import { Shield, Trash2, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserItem {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "editor";
  bio: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    const res = await fetch("/api/users");
    const data = await res.json();
    if (data.success) {
      setUsers(data.data || []);
    }
    setLoading(false);
  }

  async function updateRole(id: string, role: string) {
    await fetch(`/api/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    fetchUsers();
  }

  async function deleteUser(id: string, name: string) {
    if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    await fetch(`/api/users/${id}`, { method: "DELETE" });
    fetchUsers();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)]">
          Users
        </h1>
        <Badge variant="outline" className="text-xs">
          {users.length} total
        </Badge>
      </div>

      <div className="card-elevated rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="p-4 font-medium">User</th>
              <th className="p-4 font-medium hidden sm:table-cell">Email</th>
              <th className="p-4 font-medium">Role</th>
              <th className="p-4 font-medium hidden md:table-cell">Joined</th>
              <th className="p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted-foreground">
                  Loading...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted-foreground">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user._id}
                  className="border-b border-border last:border-0 hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-[#155eef] flex items-center justify-center shrink-0">
                        <span className="text-white text-sm font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground sm:hidden">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground hidden sm:table-cell">
                    {user.email}
                  </td>
                  <td className="p-4">
                    <Select
                      value={user.role}
                      onValueChange={(v) => v && updateRole(user._id, v)}
                    >
                      <SelectTrigger className="w-28 h-8 text-xs border-gray-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">
                          <div className="flex items-center gap-1.5">
                            <Shield className="h-3 w-3 text-[#155eef]" />
                            Admin
                          </div>
                        </SelectItem>
                        <SelectItem value="editor">
                          <div className="flex items-center gap-1.5">
                            <User className="h-3 w-3 text-[#667085]" />
                            Editor
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-4 text-muted-foreground text-xs hidden md:table-cell">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-600"
                      onClick={() => deleteUser(user._id, user.name)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 card-elevated rounded-xl p-5">
        <h3 className="text-sm font-semibold mb-2">Role Permissions</h3>
        <div className="grid gap-3 sm:grid-cols-2 text-xs text-muted-foreground">
          <div className="space-y-1">
            <p className="font-medium text-foreground flex items-center gap-1.5">
              <Shield className="h-3 w-3 text-[#155eef]" />
              Admin
            </p>
            <p>Full access: posts, categories, messages, users, settings</p>
          </div>
          <div className="space-y-1">
            <p className="font-medium text-foreground flex items-center gap-1.5">
              <User className="h-3 w-3 text-[#667085]" />
              Editor
            </p>
            <p>Manage posts, categories, messages. Cannot manage users.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
