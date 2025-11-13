# Test RPC Functions Directly

If the brag data is still not showing, you can test the RPC function directly in the browser console.

## Step 1: Open Browser Console
Press F12 or Cmd+Option+I (Mac) to open developer tools, then go to the Console tab.

## Step 2: Test the Brag Document RPC

Paste this code into the console:

```javascript
// Import supabase client
import { supabase } from './src/integrations/supabase/client';

// Test the brag document RPC
const testBragRPC = async () => {
  console.log('Testing brag document RPC...');
  
  const { data, error } = await supabase.rpc(
    'get_brag_document_sbu_completeness',
    {
      p_year: 2025,
      p_month: 5,
      p_sbu_id: null,
    }
  );
  
  console.log('Result:', data);
  console.log('Error:', error);
  console.log('Type:', typeof data);
  console.log('Is array?:', Array.isArray(data));
  
  if (typeof data === 'string') {
    console.log('Data is string, parsing...');
    const parsed = JSON.parse(data);
    console.log('Parsed:', parsed);
  }
};

testBragRPC();
```

## Step 3: Check the SQL Query Directly

Go to your Supabase Dashboard → SQL Editor and run:

```sql
-- Test with May 2025
SELECT * FROM get_brag_document_sbu_completeness(2025, 5, NULL);

-- Also try other months
SELECT * FROM get_brag_document_sbu_completeness(2025, 1, NULL);
SELECT * FROM get_brag_document_sbu_completeness(2025, 4, NULL);
```

## Step 4: Check What Data Exists

Run this query to see which months have brag document data:

```sql
SELECT 
  EXTRACT(YEAR FROM created_at) as year,
  EXTRACT(MONTH FROM created_at) as month,
  COUNT(*) as count
FROM brag_documents
WHERE EXTRACT(YEAR FROM created_at) = 2025
GROUP BY year, month
ORDER BY year, month;
```

This will show you which months actually have data.

## Common Issues:

### 1. RPC Function Returns NULL
The function might be returning `null` instead of an empty array.

**Check:** Look at your RPC function's RETURN statement. It should be:
```sql
RETURN COALESCE(v_result, '[]'::json);
```

### 2. Month/Year Parameter Names Don't Match
The RPC function parameters might be named differently.

**Check:** Verify parameter names in Supabase Dashboard → Database → Functions

### 3. No Data for That Month
There might genuinely be no brag documents submitted for May 2025.

**Solution:** Try different months or check the query in Step 4.

### 4. Function Returns JSON as String
Some Supabase configurations return JSON as a string that needs parsing.

**Check:** The hook should handle this (we added parsing logic), but check console logs.

## What to Look For:

In the browser console, you should see:
- `Calling RPC with params: {p_year: 2025, p_month: 5, p_sbu_id: null}`
- `Raw RPC response: {result: [...], rpcError: null}`
- `Parsed data: [...]`
- `Brag document data set to state: [...]`

If you see any errors or unexpected values, that will help identify the issue!
