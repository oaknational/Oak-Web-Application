# Implementation Guide: SI-002 - Test useShareExperiment Hook

**Strategic Investment ID**: SI-002  
**Title**: Test useShareExperiment Hook  
**Assignee**: Human  
**Complexity**: High  
**Expected Outcome**: 100% coverage of complex collaborative feature hook

## Pre-Implementation Checklist

- [ ] Locate useShareExperiment hook implementation
- [ ] Map all state transitions
- [ ] Identify external dependencies
- [ ] Document share flow states
- [ ] Plan test scenarios

## Implementation Steps

### Step 1: Analyze Hook Structure

**Locate and understand the hook**:
```bash
# Find the hook
find src -name "*useShareExperiment*" -type f

# Check hook dependencies
grep -A 10 -B 5 "useShareExperiment" src/hooks/*.ts

# Look for usage patterns
grep -r "useShareExperiment" src/components --include="*.tsx"
```

**Expected hook structure**:
- WebSocket/real-time connection
- Multiple user states
- Conflict resolution
- Optimistic updates
- Error recovery

### Step 2: Map State Transitions

**Document all possible states**:
```typescript
// Expected states in useShareExperiment
interface ShareState {
  status: 'idle' | 'connecting' | 'connected' | 'syncing' | 'error';
  participants: Participant[];
  document: SharedDocument;
  localChanges: Change[];
  conflicts: Conflict[];
  lastSyncedAt: Date | null;
}

// State transitions to test
const stateTransitions = {
  'idle → connecting': 'User initiates share',
  'connecting → connected': 'WebSocket established',
  'connected → syncing': 'Changes detected',
  'syncing → connected': 'Sync complete',
  '* → error': 'Connection lost or sync failed',
  'error → connecting': 'Retry attempt',
};
```

### Step 3: Create Test Infrastructure

**File**: `/src/hooks/__tests__/useShareExperiment.test.tsx`

```typescript
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useShareExperiment } from '../useShareExperiment';
import { createMockWebSocket } from '@/test-utils/mocks';
import type { ShareConfig, Participant } from '@/types/share';

// Mock WebSocket
jest.mock('@/utils/websocket', () => ({
  createWebSocket: jest.fn(),
}));

// Test wrapper with providers
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

// Mock WebSocket factory
function setupMockWebSocket() {
  const mockWs = createMockWebSocket();
  const { createWebSocket } = require('@/utils/websocket');
  createWebSocket.mockReturnValue(mockWs);
  return mockWs;
}

// Helper to wait for specific state
async function waitForState(
  result: any,
  predicate: (state: any) => boolean,
  timeout = 5000
) {
  await waitFor(
    () => {
      expect(predicate(result.current)).toBe(true);
    },
    { timeout }
  );
}
```

### Step 4: Test Initial State and Connection

```typescript
describe('useShareExperiment', () => {
  let mockWs: ReturnType<typeof createMockWebSocket>;
  
  beforeEach(() => {
    mockWs = setupMockWebSocket();
    jest.clearAllMocks();
  });
  
  afterEach(() => {
    mockWs.close();
  });

  describe('Initial state and connection', () => {
    it('should initialize with idle state', () => {
      const { result } = renderHook(
        () => useShareExperiment({ documentId: 'doc-123' }),
        { wrapper: createWrapper() }
      );

      expect(result.current.status).toBe('idle');
      expect(result.current.participants).toEqual([]);
      expect(result.current.isConnected).toBe(false);
    });

    it('should connect when startSharing is called', async () => {
      const { result } = renderHook(
        () => useShareExperiment({ documentId: 'doc-123' }),
        { wrapper: createWrapper() }
      );

      expect(result.current.status).toBe('idle');

      await act(async () => {
        result.current.startSharing();
      });

      expect(result.current.status).toBe('connecting');

      // Simulate successful connection
      act(() => {
        mockWs.simulateOpen();
      });

      await waitForState(result, (state) => state.status === 'connected');
      expect(result.current.isConnected).toBe(true);
    });

    it('should handle connection errors', async () => {
      const { result } = renderHook(
        () => useShareExperiment({ documentId: 'doc-123' }),
        { wrapper: createWrapper() }
      );

      await act(async () => {
        result.current.startSharing();
      });

      // Simulate connection error
      act(() => {
        mockWs.simulateError(new Error('Connection failed'));
      });

      await waitForState(result, (state) => state.status === 'error');
      expect(result.current.error).toMatchObject({
        message: 'Connection failed',
      });
    });

    it('should cleanup on unmount', async () => {
      const { result, unmount } = renderHook(
        () => useShareExperiment({ documentId: 'doc-123' }),
        { wrapper: createWrapper() }
      );

      await act(async () => {
        result.current.startSharing();
      });

      act(() => {
        mockWs.simulateOpen();
      });

      await waitForState(result, (state) => state.isConnected);

      unmount();

      expect(mockWs.close).toHaveBeenCalled();
    });
  });
});
```

