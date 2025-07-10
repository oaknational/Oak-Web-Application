# Pattern Template: Hook Testing

**Purpose**: Comprehensive testing approach for custom React hooks  
**Applies To**: All custom hooks, especially those with complex state  
**Complexity**: Medium  
**Test Impact**: Critical - ensures hook reliability and prevents regressions

## When to Apply This Pattern

Use this pattern for:
- Custom hooks with internal state management
- Hooks that make API calls or have side effects
- Hooks with complex logic or multiple return values
- Any hook used across multiple components

## Standard Hook Test Structure

### 1. Basic Setup Template

```typescript
import { renderHook, act, waitFor } from '@testing-library/react';
import { useCustomHook } from '../useCustomHook';

// Mock external dependencies
jest.mock('@/api/client');
jest.mock('@/hooks/useAuth');

describe('useCustomHook', () => {
  // Setup common mocks
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset any module state
  });
  
  // Wrapper for providers
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
});
```

### 2. Test Initial State

```typescript
it('should initialize with default values', () => {
  const { result } = renderHook(() => useCustomHook(), { wrapper });
  
  expect(result.current.data).toBeNull();
  expect(result.current.loading).toBe(false);
  expect(result.current.error).toBeNull();
});
```

### 3. Test State Changes

```typescript
it('should update state when action is triggered', async () => {
  const { result } = renderHook(() => useCustomHook(), { wrapper });
  
  // Trigger state change
  await act(async () => {
    result.current.fetchData('test-id');
  });
  
  // Verify loading state
  expect(result.current.loading).toBe(true);
  
  // Wait for async completion
  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });
  
  // Verify final state
  expect(result.current.data).toEqual(expectedData);
});
```

### 4. Test Error Cases

```typescript
it('should handle errors gracefully', async () => {
  // Mock API to reject
  mockApiCall.mockRejectedValueOnce(new Error('Network error'));
  
  const { result } = renderHook(() => useCustomHook(), { wrapper });
  
  await act(async () => {
    result.current.fetchData('test-id');
  });
  
  await waitFor(() => {
    expect(result.current.error).toEqual('Network error');
    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
  });
});
```

### 5. Test Cleanup

```typescript
it('should cleanup on unmount', () => {
  const { result, unmount } = renderHook(() => useCustomHook(), { wrapper });
  
  // Setup subscriptions or timers
  act(() => {
    result.current.startPolling();
  });
  
  // Unmount
  unmount();
  
  // Verify cleanup
  expect(clearInterval).toHaveBeenCalled();
  expect(mockSubscription.unsubscribe).toHaveBeenCalled();
});
```

## Testing Complex Hooks

### Hooks with Multiple States

```typescript
describe('useComplexStatefulHook', () => {
  it('should manage multiple state transitions', async () => {
    const { result } = renderHook(() => useComplexHook());
    
    // Initial state
    expect(result.current.step).toBe('initial');
    
    // First transition
    await act(async () => {
      result.current.startProcess();
    });
    expect(result.current.step).toBe('processing');
    
    // Complete process
    await act(async () => {
      result.current.completeStep();
    });
    expect(result.current.step).toBe('complete');
    
    // Verify state consistency
    expect(result.current.history).toEqual(['initial', 'processing', 'complete']);
  });
});
```

### Hooks with Optimistic Updates

```typescript
it('should handle optimistic updates and rollback on error', async () => {
  const { result } = renderHook(() => useOptimisticHook());
  
  // Mock API to fail
  mockUpdateApi.mockRejectedValueOnce(new Error('Update failed'));
  
  const originalData = result.current.data;
  
  // Trigger optimistic update
  await act(async () => {
    result.current.updateItem({ id: 1, name: 'Updated' });
  });
  
  // Verify immediate update
  expect(result.current.data).toContainEqual({ id: 1, name: 'Updated' });
  
  // Wait for rollback
  await waitFor(() => {
    expect(result.current.data).toEqual(originalData);
    expect(result.current.error).toBe('Update failed');
  });
});
```

### Hooks with External Dependencies

