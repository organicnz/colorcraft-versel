export interface ChatConversation {
  id: string
  title: string
  status: 'active' | 'closed' | 'archived'
  priority: 'low' | 'normal' | 'high' | 'urgent'
  customer_email?: string
  customer_name?: string
  assigned_admin_id?: string
  metadata: Record<string, any>
  created_at: string
  updated_at: string
  last_message_at: string
}

export interface ChatParticipant {
  id: string
  conversation_id: string
  user_id?: string
  participant_type: 'customer' | 'admin' | 'guest'
  joined_at: string
  last_seen_at: string
  is_online: boolean
}

export interface ChatMessage {
  id: string
  conversation_id: string
  sender_id?: string
  sender_name: string
  sender_email?: string
  message_type: 'text' | 'image' | 'file' | 'system'
  content: string
  metadata: Record<string, any>
  is_read: boolean
  created_at: string
  updated_at: string
}

export interface ChatConversationWithDetails extends ChatConversation {
  participants?: ChatParticipant[]
  messages?: ChatMessage[]
  unread_count?: number
  last_message?: ChatMessage
}

export interface NewChatMessage {
  conversation_id: string
  content: string
  message_type?: 'text' | 'image' | 'file' | 'system'
  metadata?: Record<string, any>
}

export interface NewChatConversation {
  title?: string
  customer_email?: string
  customer_name?: string
  priority?: 'low' | 'normal' | 'high' | 'urgent'
  metadata?: Record<string, any>
}

export interface ChatState {
  isOpen: boolean
  isMinimized: boolean
  currentConversation?: ChatConversationWithDetails
  conversations: ChatConversationWithDetails[]
  isLoading: boolean
  isTyping: boolean
  unreadCount: number
}

export interface TypingIndicator {
  conversation_id: string
  user_id: string
  user_name: string
  timestamp: string
}

export interface ChatNotification {
  id: string
  type: 'new_message' | 'conversation_assigned' | 'user_joined' | 'user_left'
  conversation_id: string
  message?: string
  timestamp: string
  data?: Record<string, any>
} 