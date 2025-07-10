# Implementation Guide: SI-003 - Test useTeacherNotes Hook

**Strategic Investment ID**: SI-003  
**Title**: Test useTeacherNotes Hook  
**Assignee**: Human  
**Complexity**: Medium  
**Expected Outcome**: Complete test coverage for teacher notes functionality with optimistic updates

## Pre-Implementation Checklist

- [ ] Locate useTeacherNotes hook implementation
- [ ] Understand CRUD operations flow
- [ ] Map optimistic update patterns
- [ ] Identify storage layer (API/localStorage)
- [ ] Document error scenarios

## Implementation Steps

### Step 1: Analyze Hook Implementation

**Find and understand the hook**:
```bash
# Locate the hook
find src -name "*useTeacherNotes*" -o -name "*teacher*notes*" | grep -i hook

# Check implementation details
grep -A 20 "useTeacherNotes" src/hooks/*.ts

# Find usage in components
grep -r "useTeacherNotes" src/components --include="*.tsx"
```

**Expected functionality**:
- Create, Read, Update, Delete notes
- Optimistic updates for better UX
- Pagination for large note sets
- Search/filter capabilities
- Auto-save functionality
- Conflict resolution

### Step 2: Create Test Setup

**File**: `/src/hooks/__tests__/useTeacherNotes.test.tsx`

```typescript
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTeacherNotes } from '../useTeacherNotes';
import { createTeacherNote } from '@/test-utils/factories';
import type { TeacherNote, NoteFilter } from '@/types/teacher-notes';

// Mock API
jest.mock('@/api/teacher-notes', () => ({
  teacherNotesApi: {
    getNotes: jest.fn(),
    createNote: jest.fn(),
    updateNote: jest.fn(),
    deleteNote: jest.fn(),
    searchNotes: jest.fn(),
  },
}));

// Test setup
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { 
        retry: false,
        cacheTime: 0,
      },
      mutations: { 
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

// Mock data
const mockNotes: TeacherNote[] = [
  createTeacherNote({ id: '1', title: 'Algebra Tips' }),
  createTeacherNote({ id: '2', title: 'Homework Ideas' }),
  createTeacherNote({ id: '3', title: 'Assessment Guide' }),
];

// Helper to setup API mocks
function setupApiMocks() {
  const { teacherNotesApi } = require('@/api/teacher-notes');
  
  teacherNotesApi.getNotes.mockResolvedValue({
    notes: mockNotes,
    totalCount: mockNotes.length,
    hasMore: false,
  });
  
  teacherNotesApi.createNote.mockImplementation((note) => 
    Promise.resolve({ ...note, id: Date.now().toString() })
  );
  
  teacherNotesApi.updateNote.mockImplementation((id, updates) =>
    Promise.resolve({ ...mockNotes.find(n => n.id === id), ...updates })
  );
  
  teacherNotesApi.deleteNote.mockResolvedValue({ success: true });
  
  return teacherNotesApi;
}
```

### Step 3: Test Initial State and Data Fetching

```typescript
describe('useTeacherNotes', () => {
  let api: ReturnType<typeof setupApiMocks>;
  
  beforeEach(() => {
    api = setupApiMocks();
    jest.clearAllMocks();
  });

  describe('Initial state and fetching', () => {
    it('should initialize with empty state', () => {
      const { result } = renderHook(
        () => useTeacherNotes({ lessonId: 'lesson-123' }),
        { wrapper: createWrapper() }
      );

      expect(result.current.notes).toEqual([]);
      expect(result.current.isLoading).toBe(true);
      expect(result.current.error).toBeNull();
    });

    it('should fetch notes on mount', async () => {
      const { result } = renderHook(
        () => useTeacherNotes({ lessonId: 'lesson-123' }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(api.getNotes).toHaveBeenCalledWith({
        lessonId: 'lesson-123',
        page: 1,
        limit: 20,
      });
      
      expect(result.current.notes).toEqual(mockNotes);
    });

    it('should handle fetch errors', async () => {
      api.getNotes.mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(
        () => useTeacherNotes({ lessonId: 'lesson-123' }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toMatchObject({
        message: 'Network error',
      });
      expect(result.current.notes).toEqual([]);
    });
  });
});
```

### Step 4: Test CRUD Operations

