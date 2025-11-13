# Debugging Brag Data Not Showing

## Issue
The brag document data is not showing on the slide.

## Changes Made

### 1. Updated Both Hooks to Handle JSON Response
The RPC functions return JSON, but Supabase might return it as a string or already parsed. Updated both hooks to handle this:

```typescript
// Parse the result if it's a string
const parsedData = typeof result === 'string' ? JSON.parse(result) : result;
setData(parsedData || []);
```

### 2. Added Console Logging
Added console.log statements in both hooks and components to help debug:
- Hook logs: See what data is returned from Supabase
- Component logs: See the state (data, loading, error)

### 3. Added Empty State Handling
Both slides now show a "No data available" message if the data array is empty.

## How to Debug

### Step 1: Check Browser Console
Open the browser console (F12 or Cmd+Option+I on Mac) and look for:
- `Brag document data:` log - shows what data was fetched
- `BragDocumentSlide state:` log - shows component state
- Any error messages

### Step 2: Verify RPC Function Parameters
The hook is calling:
```typescript
supabase.rpc('get_brag_document_sbu_completeness', {
  p_year: 2025,    // Current year
  p_month: 11,     // Current month (November)
  p_sbu_id: null   // All SBUs
})
```

Make sure:
- The RPC function exists in Supabase
- The function accepts these parameters
- There is data for November 2025

### Step 3: Test with Different Parameters
Try testing with a month/year that you know has data:

```tsx
const { data: brags, loading, error } = useBragDocumentCompleteness({
  year: 2024,      // Change to a year with data
  month: 10,       // Change to a month with data
});
```

### Step 4: Check Supabase Dashboard
1. Go to your Supabase project
2. Navigate to SQL Editor
3. Run the RPC function directly:

```sql
SELECT * FROM get_brag_document_sbu_completeness(2025, 11, NULL);
```

This will show if the function returns data.

## Common Issues

### 1. No Data for Current Month
If you're testing in November 2025 and there's no brag document data for this month, the slide will show "No data available".

**Solution**: Add test data or change the month/year parameters.

### 2. RPC Function Not Found
Error: `function get_brag_document_sbu_completeness does not exist`

**Solution**: Make sure the RPC function is created in Supabase.

### 3. JSON Parsing Error
The data might not be in the expected format.

**Solution**: Check the console logs to see the exact data structure being returned.

### 4. Type Mismatch
The TypeScript types might not match the actual data structure.

**Solution**: Check the `BragDocumentSBUData` interface matches your database schema.

## Quick Fix to Test

If you want to test with mock data, temporarily replace the hook call:

```tsx
// In BragDocumentSlide.tsx
const brags = [
  {
    sbu_id: 1,
    sbu_name: "Test SBU 1",
    total_active_employees: 10,
    submitted_employees: 8,
    not_submitted_employees: 2,
    completion_percentage: 80
  },
  {
    sbu_id: 2,
    sbu_name: "Test SBU 2",
    total_active_employees: 15,
    submitted_employees: 10,
    not_submitted_employees: 5,
    completion_percentage: 66.67
  }
];
const loading = false;
const error = null;
```

This will help you verify if the issue is with the UI or the data fetching.
