# Chat System Migration Instructions

## 🚀 Quick Setup

Your chat widget is ready, but the database tables need to be created. Follow these simple steps:

### Step 1: Open Supabase Dashboard
1. Go to your [Supabase project dashboard](https://app.supabase.com)
2. Navigate to **SQL Editor** in the left sidebar

### Step 2: Run the Migration
1. Open the file `migration-chat-system.sql` (in your project root)
2. Copy **ALL** the SQL content from that file
3. Paste it into the Supabase SQL Editor
4. Click **Run** to execute the migration

### Step 3: Verify Installation
After running the SQL, verify the setup by running:
```bash
node scripts/setup-chat-system.js
```

If successful, you should see:
```
✅ Chat system tables verified successfully!
✅ Setup complete! The chat widget should now work.
```

## 🎯 Test the Chat Widget

1. Open your app at http://localhost:3000
2. Look for the chat bubble button in the bottom-right corner
3. Click it to open the chat widget
4. Click "Start Chat" to test the functionality

## 📋 What the Migration Creates

The migration sets up these tables:
- **`chat_conversations`** - Stores conversation metadata
- **`chat_participants`** - Tracks who's in each conversation  
- **`chat_messages`** - Stores individual messages

Plus:
- ✅ Performance indexes
- ✅ Row Level Security (RLS) policies
- ✅ Auto-update triggers
- ✅ Proper foreign key relationships

## 🔧 Troubleshooting

**If you see "Chat tables not found":**
- Make sure you ran the complete SQL migration
- Check that all tables were created successfully
- Verify your Supabase environment variables are correct

**If the chat widget doesn't appear:**
- Check browser console for errors
- Ensure you're signed in (if required)
- Verify the server is running at http://localhost:3000

**If you can't start a chat:**
- Check the browser console for detailed error logs (look for 🚀, ✅, ❌ emoji prefixes)
- Verify the API endpoints are working
- Make sure the migration completed successfully

## 🛠️ Database Schema Overview

```
chat_conversations
├── id (uuid, primary key)
├── title (text)
├── status (active|closed|archived)
├── priority (low|normal|high|urgent)
├── customer_email (text)
├── customer_name (text)
├── assigned_admin_id (uuid → auth.users)
└── timestamps

chat_participants  
├── id (uuid, primary key)
├── conversation_id (uuid → chat_conversations)
├── user_id (uuid → auth.users)
├── participant_type (customer|admin|guest)
└── activity tracking

chat_messages
├── id (uuid, primary key)  
├── conversation_id (uuid → chat_conversations)
├── sender_id (uuid → auth.users)
├── sender_name (text)
├── content (text)
├── message_type (text|image|file|system)
└── timestamps
```

## ✨ Features Included

- 💬 Real-time messaging
- 👥 Multi-participant conversations
- 🔐 Role-based access control
- 📱 Responsive design
- 🎨 Beautiful UI with animations
- 🚨 Comprehensive error handling
- 📊 Admin conversation management
- 🔍 Message search and filtering 