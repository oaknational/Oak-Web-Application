# Implementation Guide: QW-004 - Extract Resource Formatting Logic

**Quick Win ID**: QW-004  
**Title**: Extract Resource Formatting Logic  
**Assignee**: AI Assistant  
**Complexity**: Low  
**Expected Outcome**: Reusable formatting utilities with comprehensive tests

## Pre-Implementation Checklist

- [ ] Identify all resource formatting logic in components
- [ ] Check for existing formatting utilities
- [ ] Document current formatting patterns
- [ ] Verify no visual changes will occur
- [ ] Plan for consistent output

## Implementation Steps

### Step 1: Locate Resource Formatting Logic

**Search for formatting patterns**:
```bash
# Find resource-related components
grep -r "resource\|Resource" src/components --include="*.tsx" | grep -i "format\|display"

# Look for file size formatting
grep -r "bytes\|KB\|MB\|GB" src/components --include="*.tsx"

# Find duration formatting
grep -r "duration\|minutes\|hours" src/components --include="*.tsx"
```

**Common patterns to extract**:
- File size formatting (bytes → KB/MB/GB)
- Duration formatting (seconds → "5 mins")
- Resource type display names
- File extension to icon mapping

### Step 2: Create Resource Formatting Utilities

**File**: `/src/utils/resources/formatting.ts`

```typescript
/**
 * Resource formatting utilities
 * Pure functions for consistent resource display
 */

export interface FileSize {
  bytes: number;
  unit?: 'auto' | 'B' | 'KB' | 'MB' | 'GB';
}

/**
 * Formats bytes to human-readable file size
 * @param bytes - File size in bytes
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted string like "1.5 MB"
 */
export function formatFileSize(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  if (!isFinite(bytes)) return 'Unknown size';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));
  
  return `${size} ${sizes[i]}`;
}

/**
 * Formats duration in seconds to readable format
 * @param seconds - Duration in seconds
 * @returns Formatted string like "5 mins" or "1 hr 30 mins"
 */
export function formatDuration(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '0 mins';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    const minPart = minutes > 0 ? ` ${minutes} min${minutes !== 1 ? 's' : ''}` : '';
    return `${hours} hr${hours !== 1 ? 's' : ''}${minPart}`;
  }
  
  return `${minutes} min${minutes !== 1 ? 's' : ''}`;
}

/**
 * Gets display name for resource type
 * @param resourceType - Internal resource type
 * @returns User-friendly display name
 */
export function getResourceTypeDisplayName(resourceType: string): string {
  const displayNames: Record<string, string> = {
    'worksheet': 'Worksheet',
    'slide-deck': 'Slide Deck',
    'video': 'Video',
    'exit-quiz': 'Exit Quiz',
    'starter-quiz': 'Starter Quiz',
    'teacher-guide': 'Teacher Guide',
    'curriculum-pdf': 'Curriculum PDF',
  };
  
  return displayNames[resourceType] || resourceType
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Maps file extension to icon name
 * @param filename - File name with extension
 * @returns Icon name for UI component
 */
export function getFileTypeIcon(filename: string): string {
  const extension = filename.split('.').pop()?.toLowerCase() || '';
  
  const iconMap: Record<string, string> = {
    'pdf': 'file-pdf',
    'doc': 'file-doc',
    'docx': 'file-doc',
    'ppt': 'file-slides',
    'pptx': 'file-slides',
    'mp4': 'file-video',
    'mov': 'file-video',
    'zip': 'file-archive',
    'png': 'file-image',
    'jpg': 'file-image',
    'jpeg': 'file-image',
  };
  
  return iconMap[extension] || 'file-generic';
}
```

### Step 3: Create Comprehensive Tests

**File**: `/src/utils/resources/formatting.test.ts`

