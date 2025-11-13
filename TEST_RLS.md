# Test RLS and Table Access

Run these queries in Supabase SQL Editor to check if RLS is blocking access:

```sql
-- Check RLS status on tables
SELECT 
    schemaname, 
    tablename, 
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename IN ('sbus', 'profiles', 'brag_documents')
AND schemaname = 'public';

-- Try to select from tables as anon role would see them
SET ROLE anon;
SELECT COUNT(*) FROM sbus;
SELECT COUNT(*) FROM profiles WHERE active = true;
SELECT COUNT(*) FROM brag_documents WHERE year = 2025 AND month = 5;
RESET ROLE;

-- If any of the above fail, you need to add RLS policies:
-- For sbus table
CREATE POLICY "Allow public read access to sbus" ON sbus
    FOR SELECT TO anon, authenticated
    USING (true);

-- For profiles table
CREATE POLICY "Allow public read access to profiles" ON profiles
    FOR SELECT TO anon, authenticated
    USING (true);

-- For brag_documents table
CREATE POLICY "Allow public read access to brag_documents" ON brag_documents
    FOR SELECT TO anon, authenticated
    USING (true);
```

Run these and let me know what errors you get (if any).
