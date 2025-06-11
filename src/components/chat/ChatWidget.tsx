"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@/hooks/useChat";
import { ChatMessage, ChatConversationWithDetails } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Minus, Send, Phone, User, Clock, CheckCheck, Plus } from "lucide-react";

export default function ChatWidget() {
  const { state, actions } = useChat();
  const [newMessage, setNewMessage] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [showContactForm, setShowContactForm] = useState(false);
  const [isStartingChat, setIsStartingChat] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  console.warn("🎯 ChatWidget state:", {
    isOpen: state.isOpen,
    currentConversation: state.currentConversation?.id,
    conversations: state.conversations.length,
    showContactForm,
    isLoading: state.isLoading,
    error,
  });

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [state.currentConversation?.messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !state.currentConversation) return;

    try {
      console.warn("📤 Sending message:", newMessage);
      await actions.sendMessage({
        conversation_id: state.currentConversation.id,
        content: newMessage.trim(),
      });
      setNewMessage("");
      console.warn("✅ Message sent successfully");
    } catch (error) {
      console.error("❌ Error sending message:", error);
      setError("Failed to send message. Please try again.");
    }
  };

  const handleStartNewChat = async (e: React.FormEvent) => {
    e.preventDefault();

    console.warn("🚀 Starting new chat with:", { customerName, customerEmail });

    if (!customerName.trim()) {
      setError("Please enter your name");
      return;
    }

    if (!customerEmail.trim()) {
      setError("Please enter your email");
      return;
    }

    setIsStartingChat(true);
    setError(null);

    try {
      console.warn("🔄 Calling startNewChat action...");
      await actions.startNewChat(customerName, customerEmail);
      console.warn("✅ Chat started successfully");
      setShowContactForm(false);
      setCustomerName("");
      setCustomerEmail("");
    } catch (error) {
      console.error("❌ Error starting chat:", error);
      setError(error instanceof Error ? error.message : "Failed to start chat. Please try again.");
    } finally {
      setIsStartingChat(false);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Chat button (when closed)
  if (!state.isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={actions.toggleChat}
          className="h-14 w-14 rounded-full bg-primary-600 hover:bg-primary-700 shadow-lg transition-all duration-200 hover:scale-105"
          size="sm"
        >
          <MessageCircle className="h-6 w-6 text-white" />
          {state.unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {state.unreadCount > 9 ? "9+" : state.unreadCount}
            </span>
          )}
        </Button>
      </div>
    );
  }

  // Chat widget (when open)
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-200 ${
        state.isMinimized ? "h-16" : "h-96"
      } w-80 bg-white rounded-lg shadow-xl border border-gray-200`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-primary-600 text-white rounded-t-lg">
        <div className="flex items-center space-x-2">
          <MessageCircle className="h-5 w-5" />
          <span className="font-medium">
            {state.currentConversation ? state.currentConversation.title : "ColorCraft Support"}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={actions.toggleMinimize}
            className="h-8 w-8 p-0 hover:bg-primary-700"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={actions.closeChat}
            className="h-8 w-8 p-0 hover:bg-primary-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!state.isMinimized && (
        <>
          {/* Content Area */}
          <div className="flex flex-col h-80">
            {/* No conversation selected */}
            {!state.currentConversation && !showContactForm && (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <MessageCircle className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="font-medium text-gray-900 mb-2">Start a conversation</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Get help with your furniture painting project
                </p>
                <Button onClick={() => setShowContactForm(true)} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Start Chat
                </Button>

                {/* Show recent conversations if any */}
                {state.conversations.length > 0 && (
                  <div className="w-full mt-4">
                    <p className="text-xs text-gray-500 mb-2">Recent conversations:</p>
                    <div className="space-y-1">
                      {state.conversations.slice(0, 3).map((conv) => (
                        <button
                          key={conv.id}
                          onClick={() => actions.setCurrentConversation(conv)}
                          className="w-full text-left p-2 rounded hover:bg-gray-50 text-sm"
                        >
                          <div className="font-medium truncate">{conv.title}</div>
                          <div className="text-xs text-gray-500">
                            {conv.last_message?.content.substring(0, 40)}...
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Contact form */}
            {showContactForm && (
              <div className="flex-1 p-4">
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                    {error}
                  </div>
                )}
                <form onSubmit={handleStartNewChat} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name
                    </label>
                    <Input
                      id="name"
                      value={customerName}
                      onChange={(e) => {
                        setCustomerName(e.target.value);
                        setError(null); // Clear error when user starts typing
                      }}
                      placeholder="Enter your name"
                      required
                      disabled={isStartingChat}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={customerEmail}
                      onChange={(e) => {
                        setCustomerEmail(e.target.value);
                        setError(null); // Clear error when user starts typing
                      }}
                      placeholder="Enter your email"
                      required
                      disabled={isStartingChat}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button type="submit" className="flex-1" disabled={isStartingChat}>
                      {isStartingChat ? "Starting Chat..." : "Start Chat"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowContactForm(false);
                        setError(null);
                      }}
                      disabled={isStartingChat}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Messages area */}
            {state.currentConversation && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {state.currentConversation.messages?.map((message) => (
                    <MessageBubble key={message.id} message={message} formatTime={formatTime} />
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message input */}
                <div className="border-t border-gray-200 p-3">
                  <form onSubmit={handleSendMessage} className="flex space-x-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1"
                    />
                    <Button type="submit" size="sm" disabled={!newMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// Message bubble component
function MessageBubble({
  message,
  formatTime,
}: {
  message: ChatMessage;
  formatTime: (timestamp: string) => string;
}) {
  const isSystem = message.message_type === "system";
  const isCurrentUser = message.sender_id === "current_user"; // This would need proper user context

  if (isSystem) {
    return (
      <div className="flex justify-center">
        <div className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
          isCurrentUser ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-900"
        }`}
      >
        {!isCurrentUser && <div className="text-xs font-medium mb-1">{message.sender_name}</div>}
        <div className="text-sm">{message.content}</div>
        <div
          className={`text-xs mt-1 flex items-center space-x-1 ${
            isCurrentUser ? "text-primary-100" : "text-gray-500"
          }`}
        >
          <Clock className="h-3 w-3" />
          <span>{formatTime(message.created_at)}</span>
          {isCurrentUser && message.is_read && <CheckCheck className="h-3 w-3" />}
        </div>
      </div>
    </div>
  );
}
