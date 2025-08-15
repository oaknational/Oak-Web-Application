# Pattern Template: Pure Function Extraction

**Purpose**: Extract testable logic from React components to pure utility functions  
**Applies To**: Business logic, calculations, validations, formatting  
**Complexity**: Low  
**Test Impact**: High - enables unit testing with 100% coverage

## When to Apply This Pattern

Use this pattern when you find:
- Logic inside React components that doesn't depend on React state/props
- Complex calculations or validations mixed with UI code
- Functions that could be reused across components
- Logic that's hard to test due to component coupling

## Step-by-Step Process

### 1. Identify Extractable Logic

Look for patterns like:
```typescript
// Inside component
const isValid = someCondition && otherCondition && !invalidCase;
const score = (correct / total) * 100;
const formatted = value.toString().padStart(2, '0');
```

### 2. Create Utility Module Structure

```typescript
// src/utils/[domain]/[functionality].ts
import type { DomainType } from '@/types/[domain]';

// Group related functions together
export function validateDomainItem(item: DomainType): boolean {
  // Extracted logic
}

export function calculateDomainMetric(data: DomainType[]): number {
  // Extracted calculation
}
```

### 3. Extract with Type Safety

```typescript
// Before (in component)
const handleValidation = () => {
  if (!answer || answer.length === 0) return false;
  if (question.type === 'multiple' && !answer.includes(correct)) return false;
  return true;
};

// After (in utils)
export function validateAnswer(
  answer: string | string[],
  question: Question,
  correctAnswer: string
): boolean {
  if (!answer || (Array.isArray(answer) && answer.length === 0)) {
    return false;
  }
  
  if (question.type === 'multiple' && Array.isArray(answer)) {
    return answer.includes(correctAnswer);
  }
  
  return answer === correctAnswer;
}
```

### 4. Create Comprehensive Tests

```typescript
// src/utils/[domain]/[functionality].test.ts
import { validateAnswer, calculateScore } from './validation';

describe('Domain Validation Utils', () => {
  describe('validateAnswer', () => {
    // Happy path
    it('should validate correct single answer', () => {
      const result = validateAnswer('A', mockQuestion, 'A');
      expect(result).toBe(true);
    });
    
    // Edge cases
    it('should handle empty answers', () => {
      const result = validateAnswer('', mockQuestion, 'A');
      expect(result).toBe(false);
    });
    
    // Performance
    it('should complete within performance budget', () => {
      const start = performance.now();
      validateAnswer('A', mockQuestion, 'A');
      expect(performance.now() - start).toBeLessThan(5);
    });
  });
});
```

### 5. Update Component Usage

```typescript
// Before
const Component = () => {
  const isValid = /* inline logic */;
  
// After  
import { validateAnswer } from '@/utils/quiz/validation';

const Component = () => {
  const isValid = validateAnswer(userAnswer, question, correctAnswer);
```

## Common Extraction Targets

### Validation Functions
- Input validation (email, phone, postcode)
- Business rule validation (quiz answers, form completeness)
- Format checking (URN, date formats)

### Calculation Functions
- Score/percentage calculations
- Progress tracking
- Time/duration calculations

### Formatting Functions
- Display formatting (currency, dates, file sizes)
- Text transformations (truncation, case conversion)
- Data normalization

## Anti-Patterns to Avoid

❌ **Don't extract React-dependent logic**
```typescript
// Bad - depends on hooks
export function useFormValidation() {
  const [errors, setErrors] = useState({});
  // ...
}
```

❌ **Don't create mega utility files**
```typescript
// Bad - too many unrelated functions
// src/utils/helpers.ts
export function validateEmail() {}
export function calculateTax() {}
export function formatDate() {}
```

❌ **Don't lose type safety**
```typescript
// Bad - using any
export function process(data: any): any {
  // ...
}
```

## Success Checklist

- [ ] Logic is truly pure (no side effects)
- [ ] Function has single responsibility
- [ ] Types are properly defined
- [ ] Edge cases are handled
- [ ] Tests achieve 100% coverage
- [ ] Performance benchmarks added
- [ ] Component behavior unchanged
- [ ] Documentation includes examples

## Performance Guidelines

For extracted functions:
- Unit test execution: <5ms
- Validation functions: <1ms
- Calculation functions: <2ms
- Formatting functions: <1ms

## Example Transformations

### Before: Quiz Validation in Component
```typescript
const QuizRenderer = () => {
  const checkAnswer = () => {
    if (!userAnswer) return false;
    if (question.type === 'multiple') {
      return userAnswer.every(a => correctAnswers.includes(a));
    }
    return userAnswer === correctAnswer;
  };
```

### After: Extracted Pure Function
```typescript
// src/utils/quiz/validation.ts
export function validateQuizAnswer(
  userAnswer: string | string[],
  correctAnswer: string | string[],
  questionType: QuestionType
): boolean {
  if (!userAnswer || (Array.isArray(userAnswer) && userAnswer.length === 0)) {
    return false;
  }
  
  if (questionType === 'multiple' && Array.isArray(userAnswer) && Array.isArray(correctAnswer)) {
    return userAnswer.every(answer => correctAnswer.includes(answer));
  }
  
  return userAnswer === correctAnswer;
}
```

## Related Patterns

- Mock Factory Pattern (for testing extracted functions)
- Performance Benchmarking Pattern
- Test Utilities Pattern