import { Metadata } from 'next'
import ChatManagement from '@/components/dashboard/ChatManagement'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { DashboardShell } from '@/components/dashboard/DashboardShell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageSquare, Users, Clock, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Chat Management - ColorCraft Dashboard',
  description: 'Manage customer chat conversations and support requests',
}

// Force dynamic rendering to prevent SSG issues with Supabase
export const dynamic = 'force-dynamic'

async function ChatStats() {
  const supabase = await createClient()
  
  try {
    // Get conversation statistics
    const { data: totalConversations } = await supabase
      .from('chat_conversations')
      .select('id', { count: 'exact', head: true })
    
    const { data: activeConversations } = await supabase
      .from('chat_conversations')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'active')
    
    const { data: recentMessages } = await supabase
      .from('chat_messages')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

    return (
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalConversations?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Chats</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeConversations?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages Today</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentMessages?.length || 0}</div>
          </CardContent>
        </Card>
      </div>
    )
  } catch (error) {
    console.error('Error fetching chat stats:', error)
    return (
      <div className="mb-8">
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Unable to load chat statistics</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
}

async function RecentConversations() {
  const supabase = await createClient()
  
  try {
    const { data: conversations } = await supabase
      .from('chat_conversations')
      .select(`
        *,
        chat_messages (
          id,
          content,
          created_at,
          sender_type
        )
      `)
      .order('last_message_at', { ascending: false })
      .limit(5)

    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Conversations</CardTitle>
          <CardDescription>Latest customer chat conversations</CardDescription>
        </CardHeader>
        <CardContent>
          {conversations && conversations.length > 0 ? (
            <div className="space-y-4">
              {conversations.map((conversation: any) => {
                const lastMessage = conversation.chat_messages?.[0]
                const statusColor = conversation.status === 'active' ? 'bg-green-500' : 
                                  conversation.status === 'waiting' ? 'bg-yellow-500' : 'bg-gray-500'
                
                return (
                  <div key={conversation.id} className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`w-3 h-3 rounded-full ${statusColor} mt-2`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {conversation.customer_name}
                        </h4>
                        <Badge variant={conversation.status === 'active' ? 'default' : 'secondary'}>
                          {conversation.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {conversation.customer_email}
                      </p>
                      <p className="text-sm text-gray-900 font-medium mt-1">
                        {conversation.subject}
                      </p>
                      {lastMessage && (
                        <p className="text-xs text-gray-500 mt-1 truncate">
                          Last: {lastMessage.content}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(conversation.last_message_at).toLocaleString()}
                      </p>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/dashboard/chat/${conversation.id}`}>
                        View
                      </Link>
                    </Button>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">No conversations yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Customer conversations will appear here
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    )
  } catch (error) {
    console.error('Error fetching conversations:', error)
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Conversations</CardTitle>
          <CardDescription>Latest customer chat conversations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Unable to load conversations</p>
          </div>
        </CardContent>
      </Card>
    )
  }
}

export default async function ChatDashboardPage() {
  const supabase = await createClient()
  
  // Check if user is authenticated and is admin
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    redirect('/auth/signin')
  }

  // Check if user is admin
  const { data: user } = await supabase
    .from('users')
    .select('role')
    .eq('id', session.user.id)
    .single()

  if (!user || user.role !== 'admin') {
    redirect('/dashboard')
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Chat Dashboard"
        text="Manage customer conversations and support requests"
      >
        <Button asChild>
          <Link href="/dashboard/chat/all">
            View All Conversations
          </Link>
        </Button>
      </DashboardHeader>

      <div className="space-y-6">
        <Suspense fallback={
          <div className="grid gap-4 md:grid-cols-3 mb-8">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="flex items-center justify-center py-8">
                  <div className="animate-pulse bg-gray-200 h-8 w-16 rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        }>
          <ChatStats />
        </Suspense>

        <div className="grid gap-6 md:grid-cols-2">
          <Suspense fallback={
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <div className="animate-pulse bg-gray-200 h-32 w-full rounded" />
              </CardContent>
            </Card>
          }>
            <RecentConversations />
          </Suspense>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common chat management tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href="/dashboard/chat/all">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  View All Conversations
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href="/api/admin/setup-chat">
                  <Users className="mr-2 h-4 w-4" />
                  Setup Chat System
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href="/dashboard/chat/settings">
                  <Clock className="mr-2 h-4 w-4" />
                  Chat Settings
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
} 