# Test Type Examples

**Purpose**: Demonstrate HOW to implement different test types following Oak's testing strategy  
**Based On**: [docs/testing-strategy/index.md](../../../../docs/testing-strategy/index.md)  
**Goal**: Show clear patterns for each test type using examples from our pure function opportunities

## Test Type Definitions

### 1. Unit Tests (Pure Functions, No IO)

**When to Use**: Testing pure functions with no side effects or external dependencies

**What to Test**:
- ✅ Input/output transformations
- ✅ Edge cases and error conditions
- ✅ Business logic correctness
- ❌ Implementation details
- ❌ External dependencies

**Example: Quiz Answer Validation**

```typescript
// src/utils/quiz/validation.test.ts
import { validateAnswer, canSubmitQuiz } from './validation';

describe('validateAnswer', () => {
  describe('multiple choice questions', () => {
    it('validates selected answer as valid', () => {
      const result = validateAnswer(
        { type: 'multiple-choice', value: 'option-a' },
        'multiple-choice'
      );
      
      expect(result).toEqual({
        isValid: true,
        error: null
      });
    });

    it('rejects empty answer', () => {
      const result = validateAnswer(
        { type: 'multiple-choice', value: '' },
        'multiple-choice'
      );
      
      expect(result).toEqual({
        isValid: false,
        error: 'Answer required'
      });
    });
  });

  describe('short answer questions', () => {
    it('validates answer within length limit', () => {
      const result = validateAnswer(
        { type: 'short-answer', value: 'Valid answer' },
        'short-answer'
      );
      
      expect(result).toEqual({
        isValid: true,
        error: null
      });
    });

    it('rejects answer exceeding length limit', () => {
      const longAnswer = 'a'.repeat(201);
      const result = validateAnswer(
        { type: 'short-answer', value: longAnswer },
        'short-answer'
      );
      
      expect(result).toEqual({
        isValid: false,
        error: 'Answer too long'
      });
    });
  });
});

describe('canSubmitQuiz', () => {
  it('allows submission when all required questions answered', () => {
    const answers = {
      'q1': { type: 'multiple-choice', value: 'a' },
      'q2': { type: 'multiple-choice', value: 'b' }
    };
    
    const result = canSubmitQuiz(answers, ['q1', 'q2'], false);
    
    expect(result).toBe(true);
  });

  it('prevents submission when required question missing', () => {
    const answers = {
      'q1': { type: 'multiple-choice', value: 'a' }
    };
    
    const result = canSubmitQuiz(answers, ['q1', 'q2'], false);
    
    expect(result).toBe(false);
  });

  it('prevents submission when already submitting', () => {
    const answers = {
      'q1': { type: 'multiple-choice', value: 'a' },
      'q2': { type: 'multiple-choice', value: 'b' }
    };
    
    const result = canSubmitQuiz(answers, ['q1', 'q2'], true);
    
    expect(result).toBe(false);
  });
});
```

**Performance Testing Pattern**:
```typescript
describe('performance', () => {
  it('validates 1000 answers in under 10ms', () => {
    const answers = Array(1000).fill({
      type: 'multiple-choice',
      value: 'option-a'
    });
    
    const start = performance.now();
    answers.forEach(answer => validateAnswer(answer, 'multiple-choice'));
    const duration = performance.now() - start;
    
    expect(duration).toBeLessThan(10);
  });
});
```

### 2. Integration Tests (Mocked IO)

**When to Use**: Testing modules that interact with external systems but with dependencies mocked

**What to Test**:
- ✅ Module interactions
- ✅ Error handling from external systems
- ✅ Data flow between components
- ❌ External service implementation
- ❌ Network calls

**Example: Curriculum Downloads API with Mocked External Service**

```typescript
// src/pages/api/curriculum-downloads/index.test.ts
import { createMocks } from 'node-mocks-http';
import handler from './index';
import { curriculumApiService } from '@/services/curriculum';

// Mock external service
jest.mock('@/services/curriculum');

describe('/api/curriculum-downloads', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('generates download package for valid lesson request', async () => {
    // Arrange
    const mockLessonData = {
      title: 'Fractions Introduction',
      resources: [
        { type: 'worksheet', url: 'https://example.com/worksheet.pdf' },
        { type: 'slides', url: 'https://example.com/slides.pptx' }
      ]
    };
    
    (curriculumApiService.getLesson as jest.Mock).mockResolvedValue(mockLessonData);
    
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        lessonSlug: 'fractions-introduction',
        resourceTypes: ['worksheet', 'slides']
      }
    });

    // Act
    await handler(req, res);

    // Assert
    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({
      downloadUrl: expect.stringContaining('/downloads/'),
      expiresAt: expect.any(String)
    });
    expect(curriculumApiService.getLesson).toHaveBeenCalledWith('fractions-introduction');
  });

  it('handles external service errors gracefully', async () => {
    // Arrange
    (curriculumApiService.getLesson as jest.Mock).mockRejectedValue(
      new Error('Service unavailable')
    );
    
    const { req, res } = createMocks({
      method: 'POST',
      body: { lessonSlug: 'fractions-introduction' }
    });

    // Act
    await handler(req, res);

    // Assert
    expect(res._getStatusCode()).toBe(503);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Curriculum service temporarily unavailable'
    });
  });
});
```

