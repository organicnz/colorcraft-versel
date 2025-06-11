import { Metadata } from "next";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageSquare, Search, Filter, Eye, Archive, Trash2, Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "All Conversations - ColorCraft Chat Dashboard",
  description: "View and manage all customer chat conversations",
};

// Force dynamic rendering
export const dynamic = "force-dynamic";

async function AllConversationsTable() {
  const supabase = await createClient();

  try {
    const { data: conversations, error } = await supabase
      .from("chat_conversations")
      .select(
        `
        *,
        chat_messages (
          id,
          content,
          created_at,
          sender_name,
          is_read
        )
      `
      )
      .order("last_message_at", { ascending: false });

    if (error) {
      throw error;
    }

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Conversations</CardTitle>
              <CardDescription>
                Manage all customer chat conversations ({conversations?.length || 0} total)
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center space-x-2 mt-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search conversations..." className="pl-8" />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {conversations && conversations.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Customer</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Subject</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Priority</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Messages</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Last Activity</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {conversations.map((conversation: any) => {
                    const messages = conversation.chat_messages || [];
                    const unreadCount = messages.filter((m: any) => !m.is_read).length;
                    const lastMessage = messages.sort(
                      (a: any, b: any) =>
                        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                    )[0];

                    return (
                      <tr
                        key={conversation.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900">
                              {conversation.customer_name || "Unknown Customer"}
                            </span>
                            <span className="text-sm text-gray-500">
                              {conversation.customer_email || "No email"}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900 max-w-48 truncate">
                              {conversation.title || "Untitled Conversation"}
                            </span>
                            {lastMessage && (
                              <span className="text-sm text-gray-500 max-w-48 truncate">
                                {lastMessage.content}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge
                            variant={
                              conversation.status === "active"
                                ? "default"
                                : conversation.status === "closed"
                                  ? "secondary"
                                  : "outline"
                            }
                            className="capitalize"
                          >
                            {conversation.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <Badge
                            variant={
                              conversation.priority === "urgent"
                                ? "destructive"
                                : conversation.priority === "high"
                                  ? "destructive"
                                  : conversation.priority === "normal"
                                    ? "default"
                                    : "secondary"
                            }
                            className="capitalize"
                          >
                            {conversation.priority}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">{messages.length}</span>
                            {unreadCount > 0 && (
                              <Badge variant="destructive" className="text-xs">
                                {unreadCount} new
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-gray-500">
                            {new Date(
                              conversation.last_message_at || conversation.created_at
                            ).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-1">
                            <Button size="sm" variant="outline" asChild>
                              <Link href={`/dashboard/chat/${conversation.id}`}>
                                <Eye className="h-3 w-3" />
                              </Link>
                            </Button>
                            <Button size="sm" variant="outline">
                              <Archive className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations yet</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Customer conversations will appear here when they start chatting
              </p>
              <Button asChild>
                <Link href="/dashboard/chat">
                  <Plus className="mr-2 h-4 w-4" />
                  Go to Chat Dashboard
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  } catch (error) {
    console.error("Error fetching all conversations:", error);
    return (
      <Card>
        <CardHeader>
          <CardTitle>All Conversations</CardTitle>
          <CardDescription>Unable to load conversations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Conversations</h3>
            <p className="text-sm text-red-500 mb-6">
              {error instanceof Error ? error.message : "Unknown error occurred"}
            </p>
            <Button variant="outline" asChild>
              <Link href="/dashboard/chat">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
}

export default async function AllConversationsPage() {
  const supabase = await createClient();

  // Check if user is authenticated and is admin
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth/signin");
  }

  // Check if user is admin
  const { data: user } = await supabase
    .from("users")
    .select("role")
    .eq("id", session.user.id)
    .single();

  if (!user || user.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="All Conversations"
        text="View and manage all customer chat conversations"
      >
        <Button variant="outline" asChild>
          <Link href="/dashboard/chat">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </DashboardHeader>

      <div className="space-y-6">
        <Suspense
          fallback={
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="animate-pulse bg-gray-200 h-64 w-full rounded" />
              </CardContent>
            </Card>
          }
        >
          <AllConversationsTable />
        </Suspense>
      </div>
    </DashboardShell>
  );
}
