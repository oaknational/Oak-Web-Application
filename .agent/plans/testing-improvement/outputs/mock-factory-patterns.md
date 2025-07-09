# Mock Factory Patterns Guide

**Purpose**: Establish consistent, type-safe mock data creation patterns for Oak's test suite  
**Goal**: Reduce test brittleness, improve maintainability, enable easy test data creation  
**Impact**: All 641 test files can benefit from standardized mock patterns

## Core Principles

### 1. Type Safety First
All mock factories must be fully typed using Oak's TypeScript interfaces

### 2. Sensible Defaults
Every factory should work with zero arguments, providing realistic data

### 3. Flexible Overrides
Support partial overrides for any property without breaking types

### 4. Domain Alignment
Mock data should reflect Oak's educational domain (lessons, pupils, teachers)

## Basic Factory Pattern

### Foundation Pattern
```typescript
// Base pattern for all factories
export function createMock<T>(
  defaults: T,
  overrides: Partial<T> = {}
): T {
  return {
    ...defaults,
    ...overrides
  };
}
```

### Simple Factory Example
```typescript
// src/__tests__/__helpers__/mockData/user.ts
import { Teacher } from '@/types';

const defaultTeacher: Teacher = {
  id: 'teacher-123',
  email: 'teacher@school.org.uk',
  name: 'Sarah Johnson',
  school: {
    urn: '123456',
    name: 'Oakwood Primary School',
    postcode: 'SW1A 1AA'
  },
  subjects: ['mathematics', 'english'],
  keyStages: ['ks1', 'ks2'],
  hasOnboarded: true,
  createdAt: new Date('2024-01-01'),
};

export function createMockTeacher(overrides: Partial<Teacher> = {}): Teacher {
  return createMock(defaultTeacher, overrides);
}
```

## Advanced Factory Patterns

### 1. Nested Object Factories
```typescript
// Handle nested objects gracefully
export function createMockLesson(overrides: DeepPartial<Lesson> = {}): Lesson {
  const defaultLesson: Lesson = {
    id: 'lesson-123',
    title: 'Introduction to Fractions',
    subject: 'mathematics',
    keyStage: 'ks2',
    duration: 60,
    resources: {
      slides: createMockSlides(),
      worksheet: createMockWorksheet(),
      video: createMockVideo(),
    },
    quiz: createMockQuiz(),
  };

  return {
    ...defaultLesson,
    ...overrides,
    resources: {
      ...defaultLesson.resources,
      ...overrides.resources,
    },
    quiz: overrides.quiz || defaultLesson.quiz,
  };
}
```

### 2. Builder Pattern for Complex Objects
```typescript
// For objects with many optional configurations
export class LessonBuilder {
  private lesson: Partial<Lesson> = {};

  constructor() {
    this.lesson = createMockLesson();
  }

  withTitle(title: string): this {
    this.lesson.title = title;
    return this;
  }

  withSubject(subject: Subject): this {
    this.lesson.subject = subject;
    this.lesson.subjectSlug = subject.toLowerCase().replace(' ', '-');
    return this;
  }

  withQuiz(questions: QuizQuestion[]): this {
    this.lesson.quiz = createMockQuiz({ questions });
    return this;
  }

  forKeyStage(keyStage: KeyStage): this {
    this.lesson.keyStage = keyStage;
    // Adjust year groups based on key stage
    if (keyStage === 'ks1') {
      this.lesson.yearGroup = 'year-1';
    }
    return this;
  }

  build(): Lesson {
    return this.lesson as Lesson;
  }
}

// Usage
const mathsLesson = new LessonBuilder()
  .withTitle('Adding Fractions')
  .withSubject('Mathematics')
  .forKeyStage('ks2')
  .withQuiz([questionFactory.fraction()])
  .build();
```

