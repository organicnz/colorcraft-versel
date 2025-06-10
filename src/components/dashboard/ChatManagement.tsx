"use client"

import { useState, useEffect } from 'react'
import { useChat } from '@/hooks/useChat'
import { ChatConversationWithDetails, ChatMessage } from '@/types/chat'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  MessageCircle,
  Send,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  Archive,
  Trash2,
  Search,
  Filter
} from 'lucide-react'

export default function ChatManagement() {
  const { state, actions } = useChat()
  const [selectedConversation, setSelectedConversation] = useState<ChatConversationWithDetails | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'closed' | 'archived'>('all')

  // Auto-select first conversation if none selected
  useEffect(() => {
    if (state.conversations.length > 0 && !selectedConversation) {
      const firstConv = state.conversations[0]
      setSelectedConversation(firstConv)
      actions.setCurrentConversation(firstConv)
    }
  }, [state.conversations, selectedConversation, actions])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newMessage.trim() || !selectedConversation) return

    try {
      await actions.sendMessage({
        conversation_id: selectedConversation.id,
        content: newMessage.trim()
      })
      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const handleConversationSelect = async (conversation: ChatConversationWithDetails) => {
    setSelectedConversation(conversation)
    await actions.setCurrentConversation(conversation)
  }

  const filteredConversations = state.conversations.filter(conv => {
    const matchesSearch = conv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          conv.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          conv.customer_email?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || conv.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      case 'archived': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'urgent': return 'bg-red-100 text-red-800'
      case 'low': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar - Conversations List */}
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Chat Conversations</h2>
          
          {/* Search and Filter */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex space-x-2">
              {(['all', 'active', 'closed', 'archived'] as const).map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                  className="capitalize"
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {state.isLoading ? (
            <div className="p-4 text-center text-gray-500">
              Loading conversations...
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No conversations found
            </div>
          ) : (
            <div className="space-y-2 p-2">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => handleConversationSelect(conversation)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedConversation?.id === conversation.id
                      ? 'bg-primary-50 border border-primary-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">{conversation.title}</h3>
                      <p className="text-xs text-gray-500 truncate">
                        {conversation.customer_name || conversation.customer_email}
                      </p>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <Badge className={getStatusColor(conversation.status)}>
                        {conversation.status}
                      </Badge>
                      {conversation.priority !== 'normal' && (
                        <Badge className={getPriorityColor(conversation.priority)}>
                          {conversation.priority}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {conversation.last_message && (
                    <div className="text-xs text-gray-600 truncate mb-1">
                      {conversation.last_message.content}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{formatDate(conversation.last_message_at)}</span>
                    {conversation.unread_count && conversation.unread_count > 0 && (
                      <Badge className="bg-primary-600 text-white">
                        {conversation.unread_count}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{selectedConversation.title}</h3>
                  <p className="text-sm text-gray-500">
                    {selectedConversation.customer_name} • {selectedConversation.customer_email}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(selectedConversation.status)}>
                    {selectedConversation.status}
                  </Badge>
                  <Badge className={getPriorityColor(selectedConversation.priority)}>
                    {selectedConversation.priority}
                  </Badge>
                  <Button variant="outline" size="sm">
                    <Archive className="h-4 w-4 mr-1" />
                    Archive
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {state.currentConversation?.messages?.map((message) => (
                <AdminMessageBubble
                  key={message.id}
                  message={message}
                  formatTime={formatTime}
                />
              ))}
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your response..."
                  className="flex-1"
                />
                <Button type="submit" disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4 mr-1" />
                  Send
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No conversation selected</h3>
              <p className="text-gray-500">Choose a conversation from the list to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Admin message bubble component
function AdminMessageBubble({ 
  message, 
  formatTime 
}: { 
  message: ChatMessage
  formatTime: (timestamp: string) => string 
}) {
  const isSystem = message.message_type === 'system'
  const isAdmin = message.sender_name.includes('admin') || message.sender_name === 'System'

  if (isSystem) {
    return (
      <div className="flex justify-center">
        <div className="bg-blue-100 text-blue-700 text-sm px-4 py-2 rounded-full">
          <AlertCircle className="inline h-4 w-4 mr-1" />
          {message.content}
        </div>
      </div>
    )
  }

  return (
    <div className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-md ${isAdmin ? 'order-2' : 'order-1'}`}>
        <div className={`px-4 py-3 rounded-lg ${
          isAdmin 
            ? 'bg-primary-600 text-white' 
            : 'bg-white border border-gray-200'
        }`}>
          <div className={`text-xs font-medium mb-1 ${
            isAdmin ? 'text-primary-100' : 'text-gray-500'
          }`}>
            {message.sender_name}
          </div>
          <div className="text-sm">{message.content}</div>
          <div className={`text-xs mt-2 flex items-center space-x-1 ${
            isAdmin ? 'text-primary-100' : 'text-gray-500'
          }`}>
            <Clock className="h-3 w-3" />
            <span>{formatTime(message.created_at)}</span>
            {message.is_read && (
              <CheckCircle className="h-3 w-3" />
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 