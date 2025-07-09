# High-Traffic Components Test Improvement Plan

**Purpose**: Improve test quality for the most-used components in Oak's codebase  
**Impact**: These 20 components affect the majority of the application  
**Goal**: Transform testing from implementation-focused to behavior-focused

## Top 20 High-Traffic Components Analysis

### Tier 1: Critical UI Primitives (Used 20+ times)

#### 1. Flex.deprecated (61 imports)
**Current State**: Layout primitive, likely testing CSS properties  
**Test Improvements Needed**:
- Remove style/CSS property tests
- Test layout behavior with different content
- Test responsive behavior
- Add accessibility tests for flex layouts

**Example Improvement**:
```typescript
// BEFORE: Testing implementation
it('applies flex direction row', () => {
  expect(flex).toHaveStyle('flex-direction: row');
});

// AFTER: Testing behavior
it('arranges children horizontally', () => {
  render(
    <Flex direction="row">
      <Button>First</Button>
      <Button>Second</Button>
    </Flex>
  );
  
  const buttons = screen.getAllByRole('button');
  const firstRect = buttons[0].getBoundingClientRect();
  const secondRect = buttons[1].getBoundingClientRect();
  
  expect(secondRect.left).toBeGreaterThan(firstRect.right);
});
```

#### 2. ButtonAsLink (35 imports)
**Current State**: Likely testing props and styles  
**Test Improvements Needed**:
- Test navigation behavior
- Test keyboard accessibility
- Test screen reader announcements
- Test loading states

#### 3. AppLayout (31 imports)
**Current State**: Complex layout component  
**Test Improvements Needed**:
- Test responsive layout changes
- Test menu interactions
- Test focus management
- Test landmark regions for accessibility

#### 4. OwaLink (29 imports)
**Current State**: Navigation component  
**Test Improvements Needed**:
- Test internal vs external link behavior
- Test prefetching behavior
- Test accessibility attributes
- Test analytics tracking

#### 5. Box (28 imports)
**Current State**: Another layout primitive  
**Test Improvements Needed**:
- Remove CSS tests
- Test content containment
- Test overflow behavior
- Test semantic HTML output

### Tier 2: Content & Interaction Components (15-20 imports)

#### 6. PortableText (20 imports)
**Current State**: Rich text renderer  
**Test Improvements Needed**:
- Test various content types rendering
- Test custom component rendering
- Test accessibility of output HTML
- Test malformed content handling

#### 7. LessonEngineProvider (20 imports)
**Current State**: Critical pupil experience provider  
**Test Improvements Needed**:
- Test state management behavior
- Test navigation flow
- Test error boundaries
- Test progress tracking

**Pure Function Extraction Opportunity**:
```typescript
// Extract from provider
export const calculateLessonProgress = (
  completedSections: string[],
  totalSections: string[]
): number => {
  if (totalSections.length === 0) return 0;
  return (completedSections.length / totalSections.length) * 100;
};

// Test becomes simple
describe('calculateLessonProgress', () => {
  it('calculates percentage correctly', () => {
    expect(calculateLessonProgress(['intro', 'video'], ['intro', 'video', 'quiz']))
      .toBe(66.67);
  });
});
```

#### 8. Card (20 imports)
**Current State**: Generic container component  
**Test Improvements Needed**:
- Test click behavior
- Test keyboard navigation
- Test content layout
- Test responsive behavior

#### 9. Button (17 imports)
**Current State**: Core interaction component  
**Test Improvements Needed**:
- Test all interactive states
- Test keyboard accessibility
- Test loading behavior
- Test disabled state handling

### Tier 3: Specialized Components (10-15 imports)

#### 10-15. Various Components
Including CMSImage, QuizEngineProvider, Layout, SubjectPhasePicker

**Common Improvements Needed**:
- Remove implementation tests
- Add behavior tests
- Add accessibility tests
- Extract business logic to pure functions

## Behavior Test Patterns for Each Category

### 1. Layout Components (Flex, Box, AppLayout)
```typescript
describe('Layout Components', () => {
  it('maintains content hierarchy for screen readers', () => {
    render(
      <AppLayout>
        <header>Header</header>
        <main>Content</main>
        <footer>Footer</footer>
      </AppLayout>
    );
    
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });
});
```

### 2. Navigation Components (OwaLink, ButtonAsLink)
```typescript
describe('Navigation Components', () => {
  it('announces navigation to screen readers', async () => {
    const user = userEvent.setup();
    render(<ButtonAsLink href="/teachers">Go to Teachers</ButtonAsLink>);
    
    const link = screen.getByRole('link', { name: /go to teachers/i });
    expect(link).toHaveAttribute('href', '/teachers');
    
    await user.click(link);
    // Test navigation occurred
  });
});
```

### 3. Provider Components (LessonEngineProvider, QuizEngineProvider)
```typescript
describe('Provider Components', () => {
  it('provides lesson state to children', () => {
    const TestComponent = () => {
      const { currentSection } = useLessonEngine();
      return <div>{currentSection}</div>;
    };
    
    render(
      <LessonEngineProvider initialSection="intro">
        <TestComponent />
      </LessonEngineProvider>
    );
    
    expect(screen.getByText('intro')).toBeInTheDocument();
  });
});
```

## Pure Function Extraction Priorities

### From High-Traffic Components:

1. **LessonEngineProvider**
   - Progress calculations
   - Section navigation logic
   - Completion validation

2. **QuizEngineProvider**
   - Score calculations
   - Answer validation
   - Progress tracking

3. **SubjectPhasePicker**
   - Filter logic
   - Option validation
   - State derivation

4. **Pagination Hook**
   - Page calculations
   - Range generation
   - Boundary validation

## Implementation Strategy

### Phase 1: Pure Function Extraction (Quick Wins)
1. Extract calculation logic from providers
2. Extract validation logic from forms
3. Extract formatting logic from display components

### Phase 2: Behavior Test Conversion
1. Start with most-used components (Flex, Button, Box)
2. Replace style tests with behavior tests
3. Add accessibility tests to all components

### Phase 3: Provider Pattern Improvement
1. Separate business logic from React context
2. Create testable state machines
3. Add integration tests for user flows

## Success Metrics

### Coverage Goals
- Line coverage: Maintain current levels
- Behavior coverage: 100% of user interactions
- Accessibility coverage: 100% of UI components

### Quality Goals
- No style/implementation tests
- All business logic in pure functions
- Every component has accessibility tests

### Performance Goals
- Component tests < 100ms
- Provider tests < 200ms
- Pure function tests < 10ms

## Next Steps for Phase 2

1. Create example refactorings for top 5 components
2. Document behavior testing patterns
3. Create accessibility testing checklist
4. Build team consensus on patterns
5. Start with Flex.deprecated as pilot