### Step 5: Test Participant Management

```typescript
describe('Participant management', () => {
  it('should update participants when users join', async () => {
    const { result } = renderHook(
      () => useShareExperiment({ documentId: 'doc-123' }),
      { wrapper: createWrapper() }
    );

    await act(async () => {
      result.current.startSharing();
    });

    act(() => {
      mockWs.simulateOpen();
    });

    await waitForState(result, (state) => state.isConnected);

    const newParticipant: Participant = {
      id: 'user-456',
      name: 'Jane Doe',
      color: '#FF5733',
      cursor: { x: 0, y: 0 },
      isActive: true,
    };

    // Simulate participant joining
    act(() => {
      mockWs.simulateMessage({
        type: 'participant_joined',
        participant: newParticipant,
      });
    });

    await waitFor(() => {
      expect(result.current.participants).toHaveLength(1);
      expect(result.current.participants[0]).toMatchObject(newParticipant);
    });
  });

  it('should remove participants when users leave', async () => {
    const { result } = renderHook(
      () => useShareExperiment({ documentId: 'doc-123' }),
      { wrapper: createWrapper() }
    );

    // Setup: Add participant first
    await act(async () => {
      result.current.startSharing();
    });

    act(() => {
      mockWs.simulateOpen();
      mockWs.simulateMessage({
        type: 'participant_joined',
        participant: { id: 'user-456', name: 'Jane' },
      });
    });

    await waitFor(() => {
      expect(result.current.participants).toHaveLength(1);
    });

    // Test: Remove participant
    act(() => {
      mockWs.simulateMessage({
        type: 'participant_left',
        participantId: 'user-456',
      });
    });

    await waitFor(() => {
      expect(result.current.participants).toHaveLength(0);
    });
  });

  it('should handle participant cursor updates', async () => {
    const { result } = renderHook(
      () => useShareExperiment({ documentId: 'doc-123' }),
      { wrapper: createWrapper() }
    );

    // Setup connection and participant
    await act(async () => {
      result.current.startSharing();
    });

    act(() => {
      mockWs.simulateOpen();
      mockWs.simulateMessage({
        type: 'participant_joined',
        participant: { id: 'user-456', cursor: { x: 0, y: 0 } },
      });
    });

    // Update cursor position
    act(() => {
      mockWs.simulateMessage({
        type: 'cursor_update',
        participantId: 'user-456',
        cursor: { x: 100, y: 200 },
      });
    });

    await waitFor(() => {
      const participant = result.current.participants.find(
        (p) => p.id === 'user-456'
      );
      expect(participant?.cursor).toEqual({ x: 100, y: 200 });
    });
  });
});
```

### Step 6: Test Document Synchronization

