# Leaderboard Hooks

This directory contains custom React hooks for fetching leaderboard data from Supabase RPC functions.

## Available Hooks

### `useAttendanceLeaderboard`

Fetches SBU attendance health leaderboard data.

**Usage:**

```tsx
import { useAttendanceLeaderboard } from '@/hooks/useAttendanceLeaderboard';

function MyComponent() {
  const { data, loading, error, refetch } = useAttendanceLeaderboard({
    startDate: '2025-01-01',
    endDate: '2025-01-31',
    autoFetch: true, // optional, defaults to true
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {data.map(sbu => (
        <div key={sbu.sbu_id}>
          {sbu.rank}. {sbu.sbu_name} - Health Score: {sbu.health_score}
        </div>
      ))}
    </div>
  );
}
```

**Parameters:**
- `startDate` (string, required): Start date in YYYY-MM-DD format
- `endDate` (string, required): End date in YYYY-MM-DD format
- `autoFetch` (boolean, optional): Whether to automatically fetch data on mount. Default: `true`

**Returns:**
- `data`: Array of `AttendanceSBUData` objects
- `loading`: Boolean indicating if data is being fetched
- `error`: Error message string or null
- `refetch`: Function to manually refetch data

**Data Structure (`AttendanceSBUData`):**
```typescript
{
  sbu_id: number;
  sbu_name: string;
  rank: number;
  total_employees: number;
  avg_worked_hours: number;
  missing_logs_percentage: number | null;
  low_hours_percentage: number | null;
  high_hours_percentage: number | null;
  invalid_hours_percentage: number | null;
  health_score: number | null;
  employees_with_issues: number;
}
```

---

### `useBragDocumentCompleteness`

Fetches SBU brag document submission completeness data.

**Usage:**

```tsx
import { useBragDocumentCompleteness } from '@/hooks/useBragDocumentCompleteness';

function MyComponent() {
  const { data, loading, error, refetch } = useBragDocumentCompleteness({
    year: 2025,
    month: 1,
    sbuId: null, // optional, null for all SBUs
    autoFetch: true, // optional, defaults to true
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {data.map(sbu => (
        <div key={sbu.sbu_id}>
          {sbu.sbu_name}: {sbu.completion_percentage}% complete
        </div>
      ))}
    </div>
  );
}
```

**Parameters:**
- `year` (number, required): Year to fetch data for
- `month` (number, required): Month to fetch data for (1-12)
- `sbuId` (number | null, optional): Specific SBU ID to filter by, or null for all SBUs
- `autoFetch` (boolean, optional): Whether to automatically fetch data on mount. Default: `true`

**Returns:**
- `data`: Array of `BragDocumentSBUData` objects
- `loading`: Boolean indicating if data is being fetched
- `error`: Error message string or null
- `refetch`: Function to manually refetch data

**Data Structure (`BragDocumentSBUData`):**
```typescript
{
  sbu_id: number;
  sbu_name: string;
  total_active_employees: number;
  submitted_employees: number;
  not_submitted_employees: number;
  completion_percentage: number;
}
```

---

## Examples

### Current Month Attendance

```tsx
function getCurrentMonthDateRange() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);
  
  return {
    start: startDate.toISOString().split('T')[0],
    end: endDate.toISOString().split('T')[0],
  };
}

const { start, end } = getCurrentMonthDateRange();
const { data } = useAttendanceLeaderboard({
  startDate: start,
  endDate: end,
});
```

### Current Month Brag Documents

```tsx
const now = new Date();
const { data } = useBragDocumentCompleteness({
  year: now.getFullYear(),
  month: now.getMonth() + 1, // JS months are 0-indexed
});
```

### Manual Refetch

```tsx
const { data, refetch } = useAttendanceLeaderboard({
  startDate: '2025-01-01',
  endDate: '2025-01-31',
  autoFetch: false, // Don't fetch on mount
});

// Later, fetch data manually
<button onClick={() => refetch()}>Refresh Data</button>
```
