# RPC Function Permissions Issue

## Problem
The RPC function `get_brag_document_sbu_completeness` works in SQL Editor but returns `null` when called from JavaScript client.

## Root Cause
The function likely doesn't have the correct permissions for the `anon` or `authenticated` role.

## Solution

### Step 1: Check Function Permissions in Supabase

Go to your Supabase Dashboard → SQL Editor and run:

```sql
-- Check if the function exists and its security settings
SELECT 
    routine_name,
    routine_type,
    security_type
FROM information_schema.routines
WHERE routine_name = 'get_brag_document_sbu_completeness';
```

### Step 2: Grant Execute Permissions

Run this in SQL Editor to grant permissions to the anon role:

```sql
-- Grant execute permission to anon role (for public access)
GRANT EXECUTE ON FUNCTION get_brag_document_sbu_completeness(INTEGER, INTEGER) TO anon;

-- Also grant to authenticated role (for logged-in users)
GRANT EXECUTE ON FUNCTION get_brag_document_sbu_completeness(INTEGER, INTEGER) TO authenticated;
```

### Step 3: Check If Function Has Correct Security Definer

The function should ideally have `SECURITY DEFINER` if it needs to access tables that the anon role can't directly query:

```sql
-- Recreate the function with SECURITY DEFINER if needed
CREATE OR REPLACE FUNCTION get_brag_document_sbu_completeness(
  p_year INTEGER,
  p_month INTEGER
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER  -- This makes it run with the creator's permissions
AS $$
-- Your existing function body here
$$;

-- Then grant permissions
GRANT EXECUTE ON FUNCTION get_brag_document_sbu_completeness(INTEGER, INTEGER) TO anon;
GRANT EXECUTE ON FUNCTION get_brag_document_sbu_completeness(INTEGER, INTEGER) TO authenticated;
```

### Step 4: Verify RLS Policies

Make sure the tables used by the function (sbus, profiles, brag_documents) have proper RLS policies:

```sql
-- Check RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('sbus', 'profiles', 'brag_documents');

-- If RLS is enabled, you might need policies like:
CREATE POLICY "Allow anon to read sbus" ON sbus FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon to read profiles" ON profiles FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon to read brag_documents" ON brag_documents FOR SELECT TO anon USING (true);
```

## Alternative: Check Function Signature

The function might have a different signature. Check with:

```sql
-- See all functions with similar names
SELECT 
    routine_name,
    routine_type,
    data_type,
    routine_definition
FROM information_schema.routines
WHERE routine_name LIKE '%brag%';

-- Or check parameters
SELECT 
    r.routine_name,
    p.parameter_name,
    p.data_type,
    p.parameter_mode
FROM information_schema.routines r
LEFT JOIN information_schema.parameters p 
    ON r.specific_name = p.specific_name
WHERE r.routine_name = 'get_brag_document_sbu_completeness'
ORDER BY p.ordinal_position;
```

## After Applying Fix

Once you've granted the permissions, reload your React app and it should work!
