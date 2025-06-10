# Portfolio Status Field Migration

## Overview

This migration transitions the portfolio management system from using multiple boolean fields (`is_published`, `is_draft`, `is_archived`) to a single, more maintainable `status` field.

## Benefits

### 1. **Cleaner Data Model**
- **Before**: 3 boolean fields that could create invalid states
- **After**: 1 enum field with clear, mutually exclusive states

### 2. **Better State Management**
```typescript
// Before: Complex boolean logic
const isVisible = project.is_published && !project.is_archived && !project.is_draft;

// After: Simple status check
const isVisible = project.status === 'published';
```

### 3. **Improved Performance**
- Single indexed field instead of multiple boolean indexes
- Faster queries with direct status filtering
- Reduced database storage overhead

### 4. **Enhanced User Experience**
- Clear status indicators in the admin interface
- Intuitive dropdown selection instead of toggle switches
- Better visual feedback with status badges

## Status Values

| Status | Description | Visibility |
|--------|-------------|------------|
| `draft` | Work in progress | Admin only |
| `published` | Live on website | Public |
| `archived` | Hidden/removed | Admin only |

## Migration Process

### 1. Database Schema Update
```sql
-- Add status column with constraint
ALTER TABLE portfolio 
ADD COLUMN status text 
CHECK (status IN ('published', 'draft', 'archived')) 
DEFAULT 'draft' NOT NULL;

-- Migrate existing data
UPDATE portfolio 
SET status = CASE 
  WHEN is_archived = true THEN 'archived'
  WHEN is_published = true THEN 'published'
  ELSE 'draft'
END;

-- Add performance indexes
CREATE INDEX portfolio_status_idx ON portfolio(status);
CREATE INDEX portfolio_status_created_idx ON portfolio(status, created_at);
```

### 2. Application Code Updates

#### Actions (Server-side)
- Updated `createPortfolioProject` to use status field
- Modified `fetchPortfolioProjects` to filter by status
- Simplified `archivePortfolioProject` and `restorePortfolioProject`
- Enhanced `publishPortfolioProject` and `unpublishPortfolioProject`

#### Components (Client-side)
- Updated `PortfolioForm` with status dropdown selector
- Modified `PortfolioTabs` to use status-based filtering
- Enhanced `PortfolioItem` with status badges
- Simplified `PortfolioTable` status display

#### Public Pages
- Updated portfolio page to filter by `status = 'published'`
- Removed complex boolean field queries

## Running the Migration

### Via Admin Interface
1. Navigate to `/dashboard/admin/migrations`
2. Click "Run Portfolio Status Migration"
3. Monitor the migration results

### Via API
```bash
curl -X POST http://localhost:3000/api/migrate-portfolio-status \
  -H "Content-Type: application/json"
```

## Backward Compatibility

During the transition period:
- Both boolean fields and status field exist
- Application code prioritizes status field
- Migration preserves existing data integrity
- Old boolean fields can be removed after testing

## Testing Checklist

- [ ] Portfolio creation with different statuses
- [ ] Status changes (draft → published → archived)
- [ ] Public portfolio page shows only published items
- [ ] Admin dashboard filtering works correctly
- [ ] Status badges display properly
- [ ] Performance improvements verified

## Future Considerations

### Potential Status Extensions
- `scheduled` - For future publication dates
- `review` - For content requiring approval
- `featured` - For highlighted portfolio items

### Additional Improvements
- Audit trail for status changes
- Automated status transitions
- Bulk status operations
- Status-based notifications

## Code Examples

### Creating a Portfolio Item
```typescript
const portfolioData = {
  title: "Vintage Dresser Restoration",
  brief_description: "Beautiful antique dresser brought back to life",
  status: 'draft' // Clear, explicit status
};
```

### Querying by Status
```typescript
// Get all published portfolios
const { data } = await supabase
  .from('portfolio')
  .select('*')
  .eq('status', 'published');

// Get drafts and published (active items)
const { data } = await supabase
  .from('portfolio')
  .select('*')
  .in('status', ['draft', 'published']);
```

### Status-based UI
```tsx
const StatusBadge = ({ status }: { status: string }) => {
  const variants = {
    draft: "bg-yellow-50 text-yellow-800 border-yellow-200",
    published: "bg-green-100 text-green-800",
    archived: "bg-gray-100 text-gray-800"
  };
  
  return (
    <Badge className={variants[status]}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};
```

## Migration Results

After running the migration, you should see:
- ✅ Status column added successfully
- ✅ Data migrated from boolean fields
- ✅ Performance indexes created
- ✅ Application code updated
- ✅ UI components enhanced

## Rollback Plan

If needed, the migration can be rolled back by:
1. Reverting application code to use boolean fields
2. Keeping the status column for future use
3. Ensuring boolean fields remain accurate

However, the status field approach is recommended for long-term maintainability. 