```typescript
import {
  formatFileSize,
  formatDuration,
  getResourceTypeDisplayName,
  getFileTypeIcon,
} from './formatting';

describe('Resource Formatting Utils', () => {
  describe('formatFileSize', () => {
    it('should format bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 B');
      expect(formatFileSize(500)).toBe('500 B');
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1536)).toBe('1.5 KB');
      expect(formatFileSize(1048576)).toBe('1 MB');
      expect(formatFileSize(1572864)).toBe('1.5 MB');
      expect(formatFileSize(1073741824)).toBe('1 GB');
    });
    
    it('should handle decimal places', () => {
      expect(formatFileSize(1536, 0)).toBe('2 KB');
      expect(formatFileSize(1536, 2)).toBe('1.50 KB');
      expect(formatFileSize(1536, -1)).toBe('2 KB');
    });
    
    it('should handle edge cases', () => {
      expect(formatFileSize(NaN)).toBe('Unknown size');
      expect(formatFileSize(Infinity)).toBe('Unknown size');
      expect(formatFileSize(-100)).toBe('0 B');
    });
    
    it('should complete within 1ms', () => {
      const start = performance.now();
      for (let i = 0; i < 1000; i++) {
        formatFileSize(i * 1024);
      }
      expect(performance.now() - start).toBeLessThan(1);
    });
  });
  
  describe('formatDuration', () => {
    it('should format seconds to minutes', () => {
      expect(formatDuration(0)).toBe('0 mins');
      expect(formatDuration(30)).toBe('0 mins');
      expect(formatDuration(60)).toBe('1 min');
      expect(formatDuration(90)).toBe('1 min');
      expect(formatDuration(120)).toBe('2 mins');
    });
    
    it('should format to hours and minutes', () => {
      expect(formatDuration(3600)).toBe('1 hr');
      expect(formatDuration(3660)).toBe('1 hr 1 min');
      expect(formatDuration(5400)).toBe('1 hr 30 mins');
      expect(formatDuration(7200)).toBe('2 hrs');
    });
    
    it('should handle edge cases', () => {
      expect(formatDuration(-60)).toBe('0 mins');
      expect(formatDuration(NaN)).toBe('0 mins');
      expect(formatDuration(Infinity)).toBe('0 mins');
    });
  });
  
  describe('getResourceTypeDisplayName', () => {
    it('should return correct display names', () => {
      expect(getResourceTypeDisplayName('worksheet')).toBe('Worksheet');
      expect(getResourceTypeDisplayName('slide-deck')).toBe('Slide Deck');
      expect(getResourceTypeDisplayName('exit-quiz')).toBe('Exit Quiz');
    });
    
    it('should handle unknown types', () => {
      expect(getResourceTypeDisplayName('custom-type')).toBe('Custom Type');
      expect(getResourceTypeDisplayName('single')).toBe('Single');
    });
  });
  
  describe('getFileTypeIcon', () => {
    it('should return correct icons', () => {
      expect(getFileTypeIcon('document.pdf')).toBe('file-pdf');
      expect(getFileTypeIcon('presentation.pptx')).toBe('file-slides');
      expect(getFileTypeIcon('video.mp4')).toBe('file-video');
      expect(getFileTypeIcon('image.png')).toBe('file-image');
    });
    
    it('should handle unknown extensions', () => {
      expect(getFileTypeIcon('file.xyz')).toBe('file-generic');
      expect(getFileTypeIcon('noextension')).toBe('file-generic');
    });
  });
});
```

### Step 4: Update Components

**Example refactoring**:
```typescript
// Before (in ResourceCard.tsx)
const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
};

// After
import { formatFileSize, getFileTypeIcon } from '@/utils/resources/formatting';

export function ResourceCard({ resource }: Props) {
  const fileSize = formatFileSize(resource.sizeInBytes);
  const icon = getFileTypeIcon(resource.filename);
  
  return (
    <Card>
      <Icon name={icon} />
      <Text>{resource.title}</Text>
      <Text size="small">{fileSize}</Text>
    </Card>
  );
}
```

### Step 5: Verify No Visual Changes

1. Take screenshots of resource cards before changes
2. Apply formatting utilities
3. Compare screenshots - should be identical
4. Run visual regression tests if available

## Rollback Plan

If formatting differences are noticed:
1. Check decimal places and rounding
2. Compare exact output strings
3. Adjust formatting functions to match exactly
4. If critical, revert and investigate

## Success Verification

- [ ] All resource formatting uses utilities
- [ ] No visual changes in UI
- [ ] 100% test coverage on utilities
- [ ] Performance <1ms for all functions
- [ ] Consistent formatting across app

## Additional Notes

### Future Enhancements
- Add localization support
- Support different number formats
- Add more file type icons
- Create formatting for dates/times

### Pattern Benefits
- Single source of truth for formatting
- Easy to update all resources at once
- Testable pure functions
- Better accessibility with consistent text

This is a perfect quick win - low risk, high value, improves maintainability.