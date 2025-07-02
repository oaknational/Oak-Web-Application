# Oak Web Application Testing Research Findings

**Analysis of current testing patterns and infrastructure to inform transformation strategy**

## Current Testing Infrastructure

### Jest Configuration
- **Base Setup**: Uses Next.js Jest configuration with custom base config
- **Test Environment**: JSDOM for DOM testing
- **Coverage**: Comprehensive coverage collection with 15-second timeout for slow tests
- **Module Mapping**: Aliases for `@/` paths and proper UUID module resolution
- **Mocking**: Extensive mocking setup for external dependencies (Bugsnag, PostHog, Clerk, etc.)

### Testing Dependencies
- **@testing-library/react** (v16.0.0): Primary testing library
- **@testing-library/jest-dom** (v6.4.6): DOM matchers
- **@testing-library/user-event** (v14.5.2): User interaction testing
- **jest-styled-components** (v7.2.0): Styled components testing
- **jest-fetch-mock** (v3.0.3): API mocking
- **next-router-mock** (v0.9.13): Next.js router mocking

## Current Testing Patterns Analysis

### Component Tests (10 Representative Examples)

#### SharedComponents - Card.test.tsx
**Pattern**: Simple styled component testing
```typescript
describe("spacing", () => {
  test("has default padding 24", async () => {
    const { getByTestId } = render(<Card data-testid="test" />);
    expect(getByTestId("test")).toHaveStyle("padding-left: 1.5rem");
  });
});
```
**Quality**: Good - Focused, clear, tests actual CSS output
**Domain Context**: Generic UI component testing

#### TeacherComponents - LessonOverviewHeader.test.tsx  
**Pattern**: Feature-rich component with Oak domain logic
```typescript
it("renders the download button when !expired && show download all is true", () => {
  const { getAllByTestId } = renderWithTheme(
    <LessonOverviewHeader {...props} showDownloadAll={true} />,
  );
  expect(getAllByTestId("download-all-button")).toHaveLength(2); // mobile and desktop
});
```
**Quality**: Good - Tests real teacher workflow features, uses fixtures
**Domain Context**: Lesson management, teacher experience
**Oak Domain**: Tests download functionality, lesson expiration logic

#### PupilComponents - QuizRenderer.test.tsx
**Pattern**: Complex interactive component with context dependencies
```typescript
it("captures the MCQ selected answers when submit is clicked", () => {
  // Complex setup with multiple contexts and mock quiz data
  act(() => {
    fireEvent.click(getByLabelText(/a group of letters/));
    fireEvent.click(getByRole("button", { name: "Submit" }));
  });
  expect(context.handleSubmitMCAnswer).toHaveBeenCalled();
});
```
**Quality**: Good - Tests actual quiz interactions with realistic data
**Domain Context**: Pupil learning experience, quiz functionality
**Oak Domain**: Tests curriculum quiz mechanics, question types

### Hook Tests (5 Examples)

#### useLocalStorage.test.ts
**Pattern**: Custom hook with comprehensive edge cases
```typescript
test("Update the state with a callback function", () => {
  const { result } = renderHook(() => useLocalStorage("count", 2));
  act(() => {
    setState((prev) => prev + 1);
  });
  expect(result.current[0]).toBe(3);
});
```
**Quality**: Excellent - Thorough testing of hook behavior, edge cases, validation

#### useFetch.test.ts
**Pattern**: API interaction hook with error handling
```typescript
test("invalid", async () => {
  fetch.mockResolvedValueOnce(new Response("{}", { status: 404 }));
  await waitFor(() => expect(hook.result.current.isLoading).toEqual(false));
  expect(result.error?.message).toEqual("An unknown error has occurred");
});
```
**Quality**: Good - Tests success/error states, proper async handling

### Utility Function Tests (5 Examples)

#### formatDate.test.ts
**Pattern**: Simple pure function testing
```typescript
test("should default to format like 14 April 1989", () => {
  expect(formatDate("1989-04-14")).toBe("14 April 1989");
});
```
**Quality**: Good - Clear, focused unit tests
**Domain Context**: Date formatting for curriculum content

#### curriculum/lessons.test.ts
**Pattern**: Domain-specific utility testing
```typescript
it("returns false if no lessons are published", () => {
  const noPublishedLessons = [
    { title: "Lesson 1", _state: "new" },
    { title: "Lesson 2", _state: "new" }
  ];
  expect(areLessonsAvailable(noPublishedLessons)).toEqual(false);
});
```
**Quality**: Good - Tests real curriculum publishing logic
**Oak Domain**: Lesson availability, content state management

### Page Tests (5 Examples)