```typescript
describe('CRUD operations', () => {
  describe('Creating notes', () => {
    it('should create note optimistically', async () => {
      const { result } = renderHook(
        () => useTeacherNotes({ lessonId: 'lesson-123' }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const newNote = {
        title: 'New Note',
        content: 'Test content',
        tags: ['algebra', 'tips'],
      };

      await act(async () => {
        result.current.createNote(newNote);
      });

      // Optimistic update - note appears immediately
      expect(result.current.notes).toHaveLength(4);
      expect(result.current.notes[3]).toMatchObject({
        ...newNote,
        status: 'pending',
      });

      // Wait for server response
      await waitFor(() => {
        const createdNote = result.current.notes.find(n => n.title === 'New Note');
        expect(createdNote?.status).toBeUndefined();
        expect(createdNote?.id).toBeDefined();
      });

      expect(api.createNote).toHaveBeenCalledWith({
        ...newNote,
        lessonId: 'lesson-123',
      });
    });

    it('should rollback on create failure', async () => {
      api.createNote.mockRejectedValueOnce(new Error('Create failed'));

      const { result } = renderHook(
        () => useTeacherNotes({ lessonId: 'lesson-123' }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const initialLength = result.current.notes.length;

      await act(async () => {
        result.current.createNote({ title: 'Will fail' });
      });

      // Optimistic add
      expect(result.current.notes).toHaveLength(initialLength + 1);

      // Wait for rollback
      await waitFor(() => {
        expect(result.current.notes).toHaveLength(initialLength);
        expect(result.current.lastError).toMatchObject({
          operation: 'create',
          message: 'Create failed',
        });
      });
    });
  });

  describe('Updating notes', () => {
    it('should update note optimistically', async () => {
      const { result } = renderHook(
        () => useTeacherNotes({ lessonId: 'lesson-123' }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const noteToUpdate = result.current.notes[0];
      const updates = { title: 'Updated Title' };

      await act(async () => {
        result.current.updateNote(noteToUpdate.id, updates);
      });

      // Optimistic update
      expect(result.current.notes[0]).toMatchObject({
        ...noteToUpdate,
        ...updates,
        status: 'updating',
      });

      // Wait for server confirmation
      await waitFor(() => {
        expect(result.current.notes[0].status).toBeUndefined();
      });

      expect(api.updateNote).toHaveBeenCalledWith(noteToUpdate.id, updates);
    });

    it('should handle update conflicts', async () => {
      api.updateNote.mockRejectedValueOnce({
        code: 'CONFLICT',
        message: 'Note was modified',
        serverVersion: createTeacherNote({
          id: '1',
          title: 'Server Title',
          updatedAt: new Date(),
        }),
      });

      const { result } = renderHook(
        () => useTeacherNotes({ lessonId: 'lesson-123' }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        result.current.updateNote('1', { title: 'Local Title' });
      });

      await waitFor(() => {
        expect(result.current.conflicts).toHaveLength(1);
        expect(result.current.conflicts[0]).toMatchObject({
          noteId: '1',
          localVersion: expect.objectContaining({ title: 'Local Title' }),
          serverVersion: expect.objectContaining({ title: 'Server Title' }),
        });
      });
    });
  });

  describe('Deleting notes', () => {
    it('should delete note optimistically', async () => {
      const { result } = renderHook(
        () => useTeacherNotes({ lessonId: 'lesson-123' }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const noteToDelete = result.current.notes[0];
      const initialLength = result.current.notes.length;

      await act(async () => {
        result.current.deleteNote(noteToDelete.id);
      });

      // Optimistic delete
      expect(result.current.notes).toHaveLength(initialLength - 1);
      expect(result.current.notes.find(n => n.id === noteToDelete.id)).toBeUndefined();

      await waitFor(() => {
        expect(api.deleteNote).toHaveBeenCalledWith(noteToDelete.id);
      });
    });

    it('should restore on delete failure', async () => {
      api.deleteNote.mockRejectedValueOnce(new Error('Delete failed'));

      const { result } = renderHook(
        () => useTeacherNotes({ lessonId: 'lesson-123' }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const noteToDelete = result.current.notes[0];
      const initialNotes = [...result.current.notes];

      await act(async () => {
        result.current.deleteNote(noteToDelete.id);
      });

      // Optimistic delete
      expect(result.current.notes.find(n => n.id === noteToDelete.id)).toBeUndefined();

      // Wait for restore
      await waitFor(() => {
        expect(result.current.notes).toEqual(initialNotes);
        expect(result.current.lastError).toMatchObject({
          operation: 'delete',
          message: 'Delete failed',
        });
      });
    });
  });
});
```

