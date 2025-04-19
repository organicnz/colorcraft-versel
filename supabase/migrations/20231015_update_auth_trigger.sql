-- Improved function to handle user creation with better error handling and fallbacks
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  full_name TEXT;
  avatar_url TEXT;
  user_email TEXT;
BEGIN
  -- Extract metadata with fallbacks
  full_name := COALESCE(
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'name',
    SPLIT_PART(new.email, '@', 1),
    'New User'
  );
  
  avatar_url := COALESCE(
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'avatar',
    NULL
  );
  
  user_email := COALESCE(new.email, '');
  
  -- Check if user already exists to prevent duplicate entries
  IF EXISTS (SELECT 1 FROM public.users WHERE id = new.id) THEN
    -- If user exists, update their data instead
    UPDATE public.users
    SET 
      full_name = COALESCE(full_name, users.full_name),
      email = COALESCE(user_email, users.email),
      avatar_url = COALESCE(avatar_url, users.avatar_url),
      updated_at = NOW()
    WHERE id = new.id;
  ELSE
    -- Create new user with safe defaults
    INSERT INTO public.users (id, email, full_name, avatar_url, role, created_at, updated_at)
    VALUES (
      new.id,
      user_email,
      full_name,
      avatar_url,
      'customer',
      NOW(),
      NOW()
    );
  END IF;
  
  RETURN new;
EXCEPTION WHEN OTHERS THEN
  -- Log the error but don't fail the auth process
  RAISE WARNING 'Error in handle_new_user trigger: %', SQLERRM;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Make sure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger to run on both insert and update
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user(); 