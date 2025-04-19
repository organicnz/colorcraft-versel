-- Update users table with better defaults and constraints
ALTER TABLE public.users 
  ALTER COLUMN email SET DEFAULT '',
  ALTER COLUMN full_name SET DEFAULT 'User',
  ALTER COLUMN role SET DEFAULT 'customer',
  ALTER COLUMN created_at SET DEFAULT NOW(),
  ALTER COLUMN updated_at SET DEFAULT NOW();

-- Add proper indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users (email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users (role);

-- Fix any existing entries with null values
UPDATE public.users SET 
  full_name = COALESCE(full_name, 'User'),
  email = COALESCE(email, ''),
  role = COALESCE(role, 'customer'),
  created_at = COALESCE(created_at, NOW()),
  updated_at = NOW()
WHERE full_name IS NULL OR email IS NULL OR role IS NULL OR created_at IS NULL;

-- Manual fix for any dangling users (optional)
DO $$
BEGIN
  -- This will identify any auth.users that don't have a corresponding public.users entry
  FOR user_record IN 
    SELECT au.id
    FROM auth.users au
    LEFT JOIN public.users pu ON au.id = pu.id
    WHERE pu.id IS NULL
  LOOP
    -- Create missing users record
    INSERT INTO public.users (id, email, full_name, role, created_at, updated_at)
    SELECT 
      user_record.id,
      COALESCE((SELECT email FROM auth.users WHERE id = user_record.id), ''),
      COALESCE((SELECT raw_user_meta_data->>'full_name' FROM auth.users WHERE id = user_record.id), 'User'),
      'customer',
      NOW(),
      NOW();
  END LOOP;
END;
$$; 