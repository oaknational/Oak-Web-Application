# Implementation Guide: QW-002 - Extract Video Progress Calculations

**Quick Win ID**: QW-002  
**Title**: Extract Video Progress Calculations from VideoPlayer  
**Assignee**: AI Assistant  
**Complexity**: Low  
**Expected Outcome**: Pure functions for video calculations with <1ms performance

## Pre-Implementation Checklist

- [ ] Locate VideoPlayer component and understand its structure
- [ ] Identify all progress calculation logic
- [ ] Check for existing video utility files
- [ ] Review current test coverage for VideoPlayer
- [ ] Map video player usage across the platform
- [ ] Document any business rules (e.g., 95% completion threshold)

## Implementation Steps

### Step 1: Analyze VideoPlayer Component

**File**: `/src/components/VideoPlayer/VideoPlayer.tsx`  
**What to look for**:
- onTimeUpdate event handlers
- Progress percentage calculations
- Time formatting functions
- Completion detection logic
- Any duration/currentTime calculations

**Search commands**:
```bash
# Find progress-related logic
grep -n "progress\|percentage\|duration\|currentTime" src/components/VideoPlayer/VideoPlayer.tsx

# Look for time formatting
grep -n "format.*time\|minutes\|seconds" src/components/VideoPlayer/VideoPlayer.tsx
```

### Step 2: Create Video Utilities Structure

**File**: `/src/utils/video/progress.ts`  
**Initial setup**:

```typescript
// src/utils/video/progress.ts
/**
 * Video progress calculation utilities
 * All functions are pure and performance-optimized
 */

// Types for video calculations
export interface VideoProgress {
  percentage: number;
  currentTime: number;
  duration: number;
  isComplete: boolean;
}
```

### Step 3: Extract calculatePlayedPercentage Function

**What to extract**:
- Logic that calculates percentage from currentTime and duration
- Must handle edge cases: zero duration, invalid values
- Should return 0-100 range

**Implementation**:
```typescript
/**
 * Calculates the percentage of video played
 * @param currentTime - Current playback position in seconds
 * @param duration - Total video duration in seconds
 * @returns Percentage played (0-100)
 */
export function calculatePlayedPercentage(
  currentTime: number,
  duration: number
): number {
  // Handle edge cases
  if (!duration || duration <= 0 || !isFinite(duration)) {
    return 0;
  }
  
  if (currentTime < 0) {
    return 0;
  }
  
  if (currentTime >= duration) {
    return 100;
  }
  
  // Calculate percentage, ensure it's within bounds
  const percentage = (currentTime / duration) * 100;
  return Math.min(100, Math.max(0, percentage));
}
```

### Step 4: Extract formatVideoTime Function

**What to extract**:
- Time display formatting (e.g., "1:23:45" or "23:45")
- Must match current display exactly
- Handle hours only when needed

**Implementation**:
```typescript
/**
 * Formats time in seconds to display format
 * @param seconds - Time in seconds
 * @returns Formatted time string (e.g., "1:23:45" or "23:45")
 */
export function formatVideoTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) {
    return '0:00';
  }
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  // Format with leading zeros
  const formattedSecs = secs.toString().padStart(2, '0');
  
  if (hours > 0) {
    const formattedMins = minutes.toString().padStart(2, '0');
    return `${hours}:${formattedMins}:${formattedSecs}`;
  }
  
  return `${minutes}:${formattedSecs}`;
}
```

### Step 5: Extract isVideoComplete Function

**What to extract**:
- Completion detection with 95% threshold
- Must handle business rule consistently
- Consider buffering/seeking edge cases

**Implementation**:
```typescript
/**
 * Determines if video is considered complete
 * Uses 95% threshold to account for users not watching credits/end screens
 * @param currentTime - Current playback position
 * @param duration - Total video duration
 * @param threshold - Completion threshold (default: 0.95)
 * @returns Whether video is complete
 */
export function isVideoComplete(
  currentTime: number,
  duration: number,
  threshold = 0.95
): boolean {
  if (!duration || duration <= 0) {
    return false;
  }
  
  const percentage = calculatePlayedPercentage(currentTime, duration);
  return percentage >= threshold * 100;
}
```

### Step 6: Create Performance-Focused Tests

**File**: `/src/utils/video/progress.test.ts`  

