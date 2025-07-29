# Supabase Setup Guide for Zola Chat Application

This guide will help you set up your Supabase database with all required tables, Row Level Security (RLS) policies, and storage buckets for the Zola chat application.

## Prerequisites

- A Supabase account and project
- Access to your Supabase dashboard
- Basic understanding of SQL

## Step 1: Database Schema Setup

1. **Open your Supabase dashboard**
   - Go to [supabase.com](https://supabase.com)
   - Navigate to your project

2. **Run the main setup script**
   - Go to the "SQL Editor" section in your Supabase dashboard
   - Copy the contents of `supabase-setup.sql`
   - Paste it into a new query
   - Click "Run" to execute the script

3. **Run the storage setup script**
   - Copy the contents of `supabase-storage-setup.sql`
   - Paste it into a new query
   - Click "Run" to execute the script

   These scripts will:
   - Create all required tables (users, chats, messages, projects, etc.)
   - Set up foreign key relationships
   - Enable Row Level Security on all tables
   - Create comprehensive RLS policies
   - Add triggers for automatic timestamp updates
   - Create storage buckets and policies

## Step 2: Storage Buckets Setup

You have two options to set up storage buckets:

### Option A: Using SQL Script (Recommended)
1. After running `supabase-setup.sql`, run the storage setup script:
   ```sql
   -- Run this in your Supabase SQL Editor
   ```
2. Copy and paste the contents of `supabase-storage-setup.sql`
3. Execute the script to create buckets and policies automatically

### Option B: Manual Setup via Dashboard

1. **Navigate to Storage**
   - In your Supabase dashboard, go to "Storage"
   - Click "New bucket"

2. **Create required buckets**
   - Create bucket: `chat-attachments`
     - Set as **private** (RLS policies will control access)
   - Create bucket: `avatars`
     - Set as **public** (user avatars should be publicly viewable)

3. **Apply storage policies (Manual)**
   - Go to Storage > Policies
   - For each bucket, add the policies from `supabase-storage-setup.sql`
   - Or use the Supabase dashboard policy builder with these rules:

   **For `chat-attachments` bucket:**
   - INSERT: Users can upload files to their own folder
   - SELECT: Users can view their own files + files from public chats
   - DELETE: Users can delete their own files

   **For `avatars` bucket:**
   - INSERT: Users can upload to their own folder
   - SELECT: Anyone can view (public bucket)
   - UPDATE/DELETE: Users can modify their own avatars

## Step 3: Authentication Setup

1. **Enable Google OAuth**
   - Go to Authentication > Providers
   - Enable Google provider
   - Add your Google OAuth credentials:
     - Client ID
     - Client Secret
   - Set redirect URLs:
     - `https://[YOUR_PROJECT_REF].supabase.co/auth/v1/callback`
     - `http://localhost:3000/auth/callback` (for development)

2. **Enable Anonymous Sign-ins**
   - Go to Authentication > Settings
   - Toggle on "Allow anonymous sign-ins"
   - This enables guest users to try the application

## Step 4: Environment Variables

Add these environment variables to your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR_PROJECT_REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR_ANON_KEY]
SUPABASE_SERVICE_ROLE=[YOUR_SERVICE_ROLE_KEY]
```

You can find these values in:
- Project Settings > API

## Step 5: Verify Setup

1. **Check tables**
   - Go to Table Editor
   - Verify all tables are created:
     - users
     - chats
     - messages
     - projects
     - chat_attachments
     - feedback
     - user_keys
     - user_preferences

2. **Check RLS policies**
   - For each table, click on the table name
   - Go to "RLS" tab
   - Verify policies are enabled and created

3. **Test authentication**
   - Try signing up/signing in with Google
   - Test anonymous access

## Security Features Implemented

### Row Level Security (RLS)
- **User Isolation**: Each user can only access their own data
- **Public Chat Support**: Public chats are viewable by anyone but only editable by owners
- **Anonymous User Support**: Guest users have limited access to their own data
- **Cross-table Security**: Messages and attachments check chat ownership
- **API Key Protection**: BYOK keys are strictly isolated per user

### Storage Security
- **File Isolation**: Users can only upload/access files in their own folders
- **Public Chat Files**: Attachments from public chats are viewable by anyone
- **Avatar Management**: User avatars are publicly viewable but only editable by owners

## Troubleshooting

### Common Issues

1. **RLS Policy Errors**
   - Ensure you're authenticated when testing
   - Check that `auth.uid()` returns a valid UUID
   - Verify foreign key relationships are correct

2. **Storage Upload Errors**
   - Check bucket permissions
   - Verify storage policies are applied
   - Ensure file paths follow the expected structure: `{user_id}/{filename}`

3. **Authentication Issues**
   - Verify OAuth redirect URLs are correct
   - Check that anonymous sign-ins are enabled if using guest features
   - Ensure environment variables are set correctly

### Testing RLS Policies

You can test RLS policies in the SQL editor:

```sql
-- Test as authenticated user
SELECT auth.uid(); -- Should return your user ID
SELECT * FROM users; -- Should only return your user data

-- Test chat access
SELECT * FROM chats; -- Should only return your chats + public chats
```

## Additional Configuration

### Rate Limiting
Consider setting up rate limiting in your Supabase project:
- Go to Settings > API
- Configure rate limits based on your usage patterns

### Database Backups
- Enable automatic backups in Settings > Database
- Consider setting up point-in-time recovery

### Monitoring
- Set up monitoring and alerts in the Supabase dashboard
- Monitor database performance and storage usage

## Support

If you encounter issues:
1. Check the Supabase documentation
2. Review the RLS policy syntax
3. Test policies step by step
4. Check the browser console for authentication errors

---

**Note**: This setup provides a secure, scalable foundation for the Zola chat application with proper user isolation, public chat support, and file management capabilities.