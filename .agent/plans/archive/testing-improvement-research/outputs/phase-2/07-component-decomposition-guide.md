# Component Decomposition Guide

**Phase**: 2.2 - Architecture Planning  
**Type**: Planning Document  
**Purpose**: Strategies for breaking down large components into testable, maintainable pieces

## Executive Summary

Large components are a major barrier to testing. This guide provides practical strategies for decomposing components like SubjectPhasePicker (1,468 lines) into smaller, testable units while maintaining functionality and performance.

## Current State Analysis

### Problem Components (from Phase 1.2)

1. **SubjectPhasePicker.tsx** - 1,468 lines
   - Mixed UI, state, validation, and business logic
   - Multiple modal states
   - Complex event handling
   - Difficult to test individual features

2. **Flex.deprecated** - 61 imports
   - Used everywhere as utility component
   - Accumulation of responsibilities
   - Performance implications

3. **Large Form Components**
   - Inline validation logic
   - Complex state management
   - Mixed concerns

## Decomposition Principles

### 1. Single Responsibility Principle
Each component should do one thing well:
- **Container**: Manages state and logic
- **Presentation**: Renders UI only
- **Logic**: Pure functions for calculations

### 2. Composition Over Complexity
Build complex UIs from simple parts:
- Small, focused components
- Clear props interfaces
- Minimal internal state

### 3. Testability First
Design for testing from the start:
- Isolate side effects
- Extract business logic
- Use dependency injection

## Decomposition Strategies

### Strategy 1: Container/Presenter Pattern

```typescript
// Before: Mixed concerns in one component
export function SubjectPhasePicker({ subjects, onSelect }: Props) {
  // 1,468 lines of mixed logic and UI
  const [selectedSubject, setSelectedSubject] = useState();
  const [selectedPhase, setSelectedPhase] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Business logic mixed with UI
  const validateSelection = () => { /* ... */ };
  const formatSubjectName = () => { /* ... */ };
  
  return (
    <div>
      {/* Complex UI with inline logic */}
    </div>
  );
}

// After: Separated concerns
// Container: Manages state and logic
export function SubjectPhasePickerContainer({ subjects, onSelect }: Props) {
  const { 
    selectedSubject,
    selectedPhase,
    isModalOpen,
    handlers 
  } = useSubjectPhasePicker({ subjects, onSelect });
  
  return (
    <SubjectPhasePickerView
      subjects={subjects}
      selectedSubject={selectedSubject}
      selectedPhase={selectedPhase}
      isModalOpen={isModalOpen}
      {...handlers}
    />
  );
}

// Presenter: Pure UI component
export function SubjectPhasePickerView({
  subjects,
  selectedSubject,
  selectedPhase,
  isModalOpen,
  onSubjectSelect,
  onPhaseSelect,
  onModalToggle,
}: ViewProps) {
  // Only UI logic, no business logic
  return (
    <div>
      <SubjectGrid 
        subjects={subjects}
        selected={selectedSubject}
        onSelect={onSubjectSelect}
      />
      {isModalOpen && (
        <PhaseModal
          phases={selectedSubject?.phases}
          selected={selectedPhase}
          onSelect={onPhaseSelect}
          onClose={onModalToggle}
        />
      )}
    </div>
  );
}
```

### Strategy 2: Component Extraction

Break large components into focused sub-components:

```typescript
// Extract reusable pieces
components/
├── SubjectPhasePicker/
│   ├── index.tsx                    # Main export
│   ├── SubjectPhasePickerContainer.tsx
│   ├── SubjectPhasePickerView.tsx
│   ├── components/
│   │   ├── SubjectGrid/
│   │   │   ├── SubjectGrid.tsx
│   │   │   ├── SubjectCard.tsx
│   │   │   └── SubjectGrid.test.tsx
│   │   ├── PhaseModal/
│   │   │   ├── PhaseModal.tsx
│   │   │   ├── PhaseList.tsx
│   │   │   └── PhaseModal.test.tsx
│   │   └── FilterBar/
│   │       ├── FilterBar.tsx
│   │       └── FilterBar.test.tsx
│   ├── hooks/
│   │   ├── useSubjectPhasePicker.ts
│   │   └── useSubjectFilter.ts
│   └── utils/
│       ├── validation.ts
│       └── formatting.ts
```

### Strategy 3: Custom Hook Extraction

Move complex logic to custom hooks:

```typescript
// hooks/useSubjectPhasePicker.ts
export function useSubjectPhasePicker({ subjects, onSelect }: Props) {
  const [selectedSubject, setSelectedSubject] = useState<Subject>();
  const [selectedPhase, setSelectedPhase] = useState<Phase>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleSubjectSelect = useCallback((subject: Subject) => {
    setSelectedSubject(subject);
    if (subject.phases.length === 1) {
      // Auto-select single phase
      handlePhaseSelect(subject.phases[0]);
    } else {
      setIsModalOpen(true);
    }
  }, []);
  
  const handlePhaseSelect = useCallback((phase: Phase) => {
    setSelectedPhase(phase);
    setIsModalOpen(false);
    onSelect({ subject: selectedSubject!, phase });
  }, [selectedSubject, onSelect]);
  
  return {
    selectedSubject,
    selectedPhase,
    isModalOpen,
    handlers: {
      onSubjectSelect: handleSubjectSelect,
      onPhaseSelect: handlePhaseSelect,
      onModalToggle: () => setIsModalOpen(!isModalOpen),
    },
  };
}
```

