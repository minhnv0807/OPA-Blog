"use client";

import { useEffect, useState } from "react";
import { Mail, MailOpen, Reply, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Message {
  _id: string;
  name: string;
  email: string;
  message: string;
  status: "new" | "read" | "replied";
  createdAt: string;
}

const statusConfig = {
  new: { label: "New", color: "#f59e0b", icon: Mail },
  read: { label: "Read", color: "#155eef", icon: MailOpen },
  replied: { label: "Replied", color: "#22c55e", icon: Reply },
};

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("");

  useEffect(() => {
    fetchMessages();
  }, [filter]);

  async function fetchMessages() {
    setLoading(true);
    const params = new URLSearchParams();
    if (filter) params.set("status", filter);
    const res = await fetch(`/api/contact?${params}`);
    const data = await res.json();
    setMessages(data.data || []);
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/contact/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchMessages();
  }

  async function deleteMessage(id: string) {
    if (!confirm("Delete this message?")) return;
    await fetch(`/api/contact/${id}`, { method: "DELETE" });
    fetchMessages();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)]">
          Messages
        </h1>
        <div className="flex gap-2">
          {["", "new", "read", "replied"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === s
                  ? "bg-[#155eef] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {s || "All"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : messages.length === 0 ? (
        <div className="text-center py-12 card-elevated rounded-xl text-muted-foreground">
          No messages found.
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => {
            const cfg = statusConfig[msg.status];
            return (
              <div
                key={msg._id}
                className="card-elevated rounded-xl p-5 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-medium text-sm">{msg.name}</span>
                      <span className="text-xs text-muted-foreground">{msg.email}</span>
                      <Badge
                        variant="outline"
                        className="text-xs"
                        style={{ borderColor: cfg.color, color: cfg.color }}
                      >
                        {cfg.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {msg.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(msg.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {msg.status === "new" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        title="Mark as read"
                        onClick={() => updateStatus(msg._id, "read")}
                      >
                        <MailOpen className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    {msg.status !== "replied" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        title="Mark as replied"
                        onClick={() => updateStatus(msg._id, "replied")}
                      >
                        <Reply className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-600"
                      title="Delete"
                      onClick={() => deleteMessage(msg._id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
