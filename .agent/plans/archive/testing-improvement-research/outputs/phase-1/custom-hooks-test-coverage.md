# Custom Hooks Test Coverage Analysis

**Purpose**: Identify custom hooks missing test coverage  
**Finding**: 22 custom hooks lack direct test files ⚠️  
**Impact**: Complex business logic and state management untested  
**Date**: July 9, 2025

## Executive Summary

22 custom hooks have no test files, including 4 critical hooks with 100+ lines of complex logic. This represents a significant testing gap, especially for teacher-facing features like share experiments and curriculum downloads.

## Untested Hooks by Priority

### 🔴 Critical Priority - Complex Hooks (>100 lines)

#### 1. useShareExperiment (179 lines)
**Location**: `src/pages-helpers/teacher/share-experiments/useShareExperiment.ts`  
**Purpose**: Teacher share experiment functionality with analytics  
**Complexity**: High - URL management, analytics, state coordination  
**Risk**: Core teacher feature with no tests

**Testing Needs**:
```typescript
describe('useShareExperiment', () => {
  it('tracks share events correctly', () => {
    const { result } = renderHook(() => useShareExperiment());
    
    act(() => {
      result.current.shareLesson('lesson-123');
    });
    
    expect(mockAnalytics.track).toHaveBeenCalledWith('share_initiated', {
      lessonId: 'lesson-123',
      experiment: expect.any(String),
    });
  });
  
  it('generates correct share URLs', () => {
    // Test URL generation logic
  });
  
  it('handles experiment variations', () => {
    // Test A/B experiment logic
  });
});
```

#### 2. useTeacherNotes (164 lines)
**Location**: `src/pages-helpers/teacher/share-experiments/useTeacherNotes.ts`  
**Purpose**: Teacher notes management with persistence  
**Complexity**: High - State management, storage, analytics  
**Risk**: Data loss potential without proper testing

#### 3. useCurrentSection (145 lines)
**Location**: `src/components/TeacherComponents/helpers/lessonHelpers/useCurrentSection.ts`  
**Purpose**: Lesson section navigation and scroll behavior  
**Complexity**: High - Scroll management, state sync, navigation  
**Risk**: Poor UX if navigation breaks

#### 4. useCurriculumDownloads (141 lines)
**Location**: `src/components/TeacherComponents/CurriculumDownloadBanner/useCurriculumDownloads.tsx`  
**Purpose**: Curriculum download functionality  
**Complexity**: High - API calls, state management, error handling  
**Risk**: Critical teacher feature for resource access

### 🟡 Medium Priority - Integration Hooks (30-100 lines)

#### External Service Hooks
5. **useHubspotCookieContactLookup** (72 lines) - HubSpot integration
6. **useUnitDownloadExistenceCheck** (43 lines) - File existence checking

#### User Interaction Hooks
7. **useClickableCard** (71 lines) - Accessibility-critical interaction
8. **useTeacherShareButton** (35 lines) - Share functionality
9. **useButtonAsLinkProps** (34 lines) - Navigation behavior

#### Analytics Hooks
10. **useTrackSectionStarted** (54 lines) - Section tracking
11. **useGetVideoTrackingData** (25 lines) - Video analytics
12. **useGetQuizTrackingData** (23 lines) - Quiz analytics

#### State Management Hooks
13. **useSelectedArea** (37 lines) - Area selection state
14. **useBioCardListModalDialog** (84 lines) - Modal state

### 🟢 Low Priority - Utility Hooks (<30 lines)

15. **useMediaClipThumbnailsUrl** (27 lines) - URL generation
16. **useMediaQuery** (23 lines) - Responsive design
17. **useCategoryFilterList** (21 lines) - Filter state
18. **useReferrer** (33 lines) - Referrer tracking
19. **useSaveCountContext** (14 lines) - Context consumer
20. **useAnalyticsPageProps** (13 lines) - Props helper
21. **usePostCategoryList** (10 lines) - ID generation
22. **usePrevious** (9 lines) - Previous value tracking

