"use client";

import { useEffect, useState } from "react";
import { Mail, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Subscriber {
  _id: string;
  email: string;
  active: boolean;
  createdAt: string;
}

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  async function fetchSubscribers() {
    setLoading(true);
    const res = await fetch("/api/newsletter");
    const data = await res.json();
    setSubscribers(data.data || []);
    setLoading(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)]">
          Subscribers
        </h1>
        <Badge variant="outline" className="text-xs">
          {subscribers.length} active
        </Badge>
      </div>

      <div className="card-elevated rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="p-4 font-medium">Email</th>
              <th className="p-4 font-medium hidden sm:table-cell">Status</th>
              <th className="p-4 font-medium hidden md:table-cell">Subscribed</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="p-8 text-center text-muted-foreground">
                  Loading...
                </td>
              </tr>
            ) : subscribers.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-8 text-center text-muted-foreground">
                  No subscribers yet.
                </td>
              </tr>
            ) : (
              subscribers.map((sub) => (
                <tr
                  key={sub._id}
                  className="border-b border-border last:border-0 hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-[#155eef]/10 flex items-center justify-center shrink-0">
                        <Mail className="h-3.5 w-3.5 text-[#155eef]" />
                      </div>
                      <span className="font-medium">{sub.email}</span>
                    </div>
                  </td>
                  <td className="p-4 hidden sm:table-cell">
                    <Badge
                      variant="outline"
                      className="text-xs"
                      style={{
                        borderColor: sub.active ? "#22c55e" : "#98a2b3",
                        color: sub.active ? "#22c55e" : "#98a2b3",
                      }}
                    >
                      {sub.active ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="p-4 text-muted-foreground text-xs hidden md:table-cell">
                    {new Date(sub.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
