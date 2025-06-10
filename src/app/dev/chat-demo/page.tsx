import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  MessageCircle, 
  Database,
  Users, 
  Zap, 
  Shield,
  Clock,
  CheckCircle
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Chat System Demo - ColorCraft',
  description: 'Interactive demo of the live chat system with Supabase integration',
}

export default function ChatDemoPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">🚀 Live Chat System Demo</h1>
          <p className="text-xl text-muted-foreground">
            Open-source Jivo alternative fully integrated with Supabase
          </p>
          <div className="flex items-center justify-center space-x-2">
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="w-3 h-3 mr-1" />
              Real-time messaging
            </Badge>
            <Badge className="bg-blue-100 text-blue-800">
              <Database className="w-3 h-3 mr-1" />
              Supabase powered
            </Badge>
            <Badge className="bg-purple-100 text-purple-800">
              <Shield className="w-3 h-3 mr-1" />
              Row Level Security
            </Badge>
          </div>
        </div>

        {/* Setup Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="w-5 h-5 mr-2" />
              Quick Setup
            </CardTitle>
            <CardDescription>
              Follow these steps to get the chat system running
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold">1. Database Setup</h4>
                <p className="text-sm text-muted-foreground">
                  Run the SQL migration to create chat tables
                </p>
                <Button size="sm" variant="outline" className="w-full">
                  Setup Database Tables
                </Button>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">2. Start Chatting</h4>
                <p className="text-sm text-muted-foreground">
                  Use the floating chat widget to test messaging
                </p>
                <Button size="sm" className="w-full">
                  Open Chat Widget
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Real-time Messaging */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                Real-time Messaging
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Instant message delivery</li>
                <li>• Live typing indicators</li>
                <li>• Online status tracking</li>
                <li>• Message read receipts</li>
              </ul>
            </CardContent>
          </Card>

          {/* Customer Support */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Users className="w-5 h-5 mr-2 text-blue-500" />
                Customer Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Multiple conversations</li>
                <li>• Customer information</li>
                <li>• Priority levels</li>
                <li>• Admin assignment</li>
              </ul>
            </CardContent>
          </Card>

          {/* Admin Dashboard */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Shield className="w-5 h-5 mr-2 text-green-500" />
                Admin Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Conversation management</li>
                <li>• Search & filtering</li>
                <li>• Status tracking</li>
                <li>• Message history</li>
              </ul>
            </CardContent>
          </Card>

          {/* Database Integration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Database className="w-5 h-5 mr-2 text-purple-500" />
                Supabase Integration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• PostgreSQL backend</li>
                <li>• Row Level Security</li>
                <li>• Real-time subscriptions</li>
                <li>• User authentication</li>
              </ul>
            </CardContent>
          </Card>

          {/* Modern UI */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <MessageCircle className="w-5 h-5 mr-2 text-pink-500" />
                Modern Interface
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Floating chat widget</li>
                <li>• Responsive design</li>
                <li>• Dark mode support</li>
                <li>• Smooth animations</li>
              </ul>
            </CardContent>
          </Card>

          {/* Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Clock className="w-5 h-5 mr-2 text-orange-500" />
                High Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Optimized queries</li>
                <li>• Efficient caching</li>
                <li>• Minimal bundle size</li>
                <li>• Fast load times</li>
              </ul>
            </CardContent>
          </Card>

        </div>

        {/* Technical Details */}
        <Card>
          <CardHeader>
            <CardTitle>Technical Architecture</CardTitle>
            <CardDescription>
              Built with modern web technologies for optimal performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Frontend Stack</h4>
                <ul className="space-y-1 text-sm">
                  <li>• <strong>Next.js 15</strong> - React framework</li>
                  <li>• <strong>TypeScript</strong> - Type safety</li>
                  <li>• <strong>Tailwind CSS</strong> - Styling</li>
                  <li>• <strong>React Query</strong> - Data fetching</li>
                  <li>• <strong>Zustand</strong> - State management</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Backend Stack</h4>
                <ul className="space-y-1 text-sm">
                  <li>• <strong>Supabase</strong> - Backend as a Service</li>
                  <li>• <strong>PostgreSQL</strong> - Database</li>
                  <li>• <strong>Row Level Security</strong> - Data protection</li>
                  <li>• <strong>Real-time</strong> - Live updates</li>
                  <li>• <strong>REST API</strong> - HTTP endpoints</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo Instructions */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">🎯 Try It Now!</CardTitle>
            <CardDescription className="text-blue-700">
              Test the chat system functionality
            </CardDescription>
          </CardHeader>
          <CardContent className="text-blue-800">
            <ol className="list-decimal list-inside space-y-2">
              <li>Look for the floating chat button in the bottom-right corner</li>
              <li>Click to open the chat widget</li>
              <li>Fill in your name and email to start a conversation</li>
              <li>Send a message and see real-time updates</li>
              <li>Admins can access the dashboard at <code>/dashboard/chat</code></li>
            </ol>
            <div className="mt-4 p-4 bg-blue-100 rounded-lg">
              <p className="text-sm">
                <strong>💡 Pro Tip:</strong> Open multiple browser windows to simulate 
                different users and see real-time messaging in action!
              </p>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
} 