### Step 5: Test Search and Filtering

```typescript
describe('Search and filtering', () => {
  it('should search notes', async () => {
    api.searchNotes.mockResolvedValueOnce({
      notes: [mockNotes[0]], // Only Algebra Tips matches
      totalCount: 1,
    });

    const { result } = renderHook(
      () => useTeacherNotes({ lessonId: 'lesson-123' }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      result.current.searchNotes('algebra');
    });

    expect(result.current.isSearching).toBe(true);

    await waitFor(() => {
      expect(result.current.isSearching).toBe(false);
    });

    expect(api.searchNotes).toHaveBeenCalledWith({
      lessonId: 'lesson-123',
      query: 'algebra',
      page: 1,
      limit: 20,
    });

    expect(result.current.notes).toHaveLength(1);
    expect(result.current.notes[0].title).toBe('Algebra Tips');
  });

  it('should filter notes by tags', async () => {
    const { result } = renderHook(
      () => useTeacherNotes({ lessonId: 'lesson-123' }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      result.current.setFilter({ tags: ['homework'] });
    });

    await waitFor(() => {
      expect(api.getNotes).toHaveBeenLastCalledWith({
        lessonId: 'lesson-123',
        page: 1,
        limit: 20,
        tags: ['homework'],
      });
    });
  });

  it('should debounce search input', async () => {
    jest.useFakeTimers();

    const { result } = renderHook(
      () => useTeacherNotes({ 
        lessonId: 'lesson-123',
        searchDebounceMs: 300,
      }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Multiple rapid searches
    act(() => {
      result.current.searchNotes('a');
      result.current.searchNotes('al');
      result.current.searchNotes('alg');
      result.current.searchNotes('algebra');
    });

    // Should not search immediately
    expect(api.searchNotes).not.toHaveBeenCalled();

    // Fast forward debounce time
    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(api.searchNotes).toHaveBeenCalledTimes(1);
      expect(api.searchNotes).toHaveBeenCalledWith(
        expect.objectContaining({ query: 'algebra' })
      );
    });

    jest.useRealTimers();
  });
});
```

### Step 6: Test Pagination

```typescript
describe('Pagination', () => {
  it('should load more notes', async () => {
    api.getNotes
      .mockResolvedValueOnce({
        notes: mockNotes.slice(0, 2),
        totalCount: 5,
        hasMore: true,
      })
      .mockResolvedValueOnce({
        notes: mockNotes.slice(2, 3),
        totalCount: 5,
        hasMore: true,
      });

    const { result } = renderHook(
      () => useTeacherNotes({ 
        lessonId: 'lesson-123',
        pageSize: 2,
      }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.notes).toHaveLength(2);
    expect(result.current.hasMore).toBe(true);

    await act(async () => {
      result.current.loadMore();
    });

    expect(result.current.isLoadingMore).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoadingMore).toBe(false);
    });

    expect(result.current.notes).toHaveLength(3);
    expect(api.getNotes).toHaveBeenCalledTimes(2);
    expect(api.getNotes).toHaveBeenLastCalledWith({
      lessonId: 'lesson-123',
      page: 2,
      limit: 2,
    });
  });

  it('should handle pagination during search', async () => {
    const { result } = renderHook(
      () => useTeacherNotes({ lessonId: 'lesson-123' }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Search with pagination
    await act(async () => {
      result.current.searchNotes('test');
    });

    await waitFor(() => {
      expect(result.current.isSearching).toBe(false);
    });

    // Load more search results
    await act(async () => {
      result.current.loadMore();
    });

    expect(api.searchNotes).toHaveBeenLastCalledWith({
      lessonId: 'lesson-123',
      query: 'test',
      page: 2,
      limit: 20,
    });
  });
});
```

### Step 7: Test Auto-save Functionality