## Patterns and Concerns

### 1. Analytics Hooks Completely Untested
Multiple analytics-related hooks have no tests:
- Video tracking
- Quiz tracking
- Section tracking
- Share experiments

**Risk**: Incorrect analytics data affecting business decisions

### 2. Teacher Feature Hooks Untested
Critical teacher functionality lacks testing:
- Share experiments
- Teacher notes
- Curriculum downloads
- Unit downloads

**Risk**: Core features breaking without detection

### 3. Complex State Management Untested
Hooks managing complex state have no tests:
- Modal dialogs
- Section navigation
- Selected areas

**Risk**: State bugs causing poor UX

## Testing Strategy

### Phase 1: Critical Hooks (Week 1)
Test the 4 complex hooks first:

```typescript
// Example test structure for complex hooks
describe('useCurriculumDownloads', () => {
  const mockQueryClient = createMockQueryClient();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('fetches curriculum data on mount', async () => {
    const { result } = renderHook(
      () => useCurriculumDownloads({ subjectSlug: 'maths' }),
      { wrapper: createWrapper({ queryClient: mockQueryClient }) }
    );
    
    expect(result.current.isLoading).toBe(true);
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(result.current.data).toMatchObject({
      curriculum: expect.any(Object),
    });
  });
  
  it('handles download errors gracefully', async () => {
    // Test error scenarios
  });
  
  it('tracks download events', async () => {
    // Test analytics integration
  });
});
```

### Phase 2: Integration Hooks (Week 2)
Test hooks that integrate with external services:
- HubSpot lookup
- File existence checks
- Analytics tracking

### Phase 3: Utility Hooks (Week 3)
Simple unit tests for utility hooks:
- Previous value tracking
- Media queries
- URL generation

## Recommended Test Patterns

### 1. Complex State Hook Testing
```typescript
const { result } = renderHook(() => useComplexState(), {
  wrapper: ({ children }) => (
    <Providers>{children}</Providers>
  ),
});

// Test initial state
expect(result.current.state).toEqual(initialState);

// Test state updates
act(() => {
  result.current.updateState(newValue);
});

expect(result.current.state).toEqual(expectedState);
```

### 2. Side Effect Hook Testing
```typescript
it('performs side effects correctly', () => {
  const mockEffect = jest.fn();
  
  renderHook(() => useEffectHook(mockEffect));
  
  expect(mockEffect).toHaveBeenCalledTimes(1);
  expect(mockEffect).toHaveBeenCalledWith(expectedArgs);
});
```

### 3. Analytics Hook Testing
```typescript
it('tracks events with correct properties', () => {
  const { result } = renderHook(() => useAnalyticsHook());
  
  act(() => {
    result.current.trackEvent('action_name');
  });
  
  expect(mockAnalytics.track).toHaveBeenCalledWith('action_name', {
    timestamp: expect.any(Number),
    // ... other expected properties
  });
});
```

## Success Metrics

### Coverage Goals
- **Phase 1**: 100% coverage for critical hooks (4 hooks)
- **Phase 2**: 100% coverage for integration hooks (10 hooks)
- **Phase 3**: 80% coverage for utility hooks (8 hooks)

### Quality Goals
- All hooks have clear test names describing behavior
- Complex hooks test edge cases and error scenarios
- Integration hooks mock external dependencies properly

### Timeline
- Week 1: Test 4 critical hooks
- Week 2: Test 10 medium priority hooks
- Week 3: Test 8 low priority hooks

## Next Steps

1. **Create test files** for the 4 critical hooks immediately
2. **Extract testable logic** from complex hooks where possible
3. **Document hook contracts** to clarify testing requirements
4. **Add hooks to CI** test coverage requirements

This analysis reveals a significant gap in custom hook testing that should be addressed to ensure reliability of Oak's interactive features.