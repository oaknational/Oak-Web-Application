# Pattern Template: Mock Factory

**Purpose**: Create type-safe, reusable test data factories  
**Applies To**: All domain objects used in tests  
**Complexity**: Medium  
**Test Impact**: High - reduces test setup code by 50%+

## When to Apply This Pattern

Use this pattern when:
- Test setup requires creating complex objects
- Same test data structures are used across multiple tests
- You need realistic but deterministic test data
- Type safety in tests is important
- Test maintenance is becoming difficult

## Base Factory Structure

### 1. Generic Factory Function

```typescript
// src/test-utils/factories/base.ts
export type FactoryFunction<T> = (overrides?: Partial<T>) => T;

export function createFactory<T>(
  defaults: T | (() => T)
): FactoryFunction<T> {
  return (overrides = {}) => {
    const base = typeof defaults === 'function' ? defaults() : defaults;
    return {
      ...base,
      ...overrides,
    } as T;
  };
}
```

### 2. Domain-Specific Factories

```typescript
// src/test-utils/factories/lesson.ts
import { createFactory } from './base';
import type { Lesson, Question } from '@/types/lesson';

// Simple factory
export const createLesson = createFactory<Lesson>({
  id: 'lesson-1',
  title: 'Default Lesson Title',
  description: 'Default lesson description',
  duration: 45,
  subject: 'mathematics',
  keyStage: 'ks3',
  questions: [],
  resources: [],
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
});

// Factory with dynamic defaults
export const createQuestion = createFactory<Question>(() => ({
  id: `question-${Date.now()}-${Math.random()}`,
  text: 'What is 2 + 2?',
  type: 'multiple-choice',
  options: ['2', '3', '4', '5'],
  correctAnswer: '4',
  explanation: 'Basic addition',
  order: 1,
}));
```

### 3. Builder Pattern for Complex Objects

```typescript
// src/test-utils/factories/builders.ts
export class LessonBuilder {
  private lesson: Partial<Lesson> = {};
  
  withId(id: string): this {
    this.lesson.id = id;
    return this;
  }
  
  withTitle(title: string): this {
    this.lesson.title = title;
    return this;
  }
  
  withQuestions(questions: Question[]): this {
    this.lesson.questions = questions;
    return this;
  }
  
  addQuestion(question: Partial<Question> = {}): this {
    const newQuestion = createQuestion(question);
    this.lesson.questions = [...(this.lesson.questions || []), newQuestion];
    return this;
  }
  
  build(): Lesson {
    return createLesson(this.lesson);
  }
}

// Usage
const complexLesson = new LessonBuilder()
  .withTitle('Complex Mathematics Lesson')
  .addQuestion({ text: 'Question 1' })
  .addQuestion({ text: 'Question 2' })
  .addQuestion({ text: 'Question 3' })
  .build();
```

## Advanced Factory Patterns

### 1. Nested Object Factories

```typescript
// Handle deeply nested structures
export const createProgramme = createFactory<Programme>(() => ({
  id: 'programme-1',
  title: 'Year 7 Mathematics',
  units: [
    createUnit({ title: 'Algebra Basics' }),
    createUnit({ title: 'Geometry Introduction' }),
  ],
  metadata: createMetadata(),
}));

export const createUnit = createFactory<Unit>(() => ({
  id: `unit-${Date.now()}`,
  title: 'Default Unit',
  lessons: [
    createLesson({ title: 'Lesson 1' }),
    createLesson({ title: 'Lesson 2' }),
  ],
  assessments: [],
}));
```

### 2. Factory with Faker for Realistic Data

```typescript
import { faker } from '@faker-js/faker';

export const createUser = createFactory<User>(() => ({
  id: faker.string.uuid(),
  email: faker.internet.email(),
  name: faker.person.fullName(),
  school: faker.company.name() + ' School',
  role: faker.helpers.arrayElement(['teacher', 'student', 'admin']),
  createdAt: faker.date.past(),
}));

// Deterministic mode for snapshots
export const createDeterministicUser = createFactory<User>({
  id: 'user-123',
  email: 'test@example.com',
  name: 'Test User',
  school: 'Test School',
  role: 'teacher',
  createdAt: new Date('2024-01-01'),
});
```

### 3. State-Based Factories

```typescript
// Create objects in different states
export const createQuizStates = {
  notStarted: () => createQuiz({
    status: 'not_started',
    startedAt: null,
    completedAt: null,
    score: null,
  }),
  
  inProgress: () => createQuiz({
    status: 'in_progress',
    startedAt: new Date(),
    completedAt: null,
    score: null,
    currentQuestion: 3,
  }),
  
  completed: (score = 85) => createQuiz({
    status: 'completed',
    startedAt: new Date(Date.now() - 600000), // 10 min ago
    completedAt: new Date(),
    score,
    currentQuestion: null,
  }),
};
```