```typescript
describe('Auto-save functionality', () => {
  it('should auto-save draft changes', async () => {
    jest.useFakeTimers();

    const { result } = renderHook(
      () => useTeacherNotes({ 
        lessonId: 'lesson-123',
        autoSaveEnabled: true,
        autoSaveDelayMs: 2000,
      }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const note = result.current.notes[0];

    // Start editing
    act(() => {
      result.current.startEditing(note.id);
      result.current.updateDraft(note.id, { content: 'Draft content' });
    });

    expect(result.current.drafts[note.id]).toMatchObject({
      content: 'Draft content',
      isDirty: true,
    });

    // Auto-save shouldn't trigger immediately
    expect(api.updateNote).not.toHaveBeenCalled();

    // Fast forward auto-save delay
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(api.updateNote).toHaveBeenCalledWith(note.id, {
        content: 'Draft content',
      });
    });

    expect(result.current.drafts[note.id]).toBeUndefined();

    jest.useRealTimers();
  });

  it('should handle auto-save conflicts', async () => {
    const { result } = renderHook(
      () => useTeacherNotes({ 
        lessonId: 'lesson-123',
        autoSaveEnabled: true,
      }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Simulate another user updating the same note
    api.updateNote.mockRejectedValueOnce({
      code: 'CONFLICT',
      serverVersion: createTeacherNote({
        id: '1',
        content: 'Server content',
        updatedAt: new Date(),
      }),
    });

    const note = result.current.notes[0];

    act(() => {
      result.current.startEditing(note.id);
      result.current.updateDraft(note.id, { content: 'Local content' });
    });

    // Trigger auto-save
    await act(async () => {
      await result.current.saveDraft(note.id);
    });

    expect(result.current.conflicts).toHaveLength(1);
    expect(result.current.conflicts[0]).toMatchObject({
      noteId: note.id,
      type: 'auto-save',
      canMerge: true,
    });
  });
});
```

### Step 8: Test Performance

```typescript
describe('Performance', () => {
  it('should handle large note collections efficiently', async () => {
    const largeNoteSet = Array.from({ length: 100 }, (_, i) => 
      createTeacherNote({ id: `note-${i}`, title: `Note ${i}` })
    );

    api.getNotes.mockResolvedValueOnce({
      notes: largeNoteSet,
      totalCount: 100,
      hasMore: false,
    });

    const startTime = performance.now();

    const { result } = renderHook(
      () => useTeacherNotes({ lessonId: 'lesson-123' }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const loadTime = performance.now() - startTime;
    expect(loadTime).toBeLessThan(500); // Should load 100 notes in <500ms

    // Test filtering performance
    const filterStart = performance.now();
    
    act(() => {
      result.current.setFilter({ tags: ['important'] });
    });

    const filterTime = performance.now() - filterStart;
    expect(filterTime).toBeLessThan(50); // Filtering should be <50ms
  });

  it('should batch multiple updates efficiently', async () => {
    const { result } = renderHook(
      () => useTeacherNotes({ lessonId: 'lesson-123' }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Make multiple rapid updates
    await act(async () => {
      result.current.batchUpdate([
        { id: '1', updates: { title: 'Updated 1' } },
        { id: '2', updates: { title: 'Updated 2' } },
        { id: '3', updates: { title: 'Updated 3' } },
      ]);
    });

    // Should batch into single API call
    expect(api.updateNote).not.toHaveBeenCalled();
    expect(api.batchUpdate).toHaveBeenCalledTimes(1);
    expect(api.batchUpdate).toHaveBeenCalledWith([
      { id: '1', updates: { title: 'Updated 1' } },
      { id: '2', updates: { title: 'Updated 2' } },
      { id: '3', updates: { title: 'Updated 3' } },
    ]);
  });
});
```

## Success Verification

- [ ] All CRUD operations tested with optimistic updates
- [ ] Conflict resolution scenarios covered
- [ ] Pagination and search functionality tested
- [ ] Auto-save with conflict handling implemented
- [ ] Performance benchmarks met
- [ ] Error recovery tested
- [ ] 100% code coverage achieved

## Additional Considerations

### Edge Cases to Test
- Network failures during optimistic updates
- Simultaneous edits by multiple users
- Large text content handling
- Special characters in search
- Rapid create/delete cycles

### Performance Targets
- Initial load: <200ms for 20 notes
- Search response: <100ms
- Optimistic update: <10ms
- Auto-save trigger: <50ms

This comprehensive test suite ensures the teacher notes functionality is robust, performant, and provides excellent user experience even in error scenarios.