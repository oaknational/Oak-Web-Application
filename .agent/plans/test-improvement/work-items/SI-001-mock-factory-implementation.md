# Implementation Guide: SI-001 - Implement Mock Factory Patterns

**Strategic Investment ID**: SI-001  
**Title**: Implement Mock Factory Patterns  
**Assignee**: Human  
**Complexity**: Medium  
**Expected Outcome**: Type-safe, reusable test data factories reducing test setup by 60%

## Pre-Implementation Checklist

- [ ] Review existing mock data patterns
- [ ] Identify most commonly mocked entities
- [ ] Check TypeScript types for all entities
- [ ] Plan factory hierarchy
- [ ] Consider builder pattern needs

## Implementation Steps

### Step 1: Analyze Current Mock Patterns

**Audit existing mocks**:
```bash
# Find existing mock data
grep -r "mock\|Mock" src --include="*.test.*" | grep -i "data\|object" | head -20

# Find repeated test data setup
grep -r "const.*=.*{" src --include="*.test.*" -A 5 | grep -E "(lesson|quiz|user|programme)"

# Identify test data files
find src -name "*mock*" -o -name "*fixture*" -o -name "*factory*" | grep -v node_modules
```

**Common entities needing factories**:
- Lesson (complex, nested)
- Quiz (with questions)
- User (various roles)
- Programme (with units)
- School (with validation)

### Step 2: Create Base Factory Infrastructure

**File**: `/src/test-utils/factories/base.ts`

```typescript
/**
 * Base factory infrastructure for type-safe test data
 */

/**
 * Factory function type
 */
export type FactoryFunction<T> = (overrides?: DeepPartial<T>) => T;

/**
 * Deep partial type for nested overrides
 */
export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

/**
 * Create a factory with defaults and overrides
 */
export function createFactory<T>(
  defaults: T | (() => T)
): FactoryFunction<T> {
  return (overrides = {}) => {
    const base = typeof defaults === 'function' ? defaults() : defaults;
    return deepMerge(base, overrides) as T;
  };
}

/**
 * Deep merge for nested objects
 */
function deepMerge<T>(target: T, source: DeepPartial<T>): T {
  if (!source) return target;
  
  const output = { ...target };
  
  Object.keys(source).forEach((key) => {
    const sourceValue = source[key as keyof T];
    const targetValue = target[key as keyof T];
    
    if (isObject(targetValue) && isObject(sourceValue)) {
      (output as any)[key] = deepMerge(targetValue, sourceValue as any);
    } else if (sourceValue !== undefined) {
      (output as any)[key] = sourceValue;
    }
  });
  
  return output;
}

function isObject(item: unknown): item is Record<string, unknown> {
  return item !== null && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Create a sequence generator for unique IDs
 */
export function createSequence(prefix: string): () => string {
  let counter = 0;
  return () => `${prefix}-${++counter}`;
}

/**
 * Create random selector from array
 */
export function randomFrom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}
```

### Step 3: Create Domain-Specific Factories

**File**: `/src/test-utils/factories/lesson.factory.ts`

```typescript
import { createFactory, createSequence } from './base';
import type { Lesson, LessonResource, QuizQuestion } from '@/types/lesson';

const lessonIdSequence = createSequence('lesson');
const questionIdSequence = createSequence('question');

/**
 * Create a quiz question
 */
export const createQuizQuestion = createFactory<QuizQuestion>(() => ({
  id: questionIdSequence(),
  type: 'multiple-choice',
  question: 'What is 2 + 2?',
  options: ['2', '3', '4', '5'],
  correctAnswer: '4',
  explanation: '2 + 2 equals 4',
  order: 1,
}));

/**
 * Create a lesson resource
 */
export const createLessonResource = createFactory<LessonResource>(() => ({
  id: createSequence('resource')(),
  type: 'worksheet',
  title: 'Practice Worksheet',
  url: 'https://example.com/worksheet.pdf',
  fileSize: 1024 * 500, // 500KB
  format: 'pdf',
}));

/**
 * Create a complete lesson
 */
export const createLesson = createFactory<Lesson>(() => ({
  id: lessonIdSequence(),
  slug: 'introduction-to-algebra',
  title: 'Introduction to Algebra',
  description: 'Learn the basics of algebraic expressions',
  subject: 'mathematics',
  keyStage: 'ks3',
  yearGroup: 7,
  duration: 60,
  resources: [
    createLessonResource({ type: 'worksheet' }),
    createLessonResource({ type: 'slide-deck' }),
  ],
  quizQuestions: [
    createQuizQuestion(),
    createQuizQuestion({ 
      question: 'What is x if x + 3 = 7?',
      options: ['2', '3', '4', '5'],
      correctAnswer: '4',
    }),
  ],
  videoUrl: 'https://example.com/lesson-video.mp4',
  transcript: 'Welcome to our lesson on algebra...',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
}));
```