```typescript
import { calculatePlayedPercentage, formatVideoTime, isVideoComplete } from './progress';

describe('Video Progress Utils', () => {
  describe('calculatePlayedPercentage', () => {
    it('should calculate percentage correctly', () => {
      expect(calculatePlayedPercentage(30, 100)).toBe(30);
      expect(calculatePlayedPercentage(0, 100)).toBe(0);
      expect(calculatePlayedPercentage(100, 100)).toBe(100);
    });
    
    it('should handle edge cases', () => {
      expect(calculatePlayedPercentage(10, 0)).toBe(0);
      expect(calculatePlayedPercentage(-5, 100)).toBe(0);
      expect(calculatePlayedPercentage(150, 100)).toBe(100);
      expect(calculatePlayedPercentage(10, Infinity)).toBe(0);
      expect(calculatePlayedPercentage(NaN, 100)).toBe(0);
    });
    
    it('should complete within 1ms', () => {
      const start = performance.now();
      for (let i = 0; i < 1000; i++) {
        calculatePlayedPercentage(i, 1000);
      }
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(1);
    });
  });
  
  describe('formatVideoTime', () => {
    it('should format time without hours', () => {
      expect(formatVideoTime(0)).toBe('0:00');
      expect(formatVideoTime(59)).toBe('0:59');
      expect(formatVideoTime(60)).toBe('1:00');
      expect(formatVideoTime(125)).toBe('2:05');
    });
    
    it('should format time with hours', () => {
      expect(formatVideoTime(3600)).toBe('1:00:00');
      expect(formatVideoTime(3665)).toBe('1:01:05');
      expect(formatVideoTime(7325)).toBe('2:02:05');
    });
    
    it('should handle invalid inputs', () => {
      expect(formatVideoTime(-10)).toBe('0:00');
      expect(formatVideoTime(NaN)).toBe('0:00');
      expect(formatVideoTime(Infinity)).toBe('0:00');
    });
  });
  
  describe('isVideoComplete', () => {
    it('should use 95% threshold by default', () => {
      expect(isVideoComplete(94, 100)).toBe(false);
      expect(isVideoComplete(95, 100)).toBe(true);
      expect(isVideoComplete(100, 100)).toBe(true);
    });
    
    it('should accept custom threshold', () => {
      expect(isVideoComplete(80, 100, 0.8)).toBe(true);
      expect(isVideoComplete(79, 100, 0.8)).toBe(false);
    });
    
    it('should handle edge cases', () => {
      expect(isVideoComplete(10, 0)).toBe(false);
      expect(isVideoComplete(0, 100)).toBe(false);
    });
  });
});
```

### Step 7: Update VideoPlayer Component

**Actions**:
1. Import the new utilities
2. Replace inline calculations
3. Remove old calculation code
4. Verify behavior unchanged

**Example refactor**:
```typescript
// Before (in VideoPlayer.tsx)
const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
  const video = e.currentTarget;
  const percentage = (video.currentTime / video.duration) * 100;
  const formatted = /* inline formatting logic */;
  
  setProgress(percentage);
  setTimeDisplay(formatted);
  
  if (percentage >= 95) {
    markAsComplete();
  }
};

// After
import { calculatePlayedPercentage, formatVideoTime, isVideoComplete } from '@/utils/video/progress';

const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
  const video = e.currentTarget;
  const percentage = calculatePlayedPercentage(video.currentTime, video.duration);
  const formatted = formatVideoTime(video.currentTime);
  
  setProgress(percentage);
  setTimeDisplay(formatted);
  
  if (isVideoComplete(video.currentTime, video.duration)) {
    markAsComplete();
  }
};
```

### Step 8: Comprehensive Testing

Run these test suites:
```bash
# New utility tests
npm test -- src/utils/video/progress.test.ts

# VideoPlayer component tests
npm test -- VideoPlayer

# Integration tests that use video
npm test -- --grep "video"

# Check for visual regressions
npm run storybook # If applicable
```

## Rollback Plan

If issues occur:

1. **Quick revert**: 
   ```bash
   git checkout -- src/components/VideoPlayer/VideoPlayer.tsx
   ```

2. **Debugging approach**:
   - Check browser console for errors
   - Compare old vs new time formatting output
   - Verify percentage calculations match exactly
   - Test with various video durations

3. **Gradual rollback**:
   - Keep utility file but revert one function at a time
   - Add console.log comparisons temporarily
   - Test with production video samples

## Success Verification

- [ ] All VideoPlayer tests pass unchanged
- [ ] Video progress bar behavior identical
- [ ] Time display format unchanged
- [ ] 95% completion rule still triggers
- [ ] Performance benchmarks <1ms
- [ ] No console errors during playback
- [ ] Seeking/scrubbing still works correctly

## Additional Considerations

### Mathematical Precision
- Video times may have floating point precision issues
- Consider rounding for display vs calculations
- Test with very long videos (>1 hour)

### Browser Compatibility
- Different browsers may report duration differently
- Handle videos still loading (duration = NaN initially)
- Test with various video formats

### Future Enhancements
- Add utilities for playback speed calculations
- Consider buffered range calculations
- Add chapter/segment progress tracking

## Pattern Application

This extraction demonstrates:
1. **Mathematical purity**: All calculations are deterministic
2. **Edge case handling**: Defensive programming for media APIs
3. **Performance focus**: Sub-millisecond execution
4. **Business rule preservation**: 95% threshold maintained

Apply similar approach to:
- Audio player components
- Progress bars in lessons
- Download progress indicators
- Any time-based calculations