```typescript
describe('Document synchronization', () => {
  it('should handle local changes optimistically', async () => {
    const { result } = renderHook(
      () => useShareExperiment({ documentId: 'doc-123' }),
      { wrapper: createWrapper() }
    );

    await act(async () => {
      result.current.startSharing();
    });

    act(() => {
      mockWs.simulateOpen();
    });

    const change = {
      id: 'change-1',
      type: 'insert',
      position: 10,
      content: 'Hello',
    };

    // Make local change
    await act(async () => {
      result.current.makeChange(change);
    });

    // Optimistic update should apply immediately
    expect(result.current.document.content).toContain('Hello');
    expect(result.current.localChanges).toContainEqual(
      expect.objectContaining({ id: 'change-1' })
    );

    // Simulate server acknowledgment
    act(() => {
      mockWs.simulateMessage({
        type: 'change_acknowledged',
        changeId: 'change-1',
      });
    });

    await waitFor(() => {
      expect(result.current.localChanges).toHaveLength(0);
    });
  });

  it('should handle remote changes', async () => {
    const { result } = renderHook(
      () => useShareExperiment({ documentId: 'doc-123' }),
      { wrapper: createWrapper() }
    );

    await act(async () => {
      result.current.startSharing();
    });

    act(() => {
      mockWs.simulateOpen();
    });

    // Simulate remote change
    act(() => {
      mockWs.simulateMessage({
        type: 'remote_change',
        change: {
          id: 'remote-1',
          authorId: 'user-789',
          type: 'insert',
          position: 0,
          content: 'Remote: ',
        },
      });
    });

    await waitFor(() => {
      expect(result.current.document.content).toContain('Remote: ');
    });
  });

  it('should handle conflict resolution', async () => {
    const { result } = renderHook(
      () => useShareExperiment({ documentId: 'doc-123' }),
      { wrapper: createWrapper() }
    );

    await act(async () => {
      result.current.startSharing();
    });

    act(() => {
      mockWs.simulateOpen();
    });

    // Make local change
    await act(async () => {
      result.current.makeChange({
        id: 'local-1',
        type: 'insert',
        position: 0,
        content: 'Local',
      });
    });

    // Simulate conflicting remote change
    act(() => {
      mockWs.simulateMessage({
        type: 'conflict_detected',
        conflict: {
          localChange: { id: 'local-1' },
          remoteChange: { id: 'remote-1' },
          resolution: 'remote_wins',
        },
      });
    });

    await waitFor(() => {
      expect(result.current.conflicts).toHaveLength(1);
    });

    // Resolve conflict
    await act(async () => {
      result.current.resolveConflict(result.current.conflicts[0].id, 'local');
    });

    expect(result.current.conflicts).toHaveLength(0);
  });
});
```

### Step 7: Test Error Handling and Recovery

