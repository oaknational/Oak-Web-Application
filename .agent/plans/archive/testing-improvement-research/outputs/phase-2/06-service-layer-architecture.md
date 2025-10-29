# Service Layer Architecture Document

**Phase**: 2.2 - Architecture Planning  
**Type**: Planning Document  
**Purpose**: Define patterns for separating business logic from UI components to improve testability

## Executive Summary

This document defines service layer patterns for the Oak Web Application, building on the successful patterns established in Phase 2.1. The goal is to create a sustainable architecture that naturally leads to testable code while maintaining the existing Next.js and React patterns.

## Current State Analysis

### Existing Patterns

1. **Mixed Concerns in Components**
   - Business logic embedded in React components
   - Example: SubjectPhasePicker.tsx (1,468 lines) contains validation, state management, and UI
   - Difficult to test logic in isolation

2. **Limited Service Layer**
   - Few dedicated service files found
   - API routes contain business logic directly
   - Analytics and error reporting have some separation

3. **Data Fetching**
   - Next.js pages use getServerSideProps/getStaticProps
   - Client-side fetching mixed with component logic
   - No consistent data layer abstraction

## Proposed Service Layer Architecture

### Core Principles

1. **Separation of Concerns**
   - UI components handle presentation only
   - Business logic lives in service layer
   - Data fetching abstracted from components

2. **Testability First**
   - Pure functions wherever possible
   - Dependency injection for external services
   - Mock-friendly interfaces

3. **Incremental Adoption**
   - Can be applied file-by-file
   - No big-bang refactoring required
   - Compatible with existing patterns

### Service Layer Structure

```
src/
├── services/                    # Business logic layer
│   ├── curriculum/             # Domain services
│   │   ├── quiz.service.ts
│   │   ├── lesson.service.ts
│   │   └── programme.service.ts
│   ├── user/                   # User-related services
│   │   ├── auth.service.ts
│   │   └── profile.service.ts
│   └── shared/                 # Cross-cutting services
│       ├── analytics.service.ts
│       └── error.service.ts
├── repositories/               # Data access layer
│   ├── curriculum.repository.ts
│   └── user.repository.ts
└── utils/                      # Pure utility functions
    ├── quiz/
    ├── video/
    └── school/
```

### Pattern Examples

#### 1. Service Pattern (Building on Phase 2.1)

```typescript
// src/services/curriculum/quiz.service.ts
import { validateQuizAnswer, calculateQuizScore } from '@/utils/quiz/validation';
import { QuizRepository } from '@/repositories/quiz.repository';
import type { Quiz, QuizAttempt, QuizResult } from '@/types/quiz';

export interface QuizService {
  validateAnswer(questionId: string, answer: string): boolean;
  calculateScore(attempt: QuizAttempt): number;
  submitQuiz(quizId: string, answers: Map<string, string>): Promise<QuizResult>;
}

export class QuizServiceImpl implements QuizService {
  constructor(private repository: QuizRepository) {}

  validateAnswer(questionId: string, answer: string): boolean {
    const question = this.repository.getQuestion(questionId);
    return validateQuizAnswer(answer, question);
  }

  calculateScore(attempt: QuizAttempt): number {
    return calculateQuizScore(attempt.answers, attempt.questions);
  }

  async submitQuiz(quizId: string, answers: Map<string, string>): Promise<QuizResult> {
    // Business logic here, not in component
    const quiz = await this.repository.getQuiz(quizId);
    const score = this.calculateScore({ quiz, answers });
    
    return this.repository.saveResult({
      quizId,
      answers,
      score,
      completedAt: new Date(),
    });
  }
}
```

#### 2. Repository Pattern

```typescript
// src/repositories/quiz.repository.ts
export interface QuizRepository {
  getQuiz(id: string): Promise<Quiz>;
  getQuestion(id: string): Question;
  saveResult(result: QuizResult): Promise<QuizResult>;
}

// Implementation can vary (API, GraphQL, etc.)
export class ApiQuizRepository implements QuizRepository {
  async getQuiz(id: string): Promise<Quiz> {
    const response = await fetch(`/api/quiz/${id}`);
    return response.json();
  }
  
  // ... other methods
}
```

#### 3. Component Integration

```typescript
// src/components/QuizRenderer/QuizRenderer.tsx
import { useQuizService } from '@/hooks/useQuizService';

export function QuizRenderer({ quizId }: Props) {
  const quizService = useQuizService();
  const [answers, setAnswers] = useState(new Map());
  
  const handleSubmit = async () => {
    // Component only orchestrates, no business logic
    const result = await quizService.submitQuiz(quizId, answers);
    // Handle UI updates
  };
  
  // Pure presentation logic
  return <QuizUI onSubmit={handleSubmit} />;
}
```