### 3. Factory Collections
```typescript
// Group related factories
export const curriculumFactories = {
  lesson: createMockLesson,
  unit: createMockUnit,
  programme: createMockProgramme,
  
  // Convenience methods
  mathsLesson: (overrides = {}) => 
    createMockLesson({ subject: 'mathematics', ...overrides }),
  
  englishLesson: (overrides = {}) => 
    createMockLesson({ subject: 'english', ...overrides }),
  
  ks1Lesson: (overrides = {}) => 
    createMockLesson({ keyStage: 'ks1', yearGroup: 'year-1', ...overrides }),
  
  // Create related sets
  createUnit: (lessonCount = 5) => {
    const lessons = Array.from({ length: lessonCount }, (_, i) => 
      createMockLesson({ 
        id: `lesson-${i}`,
        lessonNumber: i + 1,
        title: `Lesson ${i + 1}` 
      })
    );
    
    return createMockUnit({ lessons });
  }
};
```

### 4. State-Based Factories
```typescript
// Different states of the same object
export const lessonStates = {
  draft: (overrides = {}) => 
    createMockLesson({ 
      _state: 'draft',
      published: false,
      ...overrides 
    }),
  
  published: (overrides = {}) => 
    createMockLesson({ 
      _state: 'published',
      published: true,
      publishedDate: new Date(),
      ...overrides 
    }),
  
  archived: (overrides = {}) => 
    createMockLesson({ 
      _state: 'archived',
      published: false,
      archivedDate: new Date(),
      ...overrides 
    }),
};
```

## Domain-Specific Patterns for Oak

### 1. Quiz Answer Factories
```typescript
export const answerFactories = {
  multipleChoice: (correct = false): MCAnswer => ({
    id: `answer-${Date.now()}`,
    text: 'Answer option',
    correct,
    feedback: correct ? 'Well done!' : 'Try again',
  }),

  shortAnswer: (text: string): ShortAnswer => ({
    id: `answer-${Date.now()}`,
    text,
    acceptable: [text, text.toLowerCase()],
  }),

  ordering: (items: string[]): OrderAnswer => ({
    id: `answer-${Date.now()}`,
    items: items.map((item, index) => ({
      id: `item-${index}`,
      text: item,
      correctPosition: index
    })),
  }),
};

// Create complete quiz
export function createMockQuiz(config: {
  questionCount?: number;
  type?: QuestionType;
} = {}): Quiz {
  const { questionCount = 5, type = 'mixed' } = config;
  
  const questions = Array.from({ length: questionCount }, (_, i) => {
    if (type === 'mixed') {
      return i % 2 === 0 
        ? createMCQuestion()
        : createShortAnswerQuestion();
    }
    return createQuestionByType(type);
  });

  return {
    id: 'quiz-123',
    questions,
    passingScore: 70,
  };
}
```

### 2. Curriculum Structure Factories
```typescript
// Maintain curriculum relationships
export function createCurriculumPath(depth: {
  programme?: boolean;
  units?: number;
  lessonsPerUnit?: number;
} = {}): CurriculumData {
  const { 
    programme = true, 
    units = 3, 
    lessonsPerUnit = 5 
  } = depth;

  if (!programme) {
    return { lessons: [createMockLesson()] };
  }

  const prog = createMockProgramme();
  
  prog.units = Array.from({ length: units }, (_, unitIndex) => {
    const unit = createMockUnit({
      order: unitIndex + 1,
      programmeSlug: prog.slug,
    });
    
    unit.lessons = Array.from({ length: lessonsPerUnit }, (_, lessonIndex) => 
      createMockLesson({
        unitSlug: unit.slug,
        lessonNumber: lessonIndex + 1,
        order: lessonIndex + 1,
      })
    );
    
    return unit;
  });

  return prog;
}
```

### 3. User Journey Factories
```typescript
// Create data for complete user journeys
export const journeyFactories = {
  teacherWithContent: () => {
    const teacher = createMockTeacher();
    const savedUnits = [
      createMockUnit({ savedBy: teacher.id }),
      createMockUnit({ savedBy: teacher.id }),
    ];
    
    return { teacher, savedUnits };
  },

  pupilLessonProgress: () => {
    const pupil = createMockPupil();
    const lesson = createMockLesson();
    const progress = createMockProgress({
      pupilId: pupil.id,
      lessonId: lesson.id,
      sectionsCompleted: ['intro', 'video'],
      quizScore: 80,
    });
    
    return { pupil, lesson, progress };
  },
};
```

## Mock API Response Factories