### 3. Component Tests (Behavior-Focused)

**When to Use**: Testing React components with focus on user behavior

**What to Test**:
- ✅ User interactions
- ✅ Rendered output
- ✅ Accessibility
- ✅ Component behavior
- ❌ Component implementation
- ❌ Styles

**Example: Quiz Component with Pure Function Integration**

```typescript
// src/components/PupilComponents/QuizQuestion/QuizQuestion.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { QuizQuestion } from './QuizQuestion';
import { validateAnswer } from '@/utils/quiz/validation';

expect.extend(toHaveNoViolations);

// Mock the pure function (already tested in unit tests)
jest.mock('@/utils/quiz/validation');

describe('QuizQuestion', () => {
  const mockQuestion = {
    id: 'q1',
    type: 'multiple-choice',
    text: 'What is 2 + 2?',
    options: [
      { id: 'a', text: '3' },
      { id: 'b', text: '4' },
      { id: 'c', text: '5' }
    ]
  };

  beforeEach(() => {
    (validateAnswer as jest.Mock).mockReturnValue({
      isValid: true,
      error: null
    });
  });

  it('renders question text and options', () => {
    render(<QuizQuestion question={mockQuestion} onAnswer={jest.fn()} />);
    
    expect(screen.getByText('What is 2 + 2?')).toBeInTheDocument();
    expect(screen.getByLabelText('3')).toBeInTheDocument();
    expect(screen.getByLabelText('4')).toBeInTheDocument();
    expect(screen.getByLabelText('5')).toBeInTheDocument();
  });

  it('allows keyboard navigation between options', async () => {
    const user = userEvent.setup();
    render(<QuizQuestion question={mockQuestion} onAnswer={jest.fn()} />);
    
    const firstOption = screen.getByLabelText('3');
    await user.tab();
    
    expect(firstOption).toHaveFocus();
    
    await user.keyboard('{ArrowDown}');
    expect(screen.getByLabelText('4')).toHaveFocus();
  });

  it('calls onAnswer when option selected', async () => {
    const user = userEvent.setup();
    const onAnswer = jest.fn();
    render(<QuizQuestion question={mockQuestion} onAnswer={onAnswer} />);
    
    await user.click(screen.getByLabelText('4'));
    
    expect(onAnswer).toHaveBeenCalledWith({
      questionId: 'q1',
      answer: { type: 'multiple-choice', value: 'b' }
    });
  });

  it('meets accessibility standards', async () => {
    const { container } = render(
      <QuizQuestion question={mockQuestion} onAnswer={jest.fn()} />
    );
    
    const results = await axe(container);
    
    expect(results).toHaveNoViolations();
  });

  it('shows validation error when invalid answer submitted', async () => {
    (validateAnswer as jest.Mock).mockReturnValue({
      isValid: false,
      error: 'Please select an answer'
    });
    
    const user = userEvent.setup();
    render(<QuizQuestion question={mockQuestion} onAnswer={jest.fn()} />);
    
    await user.click(screen.getByRole('button', { name: /submit/i }));
    
    expect(screen.getByRole('alert')).toHaveTextContent('Please select an answer');
  });
});
```

**Component Performance Testing**:
```typescript
it('renders large question list within performance budget', async () => {
  const questions = Array(50).fill(mockQuestion).map((q, i) => ({
    ...q,
    id: `q${i}`
  }));
  
  const start = performance.now();
  render(<QuizQuestionList questions={questions} />);
  const renderTime = performance.now() - start;
  
  expect(renderTime).toBeLessThan(100); // 100ms budget
});
```

### 4. API Route Tests

**When to Use**: Testing Next.js API routes with mocked external dependencies

**What to Test**:
- ✅ Request/response handling
- ✅ Authentication/authorization
- ✅ Error responses
- ✅ Data validation
- ❌ External API behavior

**Example: School Search API**

```typescript
// src/pages/api/schools/search.test.ts
import { createMocks } from 'node-mocks-http';
import handler from './search';
import { schoolDatabase } from '@/services/schools';

jest.mock('@/services/schools');

describe('/api/schools/search', () => {
  it('returns schools matching search query', async () => {
    const mockSchools = [
      { urn: '123456', name: 'Oak Primary School', postcode: 'SW1A 1AA' },
      { urn: '123457', name: 'Oak Secondary School', postcode: 'SW1A 2BB' }
    ];
    
    (schoolDatabase.search as jest.Mock).mockResolvedValue(mockSchools);
    
    const { req, res } = createMocks({
      method: 'GET',
      query: { q: 'Oak' }
    });
    
    await handler(req, res);
    
    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({
      schools: mockSchools,
      count: 2
    });
  });

  it('validates query parameters', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: {} // Missing required query
    });
    
    await handler(req, res);
    
    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Search query required'
    });
  });
});
```

