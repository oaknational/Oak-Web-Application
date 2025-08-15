# React Best Practices for Better Testing

**Purpose**: Identify React patterns that hinder testing and provide improvement strategies  
**Impact**: Better testability leads to more reliable components and faster development  
**Goal**: Transform React components to be easily testable and maintainable

## Critical Anti-Patterns Found

### 1. Component Size Issues

#### Problem: Massive Components
**Worst Offender**: `SubjectPhasePicker.tsx` - 1,468 lines with 10 useState calls

**Why it's a problem**:
- Impossible to unit test effectively
- Too many responsibilities
- High cognitive load
- Difficult to mock dependencies

**Solution Pattern**:
```typescript
// BEFORE: Everything in one component
const SubjectPhasePicker = () => {
  const [subject, setSubject] = useState();
  const [phase, setPhase] = useState();
  const [keystage, setKeystage] = useState();
  const [year, setYear] = useState();
  const [unit, setUnit] = useState();
  // ... 5 more states
  
  // 1400+ lines of logic and UI
};

// AFTER: Broken into focused components
const SubjectPhasePicker = () => {
  const pickerState = useSubjectPhaseState();
  
  return (
    <PickerProvider value={pickerState}>
      <SubjectSelector />
      <PhaseSelector />
      <KeyStageSelector />
      <YearSelector />
      <UnitBrowser />
    </PickerProvider>
  );
};

// Testable state hook
const useSubjectPhaseState = () => {
  const [selection, dispatch] = useReducer(pickerReducer, initialState);
  
  return {
    selection,
    selectSubject: (subject) => dispatch({ type: 'SELECT_SUBJECT', subject }),
    selectPhase: (phase) => dispatch({ type: 'SELECT_PHASE', phase }),
    // ... other actions
  };
};
```

### 2. State Management Chaos

#### Problem: Too Many useState Calls
**Example**: Components with 10+ separate state variables

**Why it's a problem**:
- State updates can conflict
- Hard to test all combinations
- Difficult to reason about

**Solution Pattern**:
```typescript
// BEFORE: Multiple related states
const ResourceForm = () => {
  const [email, setEmail] = useState('');
  const [school, setSchool] = useState('');
  const [resources, setResources] = useState([]);
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  // ... more states
};

// AFTER: Consolidated state with reducer
type FormState = {
  values: FormValues;
  status: 'idle' | 'loading' | 'error' | 'success';
  error: string | null;
};

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return {
        ...state,
        values: { ...state.values, [action.field]: action.value }
      };
    case 'SUBMIT':
      return { ...state, status: 'loading', error: null };
    case 'SUCCESS':
      return { ...state, status: 'success' };
    case 'ERROR':
      return { ...state, status: 'error', error: action.error };
    default:
      return state;
  }
};
```

### 3. Business Logic in Components

#### Problem: Data Processing Mixed with UI
**Example**: Filtering, sorting, calculating in render methods

**Why it's a problem**:
- Cannot test logic separately
- Performance issues
- Logic not reusable

**Solution Pattern**:
```typescript
// BEFORE: Logic in component
const UnitList = ({ units }) => {
  const filteredUnits = units
    .filter(unit => unit.published)
    .sort((a, b) => a.order - b.order)
    .map(unit => ({
      ...unit,
      displayTitle: `${unit.number}. ${unit.title}`,
      isNew: new Date(unit.createdAt) > lastWeek
    }));
    
  return filteredUnits.map(unit => <UnitCard {...unit} />);
};

// AFTER: Extract to pure functions
// src/utils/units/unitProcessing.ts
export const filterPublishedUnits = (units: Unit[]): Unit[] =>
  units.filter(unit => unit.published);

export const sortUnitsByOrder = (units: Unit[]): Unit[] =>
  [...units].sort((a, b) => a.order - b.order);

export const enhanceUnitDisplay = (unit: Unit): EnhancedUnit => ({
  ...unit,
  displayTitle: `${unit.number}. ${unit.title}`,
  isNew: isNewUnit(unit.createdAt)
});

// Component becomes simple
const UnitList = ({ units }) => {
  const displayUnits = useMemo(() => 
    sortUnitsByOrder(filterPublishedUnits(units))
      .map(enhanceUnitDisplay),
    [units]
  );
  
  return displayUnits.map(unit => <UnitCard key={unit.id} {...unit} />);
};
```

### 4. useEffect Data Fetching

#### Problem: Data Fetching Without Abstraction
**Example**: 163 files with useEffect containing fetch/api calls

**Why it's a problem**:
- Race conditions
- Memory leaks
- Hard to test loading/error states
- Duplicate fetching logic

**Solution Pattern**:
```typescript
// BEFORE: Direct fetching in component
const LessonDetails = ({ lessonId }) => {
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    let cancelled = false;
    
    async function fetchLesson() {
      try {
        setLoading(true);
        const response = await fetch(`/api/lessons/${lessonId}`);
        const data = await response.json();
        if (!cancelled) {
          setLesson(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    
    fetchLesson();
    
    return () => { cancelled = true; };
  }, [lessonId]);
  
  // ... render logic
};

// AFTER: Using React Query or custom hook
const useLessonQuery = (lessonId: string) => {
  return useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: () => lessonApi.getLesson(lessonId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

const LessonDetails = ({ lessonId }) => {
  const { data: lesson, isLoading, error } = useLessonQuery(lessonId);
  
  if (isLoading) return <LessonSkeleton />;
  if (error) return <ErrorMessage error={error} />;
  
  return <LessonContent lesson={lesson} />;
};
```