### Success Response Pattern
```typescript
export function createMockApiResponse<T>(
  data: T,
  overrides: Partial<ApiResponse<T>> = {}
): ApiResponse<T> {
  return {
    data,
    status: 'success',
    code: 200,
    timestamp: new Date().toISOString(),
    ...overrides,
  };
}

// Error response
export function createMockApiError(
  message: string,
  code = 400
): ApiErrorResponse {
  return {
    error: {
      message,
      code,
      field: null,
    },
    status: 'error',
    timestamp: new Date().toISOString(),
  };
}
```

## Testing with Factories

### 1. Simple Test Case
```typescript
it('displays lesson information', () => {
  const lesson = createMockLesson({
    title: 'Photosynthesis',
    subject: 'biology',
  });
  
  render(<LessonCard lesson={lesson} />);
  
  expect(screen.getByText('Photosynthesis')).toBeInTheDocument();
  expect(screen.getByText('Biology')).toBeInTheDocument();
});
```

### 2. Complex Scenario Test
```typescript
it('handles teacher downloading resources', async () => {
  const teacher = createMockTeacher();
  const lesson = new LessonBuilder()
    .withTitle('Rivers and Mountains')
    .withSubject('Geography')
    .forKeyStage('ks3')
    .build();
    
  const { downloadResources } = renderWithTeacherContext(
    <LessonResources lesson={lesson} />,
    { user: teacher }
  );
  
  await downloadResources(['worksheet', 'slides']);
  
  expect(trackingMock).toHaveBeenCalledWith('resource_download', {
    lessonId: lesson.id,
    resources: ['worksheet', 'slides'],
    teacherId: teacher.id,
  });
});
```

## Best Practices

### 1. Location and Organization
```
__tests__/
├── __helpers__/
│   ├── mockData/
│   │   ├── index.ts         # Re-export all factories
│   │   ├── curriculum.ts    # Lesson, unit, programme
│   │   ├── users.ts         # Teacher, pupil, school
│   │   ├── quiz.ts          # Quiz questions, answers
│   │   └── api.ts           # API responses
│   └── builders/
│       ├── LessonBuilder.ts
│       └── QuizBuilder.ts
```

### 2. Naming Conventions
- Prefix with `createMock` for simple factories
- Use `Builder` suffix for builder pattern
- Group by domain in objects (`curriculumFactories`, `userFactories`)

### 3. Type Safety
```typescript
// Use branded types for IDs
type LessonId = string & { __brand: 'LessonId' };
type TeacherId = string & { __brand: 'TeacherId' };

// Ensure type safety in factories
export function createMockLesson(
  overrides: Partial<Lesson> = {}
): Lesson & { id: LessonId } {
  return {
    ...defaultLesson,
    ...overrides,
    id: `lesson-${Date.now()}` as LessonId,
  };
}
```

### 4. Performance Considerations
```typescript
// Lazy initialization for expensive mocks
let _largeCurriculumData: CurriculumData;

export function getLargeCurriculumData(): CurriculumData {
  if (!_largeCurriculumData) {
    _largeCurriculumData = createCurriculumPath({
      units: 20,
      lessonsPerUnit: 10,
    });
  }
  return _largeCurriculumData;
}

// Reset between tests
afterEach(() => {
  _largeCurriculumData = undefined;
});
```

## Integration with MSW

```typescript
// Combine factories with MSW handlers
export const handlers = [
  rest.get('/api/lessons/:id', (req, res, ctx) => {
    const lesson = createMockLesson({ 
      id: req.params.id as string 
    });
    
    return res(
      ctx.status(200),
      ctx.json(createMockApiResponse(lesson))
    );
  }),
  
  rest.post('/api/quiz/submit', (req, res, ctx) => {
    const score = Math.floor(Math.random() * 100);
    
    return res(
      ctx.status(200),
      ctx.json(createMockApiResponse({
        score,
        passed: score >= 70,
        feedback: score >= 70 ? 'Well done!' : 'Keep practicing!',
      }))
    );
  }),
];
```

## Migration Strategy

1. **Identify existing patterns** in `__tests__/__helpers__/`
2. **Standardize naming** across all mock files
3. **Extract common patterns** to shared utilities
4. **Add TypeScript types** to all factories
5. **Document usage** in test style guide

This comprehensive guide provides Oak with patterns to create maintainable, type-safe test data across all 641 test files.