## Integration with Tests

### 1. Basic Usage

```typescript
// In test files
import { createLesson, createUser } from '@/test-utils/factories';

describe('LessonCard', () => {
  it('should display lesson information', () => {
    const lesson = createLesson({
      title: 'Algebra Fundamentals',
      duration: 60,
    });
    
    render(<LessonCard lesson={lesson} />);
    
    expect(screen.getByText('Algebra Fundamentals')).toBeInTheDocument();
    expect(screen.getByText('60 minutes')).toBeInTheDocument();
  });
});
```

### 2. Complex Scenarios

```typescript
describe('QuizRenderer', () => {
  it('should handle quiz completion', () => {
    const quiz = new QuizBuilder()
      .withTitle('Math Quiz')
      .addMultipleChoiceQuestion({
        text: 'What is 2 + 2?',
        correctAnswer: '4',
      })
      .addTrueFalseQuestion({
        text: 'The Earth is flat',
        correctAnswer: 'false',
      })
      .build();
    
    render(<QuizRenderer quiz={quiz} />);
    
    // Test flows with realistic data
  });
});
```

### 3. Factory Composition

```typescript
// Compose factories for integration tests
const createClassroom = () => {
  const teacher = createUser({ role: 'teacher' });
  const students = Array.from({ length: 30 }, (_, i) => 
    createUser({ 
      role: 'student',
      name: `Student ${i + 1}`,
    })
  );
  
  const programme = createProgramme({
    assignedTo: [teacher.id, ...students.map(s => s.id)],
  });
  
  return { teacher, students, programme };
};
```

## Best Practices

### 1. Keep Factories Close to Types

```typescript
// src/types/quiz.ts
export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
}

// src/test-utils/factories/quiz.ts
import type { Quiz } from '@/types/quiz';

export const createQuiz = createFactory<Quiz>({
  // Factory implementation
});
```

### 2. Use Meaningful Defaults

```typescript
// Good - defaults make sense for most tests
export const createLesson = createFactory<Lesson>({
  title: 'Introduction to Algebra',
  duration: 45,
  subject: 'mathematics',
});

// Bad - meaningless defaults
export const createLesson = createFactory<Lesson>({
  title: 'asdfasdf',
  duration: 999,
  subject: 'unknown',
});
```

### 3. Document Factory Behavior

```typescript
/**
 * Creates a Lesson object with sensible defaults.
 * 
 * @example
 * // Basic usage
 * const lesson = createLesson();
 * 
 * // With overrides
 * const mathLesson = createLesson({
 *   subject: 'mathematics',
 *   keyStage: 'ks4',
 * });
 */
export const createLesson = createFactory<Lesson>({
  // ...
});
```

## Anti-Patterns to Avoid

❌ **Don't create overly complex factories**
```typescript
// Bad - too much logic in factory
export const createLesson = (options) => {
  if (options.type === 'math') {
    // 50 lines of math-specific logic
  } else if (options.type === 'english') {
    // 50 lines of english-specific logic
  }
  // ...
};
```

❌ **Don't mutate shared factory data**
```typescript
// Bad - mutates shared array
const defaultQuestions = [];
export const createQuiz = () => ({
  questions: defaultQuestions, // Shared reference!
});

// Good - create new array each time
export const createQuiz = () => ({
  questions: [],
});
```

❌ **Don't forget type safety**
```typescript
// Bad - loses type information
export const createLesson = (overrides: any) => ({
  ...defaults,
  ...overrides,
});

// Good - maintains type safety
export const createLesson = createFactory<Lesson>({
  // ...
});
```

## Success Checklist

- [ ] Factory created for each domain object
- [ ] Type safety maintained throughout
- [ ] Meaningful defaults provided
- [ ] Builder pattern for complex objects
- [ ] State variations available
- [ ] Documentation with examples
- [ ] No shared mutable state
- [ ] Reduced test setup by 50%+
- [ ] Easy to extend and maintain
- [ ] Integrated with existing tests

## Performance Considerations

- Factories should be fast (<1ms per creation)
- Use lazy evaluation for expensive operations
- Cache deterministic values when appropriate
- Avoid unnecessary object cloning

## Related Patterns

- Pure Function Extraction (functions to test)
- Hook Testing Template (uses factories)
- Test Utilities Pattern (complementary tools)