```typescript
it('should integrate with external hooks', async () => {
  // Mock external hook
  const mockAuth = {
    user: { id: 'user-123', role: 'teacher' },
    isAuthenticated: true,
  };
  
  (useAuth as jest.Mock).mockReturnValue(mockAuth);
  
  const { result } = renderHook(() => useTeacherFeature());
  
  // Verify hook uses auth context
  expect(result.current.canEdit).toBe(true);
  
  // Change auth state
  (useAuth as jest.Mock).mockReturnValue({
    ...mockAuth,
    user: { ...mockAuth.user, role: 'student' },
  });
  
  const { result: rerenderedResult } = renderHook(() => useTeacherFeature());
  expect(rerenderedResult.current.canEdit).toBe(false);
});
```

## Performance Testing for Hooks

```typescript
it('should maintain performance standards', async () => {
  const { result } = renderHook(() => useDataProcessing());
  
  const startTime = performance.now();
  
  await act(async () => {
    result.current.processLargeDataset(mockLargeData);
  });
  
  const duration = performance.now() - startTime;
  
  // Hook operations should be fast
  expect(duration).toBeLessThan(100); // 100ms threshold
  
  // Verify memoization works
  const memoStart = performance.now();
  await act(async () => {
    result.current.processLargeDataset(mockLargeData); // Same data
  });
  const memoDuration = performance.now() - memoStart;
  
  expect(memoDuration).toBeLessThan(10); // Should be much faster
});
```

## Common Patterns & Best Practices

### 1. Test Hook Parameters

```typescript
it('should handle different parameters', () => {
  // Test with default params
  const { result: defaultResult } = renderHook(() => useCustomHook());
  expect(defaultResult.current.pageSize).toBe(10);
  
  // Test with custom params
  const { result: customResult } = renderHook(() => 
    useCustomHook({ pageSize: 20 })
  );
  expect(customResult.current.pageSize).toBe(20);
});
```

### 2. Test Re-renders

```typescript
it('should handle prop changes', () => {
  const { result, rerender } = renderHook(
    ({ userId }) => useUserData(userId),
    { initialProps: { userId: 'user-1' } }
  );
  
  expect(result.current.userId).toBe('user-1');
  
  // Change props
  rerender({ userId: 'user-2' });
  
  expect(result.current.userId).toBe('user-2');
  expect(mockFetchUser).toHaveBeenCalledWith('user-2');
});
```

### 3. Test Race Conditions

```typescript
it('should handle rapid updates correctly', async () => {
  const { result } = renderHook(() => useDebounced());
  
  // Trigger multiple rapid updates
  act(() => {
    result.current.updateValue('a');
    result.current.updateValue('ab');
    result.current.updateValue('abc');
  });
  
  // Only last value should be processed
  await waitFor(() => {
    expect(result.current.processedValue).toBe('abc');
    expect(mockProcess).toHaveBeenCalledTimes(1);
  });
});
```

## Anti-Patterns to Avoid

❌ **Don't test implementation details**
```typescript
// Bad - testing internal state variable names
expect(result.current._internalState).toBe('something');
```

❌ **Don't forget act() for state updates**
```typescript
// Bad - will cause warnings
result.current.updateState('new value');

// Good
act(() => {
  result.current.updateState('new value');
});
```

❌ **Don't ignore cleanup**
```typescript
// Bad - may cause memory leaks in tests
const { result } = renderHook(() => useInterval());

// Good
const { result, unmount } = renderHook(() => useInterval());
// ... tests ...
unmount();
```

## Success Checklist

- [ ] Initial state tested
- [ ] All state transitions tested
- [ ] Error cases handled
- [ ] Loading states verified
- [ ] Cleanup/unmount tested
- [ ] Performance benchmarks met
- [ ] Re-render behavior correct
- [ ] External dependencies mocked
- [ ] Race conditions handled
- [ ] 100% line coverage achieved

## Related Patterns

- Mock Factory Pattern (for test data)
- Pure Function Extraction (for testable logic)
- Performance Benchmarking Pattern