**File**: `/src/test-utils/factories/user.factory.ts`

```typescript
import { createFactory, createSequence, randomFrom } from './base';
import type { User, UserRole } from '@/types/user';

const userIdSequence = createSequence('user');
const schools = ['Oak Primary', 'Elm Academy', 'Maple High School'];

/**
 * Base user factory
 */
const createBaseUser = createFactory<Omit<User, 'role'>>(() => ({
  id: userIdSequence(),
  email: `test-${Date.now()}@example.com`,
  name: 'Test User',
  school: randomFrom(schools),
  createdAt: new Date(),
  lastLoginAt: new Date(),
  isActive: true,
}));

/**
 * Create a teacher user
 */
export const createTeacher = createFactory<User>(() => ({
  ...createBaseUser(),
  role: 'teacher' as UserRole,
  subjects: ['mathematics', 'science'],
  keyStages: ['ks3', 'ks4'],
}));

/**
 * Create a student user
 */
export const createStudent = createFactory<User>(() => ({
  ...createBaseUser(),
  role: 'student' as UserRole,
  yearGroup: 9,
  className: '9A',
}));

/**
 * Create an admin user
 */
export const createAdmin = createFactory<User>(() => ({
  ...createBaseUser(),
  role: 'admin' as UserRole,
  permissions: ['manage_users', 'manage_content', 'view_analytics'],
}));
```

### Step 4: Create Builder Pattern for Complex Objects

**File**: `/src/test-utils/factories/builders/programme.builder.ts`

```typescript
import { createFactory } from '../base';
import { createLesson } from '../lesson.factory';
import type { Programme, Unit, Lesson } from '@/types/curriculum';

export class ProgrammeBuilder {
  private programme: Partial<Programme> = {};
  private units: Unit[] = [];
  
  constructor() {
    this.programme = {
      id: `programme-${Date.now()}`,
      title: 'Year 7 Mathematics',
      subject: 'mathematics',
      keyStage: 'ks3',
      yearGroup: 7,
    };
  }
  
  withTitle(title: string): this {
    this.programme.title = title;
    return this;
  }
  
  withSubject(subject: string): this {
    this.programme.subject = subject;
    return this;
  }
  
  addUnit(title: string, lessons: Lesson[] = []): this {
    const unit: Unit = {
      id: `unit-${this.units.length + 1}`,
      title,
      order: this.units.length + 1,
      lessons: lessons.length > 0 ? lessons : [
        createLesson({ title: `${title} - Lesson 1` }),
        createLesson({ title: `${title} - Lesson 2` }),
      ],
    };
    
    this.units.push(unit);
    return this;
  }
  
  addEmptyUnit(title: string): this {
    return this.addUnit(title, []);
  }
  
  build(): Programme {
    return {
      ...this.programme,
      units: this.units,
      totalLessons: this.units.reduce((sum, unit) => sum + unit.lessons.length, 0),
      estimatedDuration: this.units.reduce(
        (sum, unit) => sum + unit.lessons.reduce((s, l) => s + l.duration, 0),
        0
      ),
    } as Programme;
  }
}

// Helper function
export function buildProgramme(): ProgrammeBuilder {
  return new ProgrammeBuilder();
}
```