#### index.test.tsx (Homepage)
**Pattern**: Page component with routing logic
```typescript
it.each(["curriculum", "pupils", "teachers", "ai"])(
  "redirects to / when the path includes #", (path) => {
    Object.defineProperty(window, "location", {
      value: { href: `/#${path}` }
    });
    render(<HomePage {...props} />);
    expect(pushMock).toHaveBeenCalledWith(`/${path}`);
  }
);
```
**Quality**: Good - Tests navigation behavior, uses realistic scenarios
**Oak Domain**: Main site navigation between user types

#### teachers/index.test.tsx
**Pattern**: Page with getStaticProps testing
```typescript
it("Should filter out upcoming webinars", async () => {
  mockCMSClient.webinars.mockResolvedValueOnce([...futureWebinars]);
  const result = await getStaticProps({ params: {} });
  expect(result.props.posts.map(p => p.id)).toEqual(["2", "3"]);
});
```
**Quality**: Excellent - Tests data fetching logic, business rules
**Oak Domain**: Content management, teacher resources

## Real Oak Domain Examples Found

### Curriculum Domain
- **Lesson availability testing**: `areLessonsAvailable` function tests curriculum publishing logic
- **Programme and unit management**: Unit ordering, lesson sequences, tier management
- **Quiz question types**: MCQ, short answer, matching, order-the-words questions
- **Curriculum phases**: EYFS, KS1, KS2, KS3, KS4 progression testing
- **Subject categorization**: Mathematics, English, Science domain-specific logic

### Teacher Experience
- **Lesson downloads and sharing**: Download permissions, resource access controls
- **Onboarding flows**: Teacher registration, school selection, role assignment
- **School selection**: Find school functionality, school verification
- **Download access permissions**: Terms agreement workflows, access level validation
- **Resource management**: Lesson planning tools, curriculum browser

### Pupil Experience
- **Quiz interactions**: Answer submission, grading, progress tracking
- **Lesson progress tracking**: Section completion, video watching time
- **Video watching**: Play/pause tracking, progress markers
- **Section navigation**: Intro, quiz, video, review section flows
- **Answer submission**: Multiple choice, text input, drag-and-drop interactions

### Content Management
- **Blog post filtering**: Date-based filtering, content categorization
- **Webinar management**: Future/past webinar filtering, registration flows
- **Content state management**: Published, draft, archived content states
- **SEO and metadata**: Page titles, descriptions, structured data
- **Image processing**: Responsive images, optimization, lazy loading

## Current Testing Quality Assessment

### Strengths
1. **Comprehensive RTL Usage**: Consistent use of React Testing Library patterns across codebase
2. **Good Helper Utilities**: Well-structured `renderWithProviders` and `renderWithTheme` helpers
3. **Oak Domain Integration**: Tests use realistic curriculum fixtures and domain data
4. **Mock Strategy**: Sophisticated mocking setup for external dependencies (PostHog, Clerk, Bugsnag)
5. **Coverage Configuration**: Good coverage collection setup with appropriate exclusions
6. **Fixture Quality**: Tests use realistic Oak curriculum data (lessons, programmes, units)
7. **User-Focused Testing**: Tests focus on user interactions rather than implementation details

### Areas for Improvement (Anti-Patterns Found)

1. **Inconsistent Testing Patterns**: Mix of different testing approaches across similar components
2. **Limited Integration Testing**: Most tests are unit-focused, missing user journey testing
3. **Fixture Management**: Some tests create ad-hoc test data instead of using shared fixtures
4. **Error Testing**: Limited negative path testing in many components
5. **Accessibility Testing**: No systematic a11y testing in component tests
6. **Console Mocking Inconsistency**: Some tests mock console, others don't
7. **Large Test Files**: Some test files are quite lengthy with many scattered test cases
8. **Brittle Selectors**: Some tests rely on text content that could change
9. **Mock Overuse**: Some simple components are over-mocked when direct testing would be clearer

### Specific Anti-Patterns Observed

#### 1. Mixed Testing Philosophies
```typescript
// Some tests focus on implementation
expect(component.find('.lesson-card')).toHaveLength(1);

// Others focus on user behavior (better)
expect(screen.getByRole('button', { name: 'Start Lesson' })).toBeInTheDocument();
```

#### 2. Inconsistent Fixture Usage
```typescript
// Ad-hoc test data creation
const lesson = { title: 'Test', duration: 45 };

// vs. proper fixture usage
const lesson = createMockLesson({ title: 'Fractions Introduction' });
```

#### 3. Over-Mocking Simple Logic
Some tests mock simple utilities that could be tested directly, reducing confidence in the actual implementation.

## Gap Analysis: Current State vs. Best Practices

### What's Missing from Current Testing Strategy

1. **TDD Workflow**: No evidence of test-first development practices
2. **Pure Function Emphasis**: Many testable functions are embedded in components
3. **Systematic Architecture Testing**: No clear patterns for testing component composition
4. **Cultural Documentation**: No written testing philosophy or team standards
5. **Accessibility Integration**: A11y testing not embedded in component testing workflow
6. **Performance Testing**: No systematic performance regression testing
7. **Visual Regression**: Limited Storybook integration testing

### Transformation Opportunities

1. **Standardize Excellent Patterns**: Build on the good RTL usage and Oak domain integration
2. **Extract Pure Functions**: Many embedded calculations could be extracted and tested independently
3. **Create Testing Archetypes**: Establish clear patterns for different component types
4. **Enhance Integration Testing**: Add user journey testing for critical flows
5. **Cultural Transformation**: Introduce TDD practices gradually with supportive guidance
6. **Accessibility Integration**: Make a11y testing a natural part of component testing

## Recommendations for Testing Strategy Implementation

### High-Impact, Low-Resistance Changes
1. **Standardize existing good patterns** rather than introducing completely new approaches
2. **Create shared fixtures** for Oak domain objects (lessons, programmes, units)
3. **Document current excellent examples** as templates for team adoption
4. **Gradual pure function extraction** from components with immediate testing benefits

### Cultural Considerations for Oak Team
1. **Build on existing RTL expertise** rather than introducing new testing libraries
2. **Leverage Oak domain knowledge** already embedded in current tests
3. **Address fixture inconsistency** with gentle standardization
4. **Introduce TDD gradually** with compelling examples rather than mandates

### Technical Infrastructure Improvements
1. **Enhance test organization** to match current codebase structure
2. **Improve mock consistency** across similar component types
3. **Add accessibility testing** as natural extension of current RTL usage
4. **Create component testing templates** based on current successful patterns

---

*This research reveals a solid foundation with good RTL usage and Oak domain integration. The transformation strategy should build on these strengths while addressing consistency and cultural aspects of testing practices.*