```typescript
describe('Error handling and recovery', () => {
  it('should handle connection loss and reconnect', async () => {
    const { result } = renderHook(
      () => useShareExperiment({ 
        documentId: 'doc-123',
        reconnectAttempts: 3,
        reconnectDelay: 100,
      }),
      { wrapper: createWrapper() }
    );

    // Initial connection
    await act(async () => {
      result.current.startSharing();
    });

    act(() => {
      mockWs.simulateOpen();
    });

    await waitForState(result, (state) => state.isConnected);

    // Simulate connection loss
    act(() => {
      mockWs.simulateClose({ code: 1006, reason: 'Abnormal closure' });
    });

    await waitForState(result, (state) => state.status === 'connecting');
    expect(result.current.reconnectAttempt).toBe(1);

    // Simulate successful reconnection
    act(() => {
      mockWs.simulateOpen();
    });

    await waitForState(result, (state) => state.isConnected);
    expect(result.current.reconnectAttempt).toBe(0);
  });

  it('should give up after max reconnect attempts', async () => {
    const { result } = renderHook(
      () => useShareExperiment({ 
        documentId: 'doc-123',
        reconnectAttempts: 2,
        reconnectDelay: 50,
      }),
      { wrapper: createWrapper() }
    );

    await act(async () => {
      result.current.startSharing();
    });

    // Simulate repeated connection failures
    for (let i = 0; i < 3; i++) {
      act(() => {
        mockWs.simulateError(new Error('Connection failed'));
      });
      
      if (i < 2) {
        await waitFor(() => {
          expect(result.current.reconnectAttempt).toBe(i + 1);
        });
      }
    }

    await waitForState(result, (state) => state.status === 'error');
    expect(result.current.error?.message).toContain('Max reconnection attempts');
  });

  it('should handle sync errors gracefully', async () => {
    const { result } = renderHook(
      () => useShareExperiment({ documentId: 'doc-123' }),
      { wrapper: createWrapper() }
    );

    await act(async () => {
      result.current.startSharing();
    });

    act(() => {
      mockWs.simulateOpen();
    });

    // Make change that will fail
    await act(async () => {
      result.current.makeChange({
        id: 'change-1',
        type: 'insert',
        position: 10,
        content: 'Will fail',
      });
    });

    // Simulate sync error
    act(() => {
      mockWs.simulateMessage({
        type: 'sync_error',
        changeId: 'change-1',
        error: 'Invalid change position',
      });
    });

    await waitFor(() => {
      // Change should be rolled back
      expect(result.current.document.content).not.toContain('Will fail');
      expect(result.current.lastError).toMatchObject({
        type: 'sync_error',
        message: 'Invalid change position',
      });
    });
  });
});
```

### Step 8: Test Performance

```typescript
describe('Performance', () => {
  it('should handle rapid changes efficiently', async () => {
    const { result } = renderHook(
      () => useShareExperiment({ documentId: 'doc-123' }),
      { wrapper: createWrapper() }
    );

    await act(async () => {
      result.current.startSharing();
    });

    act(() => {
      mockWs.simulateOpen();
    });

    const startTime = performance.now();

    // Make 100 rapid changes
    await act(async () => {
      for (let i = 0; i < 100; i++) {
        result.current.makeChange({
          id: `change-${i}`,
          type: 'insert',
          position: i,
          content: 'x',
        });
      }
    });

    const duration = performance.now() - startTime;
    expect(duration).toBeLessThan(100); // Should handle 100 changes in <100ms

    // All changes should be queued
    expect(result.current.localChanges.length).toBeGreaterThan(0);
  });

  it('should debounce cursor updates', async () => {
    const { result } = renderHook(
      () => useShareExperiment({ 
        documentId: 'doc-123',
        cursorDebounceMs: 50,
      }),
      { wrapper: createWrapper() }
    );

    await act(async () => {
      result.current.startSharing();
    });

    act(() => {
      mockWs.simulateOpen();
    });

    const sendSpy = jest.spyOn(mockWs, 'send');

    // Rapid cursor movements
    for (let i = 0; i < 10; i++) {
      act(() => {
        result.current.updateCursor({ x: i * 10, y: i * 10 });
      });
    }

    // Should not send immediately
    expect(sendSpy).not.toHaveBeenCalled();

    // Wait for debounce
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    // Should send only once
    expect(sendSpy).toHaveBeenCalledTimes(1);
    expect(sendSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'cursor_update',
        cursor: { x: 90, y: 90 },
      })
    );
  });
});
```

## Success Verification

- [ ] All state transitions tested
- [ ] WebSocket communication mocked properly
- [ ] Optimistic updates and rollbacks work
- [ ] Conflict resolution tested
- [ ] Error recovery scenarios covered
- [ ] Performance benchmarks met
- [ ] 100% code coverage achieved

## Common Pitfalls

1. **Async state updates** - Always use `act()` and `waitFor()`
2. **WebSocket timing** - Mock messages may need delays
3. **Memory leaks** - Ensure cleanup in afterEach
4. **Race conditions** - Test rapid state changes
5. **Error boundaries** - Test error propagation

This comprehensive test suite ensures the complex collaborative feature works reliably under all conditions.