## State Management Patterns

### Local State vs Context

```typescript
// Use local state for UI-only concerns
function ComponentWithLocalState() {
  const [isExpanded, setIsExpanded] = useState(false);
  // UI state stays local
}

// Use context for shared state
const SubjectPhaseContext = createContext<SubjectPhaseContextType>();

export function SubjectPhaseProvider({ children }: Props) {
  // Shared state in context
  const value = useSubjectPhasePickerLogic();
  return (
    <SubjectPhaseContext.Provider value={value}>
      {children}
    </SubjectPhaseContext.Provider>
  );
}
```

### Props Drilling vs Context

**Use Props**: 
- 1-2 levels deep
- Clear data flow
- Easy to test

**Use Context**:
- 3+ levels deep
- Multiple consumers
- Truly global state

## Performance Considerations

### 1. Memoization Strategy

```typescript
// Memoize expensive computations
const filteredSubjects = useMemo(() => 
  subjects.filter(s => s.phase === selectedPhase),
  [subjects, selectedPhase]
);

// Memoize callbacks to prevent re-renders
const handleSelect = useCallback((subject: Subject) => {
  onSelect(subject);
}, [onSelect]);

// Memoize components when needed
const SubjectCard = memo(({ subject, onSelect }: CardProps) => {
  return <Card onClick={() => onSelect(subject)} />;
});
```

### 2. Code Splitting

```typescript
// Lazy load heavy components
const PhaseModal = lazy(() => import('./PhaseModal'));

// Use Suspense
<Suspense fallback={<Loading />}>
  {isModalOpen && <PhaseModal />}
</Suspense>
```

## Migration Approach

### Phase 1: Analysis (1 day)
1. Map component dependencies
2. Identify logical boundaries
3. Plan extraction order

### Phase 2: Extract Logic (2-3 days)
1. Move pure functions to utils
2. Create custom hooks
3. Extract business logic to services

### Phase 3: Decompose UI (2-3 days)
1. Create sub-components
2. Implement container/presenter
3. Add proper TypeScript types

### Phase 4: Testing (2 days)
1. Unit test each piece
2. Integration test the whole
3. Visual regression testing

## Example: SubjectPhasePicker Decomposition

### Step 1: Identify Boundaries

```typescript
// Current structure analysis
SubjectPhasePicker (1,468 lines)
├── State Management (200 lines)
│   ├── Subject selection
│   ├── Phase selection
│   └── Modal state
├── Event Handlers (150 lines)
│   ├── Click handlers
│   ├── Keyboard navigation
│   └── Form submission
├── Validation Logic (100 lines)
├── Formatting Functions (80 lines)
├── Modal Component (300 lines)
├── Subject Grid (400 lines)
└── Filter Bar (238 lines)
```

### Step 2: Create Structure

```typescript
// New component structure
SubjectPhasePicker/
├── SubjectPhasePickerContainer.tsx (50 lines)
├── hooks/
│   └── useSubjectPhasePicker.ts (100 lines)
├── components/
│   ├── SubjectGrid.tsx (150 lines)
│   ├── SubjectCard.tsx (80 lines)
│   ├── PhaseModal.tsx (150 lines)
│   └── FilterBar.tsx (100 lines)
├── utils/
│   ├── validation.ts (50 lines)
│   └── formatting.ts (40 lines)
└── types.ts (30 lines)

// Total: ~750 lines (50% reduction)
// But now: 10 testable units instead of 1
```

### Step 3: Implement Tests

```typescript
// Each piece is now easily testable
describe('SubjectGrid', () => {
  it('renders all subjects', () => {
    render(<SubjectGrid subjects={mockSubjects} />);
    expect(screen.getAllByRole('button')).toHaveLength(10);
  });
});

describe('useSubjectPhasePicker', () => {
  it('auto-selects single phase', () => {
    const { result } = renderHook(() => 
      useSubjectPhasePicker({ subjects: singlePhaseSubjects })
    );
    
    act(() => {
      result.current.handlers.onSubjectSelect(subjects[0]);
    });
    
    expect(result.current.selectedPhase).toBeDefined();
    expect(result.current.isModalOpen).toBe(false);
  });
});
```

## Anti-Patterns to Avoid

### 1. Over-Decomposition
❌ Don't create components for every div
✅ Create components for logical units

### 2. Prop Drilling Hell
❌ Don't pass 20 props through 5 levels
✅ Use context or component composition

### 3. Premature Abstraction
❌ Don't extract until you need to
✅ Follow the rule of three

## Success Metrics

- **Size**: No component >300 lines
- **Complexity**: Cyclomatic complexity <10
- **Testability**: 90%+ coverage achievable
- **Performance**: No regression in render time
- **Maintainability**: Clear separation of concerns

## Tools and Utilities

### Component Size Analysis

```bash
# Find large components
find src -name "*.tsx" -exec wc -l {} \; | sort -rn | head -20
```

### Complexity Analysis

```typescript
// ESLint rule for complexity
{
  "rules": {
    "complexity": ["error", { "max": 10 }]
  }
}
```

## Conclusion

Component decomposition is key to testability. By following these patterns and strategies, large components can be broken down into manageable, testable pieces. The investment in decomposition pays off through:

- Easier testing
- Better maintainability
- Improved performance
- Clearer code organization

Start with the highest-value components and decompose incrementally to see immediate benefits.