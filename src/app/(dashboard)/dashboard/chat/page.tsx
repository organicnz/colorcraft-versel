import { Metadata } from 'next'
import ChatManagement from '@/components/dashboard/ChatManagement'

export const metadata: Metadata = {
  title: 'Chat Management - ColorCraft Dashboard',
  description: 'Manage customer chat conversations and support requests',
}

// Force dynamic rendering to prevent SSG issues with Supabase
export const dynamic = 'force-dynamic'

export default function ChatPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Chat Management</h1>
          <p className="text-muted-foreground">
            Manage customer conversations and provide support
          </p>
        </div>
      </div>

      <ChatManagement />
    </div>
  )
} 