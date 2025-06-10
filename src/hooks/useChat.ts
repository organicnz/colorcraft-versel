"use client"

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ChatConversationWithDetails, ChatMessage, NewChatMessage, NewChatConversation, ChatState } from '@/types/chat'

export function useChat() {
  const [state, setState] = useState<ChatState>({
    isOpen: false,
    isMinimized: false,
    conversations: [],
    isLoading: false,
    isTyping: false,
    unreadCount: 0
  })

  const supabase = createClient()

  // Load conversations
  const loadConversations = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }))
      
      const response = await fetch('/api/chat/conversations')
      const data = await response.json()
      
      if (response.ok) {
        setState(prev => ({
          ...prev,
          conversations: data.conversations || [],
          unreadCount: data.conversations?.reduce((acc: number, conv: ChatConversationWithDetails) => 
            acc + (conv.unread_count || 0), 0) || 0
        }))
      } else {
        console.error('Error loading conversations:', data.error)
      }
    } catch (error) {
      console.error('Error loading conversations:', error)
    } finally {
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }, [])

  // Load messages for a conversation
  const loadMessages = useCallback(async (conversationId: string) => {
    try {
      const response = await fetch(`/api/chat/messages?conversation_id=${conversationId}`)
      const data = await response.json()
      
      if (response.ok) {
        setState(prev => ({
          ...prev,
          currentConversation: {
            ...prev.currentConversation!,
            messages: data.messages || []
          }
        }))
        return data.messages
      } else {
        console.error('Error loading messages:', data.error)
        return []
      }
    } catch (error) {
      console.error('Error loading messages:', error)
      return []
    }
  }, [])

  // Send a message
  const sendMessage = useCallback(async (message: NewChatMessage) => {
    try {
      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message)
      })
      
      const data = await response.json()
      
      if (response.ok) {
        // Message will be added via real-time subscription
        return data.message
      } else {
        console.error('Error sending message:', data.error)
        throw new Error(data.error)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      throw error
    }
  }, [])

  // Create a new conversation
  const createConversation = useCallback(async (conversation: NewChatConversation) => {
    try {
      const response = await fetch('/api/chat/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(conversation)
      })
      
      const data = await response.json()
      
      if (response.ok) {
        await loadConversations() // Refresh conversations
        return data.conversation
      } else {
        console.error('Error creating conversation:', data.error)
        throw new Error(data.error)
      }
    } catch (error) {
      console.error('Error creating conversation:', error)
      throw error
    }
  }, [loadConversations])

  // Set current conversation
  const setCurrentConversation = useCallback(async (conversation: ChatConversationWithDetails) => {
    setState(prev => ({ ...prev, currentConversation: conversation }))
    
    // Load messages if not already loaded
    if (!conversation.messages || conversation.messages.length === 0) {
      await loadMessages(conversation.id)
    }
  }, [loadMessages])

  // Toggle chat open/closed
  const toggleChat = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      isOpen: !prev.isOpen,
      isMinimized: false 
    }))
  }, [])

  // Minimize/maximize chat
  const toggleMinimize = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      isMinimized: !prev.isMinimized 
    }))
  }, [])

  // Close chat
  const closeChat = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      isOpen: false,
      isMinimized: false 
    }))
  }, [])

  // Start new chat
  const startNewChat = useCallback(async (customerName?: string, customerEmail?: string) => {
    try {
      const conversation = await createConversation({
        title: `Chat with ${customerName || 'Customer'}`,
        customer_name: customerName,
        customer_email: customerEmail
      })
      
      setState(prev => ({
        ...prev,
        isOpen: true,
        isMinimized: false,
        currentConversation: {
          ...conversation,
          messages: []
        }
      }))
      
      return conversation
    } catch (error) {
      console.error('Error starting new chat:', error)
      throw error
    }
  }, [createConversation])

  // Set up real-time subscriptions
  useEffect(() => {
    const channel = supabase
      .channel('chat_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages'
        },
        (payload) => {
          const newMessage = payload.new as ChatMessage
          
          setState(prev => {
            // Add message to current conversation if it matches
            if (prev.currentConversation?.id === newMessage.conversation_id) {
              const updatedConversation = {
                ...prev.currentConversation,
                messages: [...(prev.currentConversation.messages || []), newMessage]
              }
              
              return {
                ...prev,
                currentConversation: updatedConversation
              }
            }
            
            // Update conversations list
            const updatedConversations = prev.conversations.map(conv => {
              if (conv.id === newMessage.conversation_id) {
                return {
                  ...conv,
                  last_message: newMessage,
                  last_message_at: newMessage.created_at,
                  unread_count: (conv.unread_count || 0) + 1
                }
              }
              return conv
            })
            
            return {
              ...prev,
              conversations: updatedConversations,
              unreadCount: prev.unreadCount + 1
            }
          })
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_conversations'
        },
        () => {
          // Reload conversations when a new one is created
          loadConversations()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, loadConversations])

  // Load conversations on mount
  useEffect(() => {
    loadConversations()
  }, [loadConversations])

  return {
    state,
    actions: {
      loadConversations,
      loadMessages,
      sendMessage,
      createConversation,
      setCurrentConversation,
      toggleChat,
      toggleMinimize,
      closeChat,
      startNewChat
    }
  }
} 