### 5. Event Handler Anti-Patterns

#### Problem: Inline Functions in Render
**Example**: Arrow functions in onClick handlers

**Why it's a problem**:
- Functions recreated every render
- Cannot test handlers in isolation
- Performance implications

**Solution Pattern**:
```typescript
// BEFORE: Inline handlers
const ResourceList = ({ resources }) => {
  return resources.map(resource => (
    <button
      key={resource.id}
      onClick={() => {
        trackEvent('resource_click', { id: resource.id });
        downloadResource(resource);
      }}
    >
      Download {resource.name}
    </button>
  ));
};

// AFTER: Extracted handlers
const useResourceHandlers = () => {
  const handleResourceClick = useCallback((resource: Resource) => {
    trackEvent('resource_click', { id: resource.id });
    downloadResource(resource);
  }, []);
  
  return { handleResourceClick };
};

const ResourceList = ({ resources }) => {
  const { handleResourceClick } = useResourceHandlers();
  
  return resources.map(resource => (
    <ResourceButton
      key={resource.id}
      resource={resource}
      onClick={handleResourceClick}
    />
  ));
};

// Even better: Move to child component
const ResourceButton = ({ resource, onClick }) => {
  const handleClick = useCallback(() => {
    onClick(resource);
  }, [onClick, resource]);
  
  return (
    <button onClick={handleClick}>
      Download {resource.name}
    </button>
  );
};
```

### 6. DOM Manipulation

#### Problem: Direct DOM Access
**Example**: document.querySelector, getElementById

**Why it's a problem**:
- Breaks React's declarative model
- Hard to test without full DOM
- Brittle and error-prone

**Solution Pattern**:
```typescript
// BEFORE: Direct DOM manipulation
const ScrollToUnit = ({ unitId }) => {
  const scrollToUnit = () => {
    const element = document.querySelector(`#unit-${unitId}`);
    element?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return <button onClick={scrollToUnit}>Go to Unit</button>;
};

// AFTER: Using React refs
const UnitList = () => {
  const unitRefs = useRef<Record<string, HTMLElement>>({});
  
  const scrollToUnit = useCallback((unitId: string) => {
    unitRefs.current[unitId]?.scrollIntoView({ behavior: 'smooth' });
  }, []);
  
  return (
    <>
      <UnitNav onUnitClick={scrollToUnit} />
      {units.map(unit => (
        <div
          key={unit.id}
          ref={el => { if (el) unitRefs.current[unit.id] = el; }}
        >
          <UnitContent unit={unit} />
        </div>
      ))}
    </>
  );
};
```

## Testing Strategy for Each Pattern

### 1. Large Component Testing
```typescript
// Test each sub-component independently
describe('SubjectSelector', () => {
  it('displays available subjects', () => {
    render(<SubjectSelector subjects={mockSubjects} />);
    expect(screen.getByRole('combobox')).toHaveTextContent('Select subject');
  });
});

// Test the coordinator separately
describe('useSubjectPhaseState', () => {
  it('updates phase when subject changes', () => {
    const { result } = renderHook(() => useSubjectPhaseState());
    
    act(() => {
      result.current.selectSubject('mathematics');
    });
    
    expect(result.current.selection.availablePhases).toEqual(['primary', 'secondary']);
  });
});
```

### 2. State Management Testing
```typescript
// Test reducer logic purely
describe('formReducer', () => {
  it('handles field updates', () => {
    const state = formReducer(initialState, {
      type: 'UPDATE_FIELD',
      field: 'email',
      value: 'teacher@school.org'
    });
    
    expect(state.values.email).toBe('teacher@school.org');
  });
});
```

### 3. Business Logic Testing
```typescript
// Pure function tests are simple
describe('filterPublishedUnits', () => {
  it('returns only published units', () => {
    const units = [
      { id: '1', published: true },
      { id: '2', published: false },
    ];
    
    expect(filterPublishedUnits(units)).toHaveLength(1);
    expect(filterPublishedUnits(units)[0].id).toBe('1');
  });
});
```

## Implementation Priorities

### Phase 1: Quick Wins
1. Extract inline functions from top 20 components
2. Create custom hooks for data fetching
3. Remove direct DOM manipulation

### Phase 2: State Refactoring
1. Refactor SubjectPhasePicker into smaller components
2. Convert complex state to useReducer
3. Extract business logic to utilities

### Phase 3: Architecture
1. Implement React Query for data fetching
2. Create component composition patterns
3. Establish size limits for components

## Success Metrics

- **Component Size**: No component > 200 lines
- **State Complexity**: Max 5 useState per component
- **Test Coverage**: 90%+ for business logic
- **Performance**: No inline function definitions
- **Maintainability**: Clear separation of concerns

These patterns will make Oak's React components significantly more testable and maintainable.