## Test Organization Best Practices

### File Naming
```
src/
├── utils/
│   ├── quiz/
│   │   ├── validation.ts
│   │   └── validation.test.ts      # Unit test
├── components/
│   ├── QuizQuestion/
│   │   ├── QuizQuestion.tsx
│   │   └── QuizQuestion.test.tsx    # Component test
├── pages/
│   └── api/
│       └── curriculum-downloads/
│           ├── index.ts
│           └── index.test.ts        # API test
```

### Test Structure Template
```typescript
describe('ModuleName', () => {
  // Setup
  beforeEach(() => {
    // Reset mocks, initialize state
  });

  describe('feature or method name', () => {
    it('describes expected behavior in user terms', () => {
      // Arrange
      const input = setupTestData();
      
      // Act
      const result = functionUnderTest(input);
      
      // Assert
      expect(result).toEqual(expectedOutput);
    });

    it('handles edge case gracefully', () => {
      // Edge case test
    });
  });

  describe('error handling', () => {
    it('provides helpful error for invalid input', () => {
      // Error case test
    });
  });
});
```

## Common Patterns and Anti-Patterns

### ✅ Good Patterns

1. **Test Behavior, Not Implementation**
```typescript
// Good
it('displays error message when form validation fails', () => {
  // Tests what the user sees
});

// Bad
it('sets isValid state to false', () => {
  // Tests internal implementation
});
```

2. **Use Descriptive Test Names**
```typescript
// Good
it('prevents teacher from downloading resources without authentication', () => {});

// Bad
it('test auth', () => {});
```

3. **Arrange-Act-Assert Structure**
```typescript
it('calculates quiz score correctly', () => {
  // Arrange
  const answers = [
    { questionId: 'q1', correct: true },
    { questionId: 'q2', correct: false }
  ];
  
  // Act
  const score = calculateQuizScore(answers);
  
  // Assert
  expect(score).toBe(50);
});
```

### ❌ Anti-Patterns to Avoid

1. **Testing Implementation Details**
```typescript
// Bad - Testing React hooks directly
expect(result.current.state).toBe('loading');

// Good - Testing user-visible behavior
expect(screen.getByText('Loading...')).toBeInTheDocument();
```

2. **Excessive Mocking**
```typescript
// Bad - Mocking everything
jest.mock('./entire-module');

// Good - Mock only external dependencies
jest.mock('@/services/external-api');
```

3. **Testing Styles**
```typescript
// Bad
expect(button).toHaveStyle('color: red');

// Good
expect(button).toHaveAttribute('aria-disabled', 'true');
```

## Migration Strategy

When refactoring existing tests:

1. **Start with Pure Functions**: Extract and test business logic first
2. **Update Component Tests**: Focus on behavior, add accessibility
3. **Improve Integration Tests**: Ensure proper mocking boundaries
4. **Add Performance Tests**: Measure critical paths

## Performance Testing Guidelines

### Setting Thresholds
```typescript
const PERFORMANCE_THRESHOLDS = {
  UNIT_TEST: 10,        // Pure functions should be fast
  COMPONENT_RENDER: 100, // Initial render budget
  API_RESPONSE: 500,     // API route processing
  INTEGRATION: 1000      // Complex workflows
};
```

### Measurement Pattern
```typescript
const measurePerformance = async (
  name: string,
  fn: () => Promise<void>,
  threshold: number
) => {
  const start = performance.now();
  await fn();
  const duration = performance.now() - start;
  
  console.log(`${name}: ${duration.toFixed(2)}ms`);
  expect(duration).toBeLessThan(threshold);
};
```

## Oak-Specific Testing Examples

### Real Example: Testing formatCurriculumUnits (Current Good Pattern)

```typescript
// src/utils/curriculum/formatting.test.ts - ACTUAL OAK CODE
describe('pluralizeUnits', () => {
  it('one', () => {
    expect(pluralizeUnits(1)).toEqual('unit');
  });
  it('many', () => {
    expect(pluralizeUnits(2)).toEqual('units');
  });
  it('none', () => {
    expect(pluralizeUnits(0)).toEqual('');
  });
});
```

This demonstrates Oak's current good patterns:
- ✅ Pure function with no dependencies
- ✅ Clear test names
- ✅ Edge case coverage
- ✅ No mocking needed

### Real Example: Component Test Anti-Pattern to Fix

