# Authentication System Documentation

## Overview

Color & Craft uses Supabase Auth for authentication, which integrates with the database to handle users. This document explains how the system works and the fixes implemented for handling null user IDs during signup.

## Authentication Flow

1. **User Signup**: When a user signs up, Supabase Auth creates an entry in the `auth.users` table
2. **User Profile**: A corresponding entry is created in the `public.users` table through:
   - Database trigger (`on_auth_user_created`)
   - Client-side API calls
   - Server-side creation in OAuth callback

## Problem: Null User ID Issue

Users were experiencing an error during signup:
```
null value in column "id" of relation "users" violates not-null constraint
```

This occurred because:
1. The user record in `auth.users` was created
2. But when attempting to create the user profile in `public.users`, the ID was null
3. This violated the not-null constraint on the `id` column

## Solution

We implemented a multi-layered approach to fix this issue:

### 1. Helper Function (`createUserProfile`)

Created a robust helper function that:
- Validates the user ID before insertion
- Checks if the user already exists to prevent duplicates
- Provides proper error handling and reporting
- Returns a structured response with success/error status

### 2. Improved Signup Flow

Updated the signup component to:
- Check for the user ID immediately after signup
- Fall back to fetching the user after a brief delay if needed
- Use the helper function for reliable profile creation
- Provide better error messages to users

### 3. Database Improvements

- Added a more robust database trigger with better error handling
- Implemented proper fallbacks for nullable fields
- Added database constraints with sensible defaults
- Created migration scripts to fix any existing data issues

### 4. OAuth Callback Enhancement

Updated the OAuth callback to properly handle user creation after third-party authentication.

## Implementation Details

### Database Trigger

The database trigger now:
- Extracts user metadata with fallbacks
- Handles existing users by updating their data
- Has exception handling to prevent authentication failures
- Creates entries with default values for required fields

### User Profile Creation

The user profile creation process:
1. First tries to use the ID from the signup response
2. If not available, waits briefly and tries to fetch the user
3. Falls back to letting the database trigger handle it if necessary

## Testing Authentication

To test the authentication system:
1. Sign up with email and password
2. Sign in with the created account
3. Try OAuth signin with Google
4. Test password reset flow

## Troubleshooting

If users still experience issues:
- Check that the database trigger is properly installed
- Verify that the user exists in `auth.users` but not in `public.users`
- Run the data fix script to create missing profiles
- Check the logs for specific error messages 