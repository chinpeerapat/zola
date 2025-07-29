-- Zola Chat Application - Supabase Storage Buckets Setup Script
-- This script creates the required storage buckets and applies storage policies

-- ============================================================================
-- STORAGE BUCKETS CREATION
-- ============================================================================

-- Create chat-attachments bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('chat-attachments', 'chat-attachments', false);

-- Create avatars bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);

-- ============================================================================
-- STORAGE BUCKET POLICIES
-- ============================================================================

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Chat attachments bucket policies
CREATE POLICY "Users can upload to chat-attachments" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'chat-attachments' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view chat attachments" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'chat-attachments' AND
    (
      auth.uid()::text = (storage.foldername(name))[1] OR
      EXISTS (
        SELECT 1 FROM chats 
        WHERE chats.public = true
      )
    )
  );

CREATE POLICY "Users can update own chat attachments" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'chat-attachments' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own chat attachments" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'chat-attachments' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Avatars bucket policies
CREATE POLICY "Users can upload avatars" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Anyone can view avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can update own avatars" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own avatars" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================================================
-- STORAGE SETUP COMPLETE
-- ============================================================================

-- Summary of what this script creates:
-- 1. 'chat-attachments' bucket (private) - for storing chat file attachments
-- 2. 'avatars' bucket (public) - for storing user profile images
-- 3. Comprehensive storage policies for:
--    - User-specific file access control
--    - Public avatar viewing
--    - Secure chat attachment handling
--    - File upload/update/delete permissions

-- Usage Instructions:
-- 1. Run this script in your Supabase SQL editor AFTER running supabase-setup.sql
-- 2. Verify buckets are created in Storage > Buckets section
-- 3. Test file upload functionality in your application

-- Note: Make sure the main database tables (especially 'chats') are created
-- before running this script, as the policies reference the 'chats' table.