```typescript
// src/components/SharedComponents/Card/Card.test.tsx - NEEDS IMPROVEMENT
test('has default padding 24', async () => {
  const { getByTestId } = render(<Card data-testid="test" />);
  expect(getByTestId('test')).toHaveStyle('padding-left: 1.5rem');
});
```

Problems:
- ❌ Tests implementation details (CSS values)
- ❌ Uses data-testid instead of semantic queries
- ❌ No user behavior testing

Improved version:
```typescript
test('provides consistent spacing for content', () => {
  render(
    <Card>
      <h2>Lesson Title</h2>
      <p>Lesson description</p>
    </Card>
  );
  
  const card = screen.getByRole('article');
  expect(card).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /lesson title/i })).toBeInTheDocument();
});
```

### Real Example: API Test Pattern from Oak

```typescript
// src/pages/api/hubspot/contacts/index.test.ts - GOOD PATTERN
test('requires authorization', async () => {
  setGetAuth(mockGetAuthSignedOut);
  const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
    method: 'GET',
  });
  await handler(req, res);
  expect(res._getStatusCode()).toBe(401);
});
```

This shows Oak's good API testing:
- ✅ Clear test intent
- ✅ Proper mocking boundaries
- ✅ Tests authorization
- ✅ Clean arrange-act-assert

## Performance Testing with Oak's Actual Needs

### Curriculum Browser Performance Test

```typescript
describe('CurriculumBrowser Performance', () => {
  it('renders 100 lessons within budget', async () => {
    const lessons = Array(100).fill(null).map((_, i) => ({
      _id: `lesson-${i}`,
      title: `Lesson ${i}: Fractions`,
      subject: 'mathematics',
      keyStage: 'key-stage-2',
      _state: 'published' as const
    }));
    
    const start = performance.now();
    render(<CurriculumLessonList lessons={lessons} />);
    const renderTime = performance.now() - start;
    
    expect(renderTime).toBeLessThan(100); // 100ms for list render
    
    // Also check that virtualization is working
    const visibleItems = screen.getAllByRole('listitem');
    expect(visibleItems.length).toBeLessThan(20); // Should virtualize
  });
});
```

### Quiz Validation Performance

```typescript
describe('Quiz Answer Validation Performance', () => {
  it('validates 50 quiz answers in under 5ms', () => {
    const answers = Array(50).fill(null).map((_, i) => ({
      questionId: `q${i}`,
      type: 'multiple-choice',
      value: `option-${i % 4}`
    }));
    
    const start = performance.now();
    answers.forEach(answer => validateQuizAnswer(answer));
    const duration = performance.now() - start;
    
    expect(duration).toBeLessThan(5);
  });
});
```

## Creating Test Utilities for Oak

### Oak-Specific Render Helper

```typescript
// __tests__/__helpers__/oakRender.tsx
import { renderWithProviders } from './renderWithProviders';
import { axe } from 'jest-axe';

export async function renderWithOakContext(
  ui: React.ReactElement,
  options = {}
) {
  const result = renderWithProviders(ui, {
    // Oak-specific defaults
    initialState: {
      curriculum: { selectedKeyStage: 'key-stage-2' }
    },
    ...options
  });
  
  // Always run accessibility checks in development
  if (process.env.NODE_ENV !== 'production') {
    const axeResults = await axe(result.container);
    expect(axeResults).toHaveNoViolations();
  }
  
  return result;
}
```

### Domain-Specific Mock Builders

```typescript
// __tests__/__helpers__/builders/curriculum.ts
export const curriculumBuilder = {
  lesson: (overrides = {}) => createMockLesson({
    _state: 'published',
    ...overrides
  }),
  
  mathsLesson: (year: string) => createMockLesson({
    subject: 'mathematics',
    keyStage: year <= '2' ? 'key-stage-1' : 'key-stage-2',
    year,
    _state: 'published'
  }),
  
  videoLesson: () => createMockLesson({
    videoMuxPlaybackId: 'test-video-id',
    videoTitle: 'Introduction Video',
    _state: 'published'
  }),
  
  quizLesson: () => createMockLesson({
    hasQuiz: true,
    quizQuestions: [
      { id: 'q1', type: 'multiple-choice', text: 'What is 2+2?' }
    ],
    _state: 'published'
  })
};
```

## Next Steps

1. Apply these patterns to the pure functions identified in `pure-function-opportunities.md`
2. Start with Priority 1 extractions (Quiz, Video, School validation)
3. Establish performance baselines for each test type:
   - Unit tests: <10ms
   - Component tests: <100ms  
   - Integration tests: <500ms
4. Build Oak-specific test utilities following these patterns
5. Create a testing cookbook with real Oak examples

This guide provides the foundation for transforming Oak's testing from 5.2/10 component quality to match the 7.8/10 utility standard through proper test types and patterns, using Oak's actual code as examples.