### Migration Strategy

#### Phase 1: Extract Pure Functions (Completed in Phase 2.1)
- ✅ Quiz validation logic
- ✅ Video progress calculations
- ✅ School data validation

#### Phase 2: Create Service Interfaces
1. Define service interfaces for each domain
2. Start with high-value areas (quiz, lesson, user)
3. Keep interfaces small and focused

#### Phase 3: Implement Services
1. Create service implementations
2. Use existing pure functions
3. Add repository abstraction as needed

#### Phase 4: Refactor Components
1. Update components to use services
2. Remove business logic from components
3. Improve component testability

### TypeScript Interface Patterns

#### Service Factory Pattern

```typescript
// src/services/index.ts
export interface ServiceContext {
  quizService: QuizService;
  lessonService: LessonService;
  userService: UserService;
}

export function createServices(config: AppConfig): ServiceContext {
  // Dependency injection
  const quizRepo = new ApiQuizRepository(config.apiUrl);
  const quizService = new QuizServiceImpl(quizRepo);
  
  return {
    quizService,
    // ... other services
  };
}
```

#### Hook Pattern for Components

```typescript
// src/hooks/useServices.ts
export function useQuizService(): QuizService {
  const services = useContext(ServiceContext);
  return services.quizService;
}
```

### Testing Strategy

#### 1. Service Testing

```typescript
// src/services/curriculum/quiz.service.test.ts
describe('QuizService', () => {
  let service: QuizService;
  let mockRepository: jest.Mocked<QuizRepository>;
  
  beforeEach(() => {
    mockRepository = createMockQuizRepository();
    service = new QuizServiceImpl(mockRepository);
  });
  
  it('should calculate quiz score correctly', async () => {
    // Test business logic in isolation
    const result = await service.calculateScore(mockAttempt);
    expect(result).toBe(85);
  });
});
```

#### 2. Component Testing

```typescript
// Components become much simpler to test
describe('QuizRenderer', () => {
  it('should submit quiz through service', async () => {
    const mockService = createMockQuizService();
    render(<QuizRenderer quizId="123" />, {
      serviceContext: { quizService: mockService }
    });
    
    // Test only component behavior, not business logic
    fireEvent.click(screen.getByText('Submit'));
    expect(mockService.submitQuiz).toHaveBeenCalled();
  });
});
```

## Implementation Examples

### Example 1: Video Service (Building on Phase 2.1)

```typescript
// src/services/media/video.service.ts
import { 
  calculatePlayedPercentage, 
  isVideoComplete 
} from '@/utils/video/progress';

export class VideoService {
  trackProgress(currentTime: number, duration: number): VideoProgress {
    const percentage = calculatePlayedPercentage(currentTime, duration);
    const complete = isVideoComplete(currentTime, duration);
    
    if (complete) {
      this.analytics.track('video_completed');
    }
    
    return { percentage, complete };
  }
}
```

### Example 2: School Validation Service

```typescript
// src/services/onboarding/school.service.ts
import { 
  validateSchoolURN, 
  validatePostcode,
  isSchoolDataComplete 
} from '@/utils/school/validation';

export class SchoolService {
  async validateAndSaveSchool(data: SchoolData): Promise<ValidationResult> {
    // Use pure functions for validation
    const validation = isSchoolDataComplete(data);
    
    if (!validation.isValid) {
      return validation;
    }
    
    // Business logic for saving
    return this.repository.saveSchool(data);
  }
}
```

## Benefits

1. **Improved Testability**
   - Business logic tested without React
   - Fast unit tests for services
   - Simplified component tests

2. **Better Organization**
   - Clear separation of concerns
   - Easy to find and modify logic
   - Reduced component complexity

3. **Reusability**
   - Services can be used across components
   - Logic shared between client and server
   - Consistent behavior

4. **Type Safety**
   - Well-defined interfaces
   - Dependency injection
   - Compile-time guarantees

## Risks and Mitigations

### Risk: Over-Engineering
**Mitigation**: Start small, extract only when it improves testability

### Risk: Team Resistance
**Mitigation**: Show value through examples, incremental adoption

### Risk: Performance Overhead
**Mitigation**: Services are thin layers, minimal overhead

## Next Steps

1. Review and approve this architecture
2. Create component decomposition guide
3. Define error handling patterns
4. Standardize data fetching

## Success Metrics

- Component size reduced by 40%+
- Business logic test coverage >90%
- Service layer adoption in new features
- Reduced time to test new features

## Conclusion

This service layer architecture provides a clear path to better testability while respecting the existing Next.js application structure. By building on the Phase 2.1 patterns and focusing on incremental adoption, we can improve code quality without disrupting development.