### Step 5: Create Composite Factories

**File**: `/src/test-utils/factories/scenarios.ts`

```typescript
import { createTeacher, createStudent } from './user.factory';
import { buildProgramme } from './builders/programme.builder';
import { createLesson } from './lesson.factory';

/**
 * Create a complete classroom scenario
 */
export function createClassroomScenario(options = {}) {
  const teacher = createTeacher({
    name: 'Ms. Johnson',
    ...options,
  });
  
  const students = Array.from({ length: 25 }, (_, i) => 
    createStudent({
      name: `Student ${i + 1}`,
      className: '9A',
    })
  );
  
  const programme = buildProgramme()
    .withTitle('Year 9 Mathematics')
    .addUnit('Algebra Basics')
    .addUnit('Geometry Introduction')
    .addUnit('Statistics and Probability')
    .build();
  
  return {
    teacher,
    students,
    programme,
    currentLesson: programme.units[0].lessons[0],
  };
}

/**
 * Create quiz attempt scenario
 */
export function createQuizAttemptScenario() {
  const student = createStudent();
  const lesson = createLesson({
    quizQuestions: Array.from({ length: 10 }, (_, i) => ({
      id: `q-${i}`,
      type: 'multiple-choice',
      question: `Question ${i + 1}`,
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 'B',
      order: i + 1,
    })),
  });
  
  const answers = lesson.quizQuestions.map((q, i) => ({
    questionId: q.id,
    answer: i < 7 ? 'B' : 'A', // 70% correct
  }));
  
  return {
    student,
    lesson,
    answers,
    expectedScore: 70,
  };
}
```

### Step 6: Integration with Tests

**Example usage in tests**:
```typescript
import { createLesson, createTeacher, buildProgramme } from '@/test-utils/factories';

describe('LessonView', () => {
  it('should display lesson information', () => {
    const lesson = createLesson({
      title: 'Custom Lesson Title',
      duration: 45,
    });
    
    render(<LessonView lesson={lesson} />);
    
    expect(screen.getByText('Custom Lesson Title')).toBeInTheDocument();
    expect(screen.getByText('45 minutes')).toBeInTheDocument();
  });
  
  it('should handle complex programme structure', () => {
    const programme = buildProgramme()
      .withTitle('Advanced Mathematics')
      .addUnit('Calculus', [
        createLesson({ title: 'Introduction to Derivatives' }),
        createLesson({ title: 'Integration Basics' }),
      ])
      .addUnit('Linear Algebra')
      .build();
    
    expect(programme.units).toHaveLength(2);
    expect(programme.totalLessons).toBe(4);
  });
});
```

### Step 7: Add Factory Registry

**File**: `/src/test-utils/factories/index.ts`

```typescript
// Re-export all factories
export * from './base';
export * from './lesson.factory';
export * from './user.factory';
export * from './quiz.factory';
export * from './school.factory';
export * from './builders/programme.builder';
export * from './scenarios';

// Factory registry for easy access
export const factories = {
  lesson: createLesson,
  teacher: createTeacher,
  student: createStudent,
  admin: createAdmin,
  quizQuestion: createQuizQuestion,
  programme: buildProgramme,
  // Add more as created
};
```

## Rollback Plan

Factory pattern is additive:
1. Existing tests continue to work
2. Gradually migrate to factories
3. Keep both patterns during transition
4. Document migration path

## Success Verification

- [ ] Common entities have factories
- [ ] 60%+ reduction in test setup code
- [ ] Type safety maintained throughout
- [ ] Factories used in new tests
- [ ] Documentation includes examples

## Best Practices

1. **Keep factories simple** - Don't add business logic
2. **Use realistic defaults** - Make tests meaningful
3. **Support overrides** - Flexibility is key
4. **Document patterns** - Team adoption requires clarity
5. **Version carefully** - Breaking changes affect many tests

This investment significantly improves test maintainability and reduces duplication across the test suite.