# Pure Function Extraction Opportunities

**Purpose**: Identify business logic in components that can be extracted into pure functions for better testing  
**Goal**: Transform component testing from 5.2/10 to match utility pattern of 7.8/10  
**Impact**: Enable isolated unit testing, improve type safety, create reusable business logic

## High-Impact Extraction Opportunities

### 1. Quiz Form Data Processing

**Current Location**: `src/components/PupilComponents/QuizRenderer/QuizRenderer.tsx`

**Current State**: Complex form data parsing logic embedded in component
```typescript
// Currently inside component
const formData = new FormData(e.currentTarget);
const allFormAnswers: FormAnswers = {};
// Complex parsing logic mixed with React code
```

**Proposed Pure Function**:
```typescript
// src/utils/quiz/formDataParser.ts
export interface ParsedQuizAnswers {
  answers: Record<string, Answer>;
  completedQuestions: string[];
}

export const parseQuizFormData = (formData: FormData): ParsedQuizAnswers => {
  // Pure transformation of form data to structured answers
};

// Test becomes simple
describe('parseQuizFormData', () => {
  it('extracts multiple choice answers correctly', () => {
    const formData = new FormData();
    formData.append('q1-mcq', 'option-a');
    
    const result = parseQuizFormData(formData);
    
    expect(result.answers.q1).toEqual({
      type: 'multiple-choice',
      value: 'option-a'
    });
  });
});
```

### 2. Video Player Time Calculations

**Current Location**: `src/components/PupilComponents/VideoPlayer/VideoPlayer.tsx`

**Current State**: Percentage calculations mixed with component state
```typescript
// Inside component
const percentagePlayed = hasWindow && playerRef.current
  ? (playerRef.current.getCurrentTime() / playerRef.current.getDuration()) * 100
  : 0;
```

**Proposed Pure Functions**:
```typescript
// src/utils/video/calculations.ts
export const calculatePlayedPercentage = (
  currentTime: number,
  duration: number
): number => {
  if (duration === 0) return 0;
  return Math.min(100, (currentTime / duration) * 100);
};

export const calculateTimeRemaining = (
  currentTime: number,
  duration: number
): number => {
  return Math.max(0, duration - currentTime);
};

export const isVideoComplete = (
  percentage: number,
  threshold: number = 90
): boolean => {
  return percentage >= threshold;
};
```

### 3. Network Error Classification

**Current Location**: `src/components/PupilComponents/VideoPlayer/VideoPlayer.tsx`

**Current State**: Complex error handling logic in event handlers
```typescript
// Inside component methods
if (error.code === 2) {
  setNetworkError(true);
  reportError("VideoPlayer", error);
}
```

**Proposed Pure Function**:
```typescript
// src/utils/video/errorHandling.ts
export interface VideoError {
  code: number;
  message: string;
  isNetworkError: boolean;
  isRecoverable: boolean;
  userMessage: string;
}

export const classifyVideoError = (errorCode: number): VideoError => {
  switch (errorCode) {
    case 1: return { code: 1, message: 'MEDIA_ERR_ABORTED', isNetworkError: false, isRecoverable: true, userMessage: 'Video playback was cancelled' };
    case 2: return { code: 2, message: 'MEDIA_ERR_NETWORK', isNetworkError: true, isRecoverable: true, userMessage: 'Network error - please check your connection' };
    case 3: return { code: 3, message: 'MEDIA_ERR_DECODE', isNetworkError: false, isRecoverable: false, userMessage: 'Video format not supported' };
    case 4: return { code: 4, message: 'MEDIA_ERR_SRC_NOT_SUPPORTED', isNetworkError: false, isRecoverable: false, userMessage: 'Video source not available' };
    default: return { code: errorCode, message: 'Unknown error', isNetworkError: false, isRecoverable: false, userMessage: 'An unexpected error occurred' };
  }
};
```

### 4. School Data Extraction

**Current Location**: `src/components/PupilComponents/OnboardingForm/OnBoardingForm.tsx`

**Current State**: School URN extraction logic in form submission
```typescript
// Inside form handler
const school = getValues("school") as School;
const urn = school.urn;
```

**Proposed Pure Functions**:
```typescript
// src/utils/school/validation.ts
export const extractSchoolUrn = (school: School | undefined): string | null => {
  if (!school?.urn) return null;
  return school.urn;
};

export const validateUrn = (urn: string): boolean => {
  // URN format: 6 digits
  return /^\d{6}$/.test(urn);
};

export const formatSchoolDisplay = (school: School): string => {
  return `${school.name} (${school.postcode})`;
};
```

### 5. Resource Type Mapping

**Current Location**: `src/components/CurriculumComponents/CurriculumDownloadView/CurriculumResourcesSelector.tsx`

**Current State**: Complex mapping logic in render method
```typescript
// Inside component
const formattedResources = resources.map(r => ({
  label: r.type === 'worksheet' ? 'Worksheet' : 'Slides',
  value: r.id
}));
```

**Proposed Pure Functions**:
```typescript
// src/utils/curriculum/resourceFormatting.ts
export const formatResourceLabel = (type: ResourceType): string => {
  const labelMap: Record<ResourceType, string> = {
    worksheet: 'Worksheet',
    slides: 'Slides',
    video: 'Video Resource',
    exit_quiz: 'Exit Quiz',
    starter_quiz: 'Starter Quiz'
  };
  return labelMap[type] || 'Resource';
};

export const formatResourcesForSelect = (
  resources: Resource[]
): SelectOption[] => {
  return resources.map(resource => ({
    label: formatResourceLabel(resource.type),
    value: resource.id,
    metadata: {
      type: resource.type,
      hasDownload: resource.downloadUrl !== null
    }
  }));
};
```

### 6. Quiz Answer Validation

**Current Location**: `src/views/PupilViews/PupilQuiz/PupilQuiz.view.tsx`

**Current State**: Validation logic scattered through component
```typescript
// Inside component
const isValid = answer && answer.length > 0;
const canSubmit = allAnswered && !isSubmitting;
```

**Proposed Pure Functions**:
```typescript
// src/utils/quiz/validation.ts
export const validateAnswer = (
  answer: Answer | undefined,
  questionType: QuestionType
): ValidationResult => {
  if (!answer) {
    return { isValid: false, error: 'Answer required' };
  }
  
  switch (questionType) {
    case 'multiple-choice':
      return { isValid: answer.value !== '', error: null };
    case 'short-answer':
      return { 
        isValid: answer.value.length > 0 && answer.value.length <= 200,
        error: answer.value.length > 200 ? 'Answer too long' : null
      };
    case 'order':
      return {
        isValid: Array.isArray(answer.value) && answer.value.length > 0,
        error: null
      };
    default:
      return { isValid: false, error: 'Unknown question type' };
  }
};

export const canSubmitQuiz = (
  answers: Record<string, Answer>,
  requiredQuestions: string[],
  isSubmitting: boolean
): boolean => {
  if (isSubmitting) return false;
  
  const answeredQuestions = Object.keys(answers).filter(
    key => answers[key] !== undefined
  );
  
  return requiredQuestions.every(q => answeredQuestions.includes(q));
};
```

### 7. Download Category Mapping

**Current Location**: `src/components/CurriculumComponents/CurriculumDownloadTab/helper.ts`

**Current State**: Complex nested logic for category detection
```typescript
// Currently mixed with component logic
const category = lessonDownloads?.find(d => d.type === 'worksheet') 
  ? 'worksheet' 
  : 'slides';
```

**Proposed Pure Functions**:
```typescript
// src/utils/curriculum/downloadCategories.ts
export type DownloadCategory = 'worksheet' | 'slides' | 'mixed' | 'none';

export const determineDownloadCategory = (
  downloads: LessonDownload[]
): DownloadCategory => {
  const hasWorksheet = downloads.some(d => d.type === 'worksheet');
  const hasSlides = downloads.some(d => d.type === 'slides');
  
  if (hasWorksheet && hasSlides) return 'mixed';
  if (hasWorksheet) return 'worksheet';
  if (hasSlides) return 'slides';
  return 'none';
};

export const groupDownloadsByCategory = (
  downloads: LessonDownload[]
): Record<DownloadCategory, LessonDownload[]> => {
  return downloads.reduce((acc, download) => {
    const category = download.type as DownloadCategory;
    if (!acc[category]) acc[category] = [];
    acc[category].push(download);
    return acc;
  }, {} as Record<DownloadCategory, LessonDownload[]>);
};
```

### 8. Quiz Image Dimension Calculations

**Current Location**: `src/components/PupilComponents/QuizImage/QuizImage.tsx`

**Current State**: Image sizing logic in component
```typescript
// Inside component
const aspectRatio = image.width / image.height;
const displayHeight = displayWidth / aspectRatio;
```

**Proposed Pure Functions**:
```typescript
// src/utils/image/calculations.ts
export interface ImageDimensions {
  width: number;
  height: number;
  aspectRatio: number;
}

export const calculateAspectRatio = (
  width: number,
  height: number
): number => {
  if (height === 0) return 1;
  return width / height;
};

export const calculateScaledDimensions = (
  original: ImageDimensions,
  maxWidth: number,
  maxHeight: number
): ImageDimensions => {
  const widthScale = maxWidth / original.width;
  const heightScale = maxHeight / original.height;
  const scale = Math.min(widthScale, heightScale, 1);
  
  return {
    width: Math.round(original.width * scale),
    height: Math.round(original.height * scale),
    aspectRatio: original.aspectRatio
  };
};
```

### 9. Form Error Message Formatting

**Current Location**: Multiple form components

**Current State**: Error message generation inline
```typescript
// Inside components
const errorMessage = error.type === 'required' 
  ? 'This field is required' 
  : 'Invalid input';
```

**Proposed Pure Functions**:
```typescript
// src/utils/forms/errorMessages.ts
export const getFieldErrorMessage = (
  error: FieldError | undefined,
  fieldName: string
): string | null => {
  if (!error) return null;
  
  const messages: Record<string, string> = {
    required: `${fieldName} is required`,
    minLength: `${fieldName} is too short`,
    maxLength: `${fieldName} is too long`,
    pattern: `${fieldName} format is invalid`,
    validate: error.message || `${fieldName} is invalid`
  };
  
  return messages[error.type] || 'Invalid input';
};

export const formatValidationErrors = (
  errors: Record<string, FieldError>
): string[] => {
  return Object.entries(errors)
    .map(([field, error]) => getFieldErrorMessage(error, field))
    .filter((msg): msg is string => msg !== null);
};
```

### 10. Local Storage Data Validation

**Current Location**: `src/hooks/useLocalStorage.ts`

**Current State**: Validation mixed with storage logic
```typescript
// Inside hook
const isValid = value !== null && typeof value === 'object';
```

**Proposed Pure Functions**:
```typescript
// src/utils/storage/validation.ts
export const validateStoredPreferences = (
  data: unknown
): data is UserPreferences => {
  if (!data || typeof data !== 'object') return false;
  
  const prefs = data as any;
  return (
    typeof prefs.fontSize === 'number' &&
    prefs.fontSize >= 12 &&
    prefs.fontSize <= 24 &&
    typeof prefs.colorScheme === 'string' &&
    ['light', 'dark', 'auto'].includes(prefs.colorScheme)
  );
};

export const sanitizeStorageData = <T>(
  data: unknown,
  validator: (data: unknown) => data is T,
  defaultValue: T
): T => {
  try {
    return validator(data) ? data : defaultValue;
  } catch {
    return defaultValue;
  }
};
```

## Implementation Benefits

### 1. **Testability**
- Pure functions can be tested in isolation
- No React rendering required
- No mocking of hooks or context
- Fast test execution

### 2. **Reusability**
- Business logic can be shared across components
- Server-side rendering compatibility
- Easy to use in different contexts

### 3. **Type Safety**
- Clear input/output contracts
- Better TypeScript inference
- Reduced runtime errors

### 4. **Performance**
- Functions can be memoized
- Easier to optimize
- Can be moved to Web Workers

### 5. **Maintainability**
- Business logic separated from UI
- Easier to understand and modify
- Better code organization

## Additional Implementation Examples from Analysis

### Enhanced Quiz Form Data Processing
```typescript
// src/utils/quiz/formDataExtractors.ts

export function extractMultipleChoiceAnswers(
  formData: FormData,
  availableAnswers: MCAnswer[]
): MCAnswer[] {
  const selectedAnswers: MCAnswer[] = [];
  for (const [_, value] of formData.entries()) {
    const index = extractAnswerIndex(value as string);
    if (index !== null && availableAnswers[index]) {
      selectedAnswers.push(availableAnswers[index]);
    }
  }
  return selectedAnswers;
}

export function extractOrderAnswers(formData: FormData, questionUid: string): number[] {
  return formData
    .getAll(`order-${questionUid}`)
    .map(Number)
    .filter(n => !isNaN(n));
}
```

### Enhanced School Data Parsing
```typescript
// src/utils/school/schoolDataParsing.ts

export interface SchoolIdentifier {
  urn: string;
  name: string;
  type: 'english' | 'welsh' | 'scottish' | 'northern-irish' | 'unknown';
}

export function parseSchoolIdentifier(schoolString: string): SchoolIdentifier | null {
  const patterns = [
    { regex: /^(\d{6})-(.*)$/, type: 'english' as const },     // English/Welsh
    { regex: /^(\d{7})-(.*)$/, type: 'scottish' as const },    // Scottish
    { regex: /^(\d{3}-\d{4})-(.*)$/, type: 'northern-irish' as const }, // NI
  ];
  
  for (const { regex, type } of patterns) {
    const match = regex.exec(schoolString);
    if (match) {
      return {
        urn: match[1],
        name: match[2].trim(),
        type
      };
    }
  }
  
  return null;
}
```

### Enhanced Resource Type Mapping
```typescript
// src/utils/resources/resourceFormatting.ts

export const RESOURCE_DISPLAY_NAMES: Record<string, string> = {
  'presentation': 'slide deck',
  'intro-quiz-questions': 'starter quiz questions',
  'intro-quiz-answers': 'starter quiz answers',
  'exit-quiz-questions': 'exit quiz questions',
  'exit-quiz-answers': 'exit quiz answers',
  'worksheet-pdf': 'worksheet PDF',
  'worksheet-pptx': 'worksheet PowerPoint',
};

export function formatResourceList(resources: string[]): string {
  const formatted = resources.map(formatResourceType);
  
  if (formatted.length === 0) return '';
  if (formatted.length === 1) return formatted[0];
  if (formatted.length === 2) return `${formatted[0]} and ${formatted[1]}`;
  
  const last = formatted.pop();
  return `${formatted.join(', ')}, and ${last}`;
}
```

### Enhanced Image Dimension Calculations
```typescript
// src/utils/images/dimensionCalculations.ts

export function getAspectRatioClass(dimensions: ImageDimensions): string {
  const ratio = dimensions.width / dimensions.height;
  
  if (ratio > 1.7) return 'landscape-wide';
  if (ratio > 1.3) return 'landscape';
  if (ratio > 0.7) return 'square';
  if (ratio > 0.5) return 'portrait';
  return 'portrait-tall';
}
```

## Test Examples for Pure Functions

### Quiz Answer Validation Tests
```typescript
describe('validateQuizAnswer', () => {
  describe('short answer validation', () => {
    it('accepts valid answers', () => {
      const result = validateShortAnswer('Valid answer');
      expect(result).toEqual({ isValid: true, errors: [] });
    });

    it('rejects empty answers', () => {
      const result = validateShortAnswer('');
      expect(result).toEqual({ 
        isValid: false, 
        errors: ['Answer cannot be empty'] 
      });
    });

    it('rejects answers over 500 characters', () => {
      const longAnswer = 'a'.repeat(501);
      const result = validateShortAnswer(longAnswer);
      expect(result).toEqual({ 
        isValid: false, 
        errors: ['Answer is too long (max 500 characters)'] 
      });
    });
  });
});
```

## Next Steps

1. Create `test-type-examples.md` showing HOW to test these pure functions
2. Prioritize which extractions to implement first in Phase 2
3. Create migration guides for each pattern
4. Establish naming conventions and file organization

## Proposed File Structure

```
src/utils/
├── quiz/
│   ├── formDataParser.ts
│   ├── validation.ts
│   └── __tests__/
├── video/
│   ├── calculations.ts
│   ├── errorHandling.ts
│   └── __tests__/
├── curriculum/
│   ├── resourceFormatting.ts
│   ├── downloadCategories.ts
│   └── __tests__/
├── school/
│   ├── validation.ts
│   └── __tests__/
├── image/
│   ├── calculations.ts
│   └── __tests__/
├── forms/
│   ├── errorMessages.ts
│   └── __tests__/
└── storage/
    ├── validation.ts
    └── __tests__/
```

This structure organizes utilities by domain, making them easy to find and maintain.

## Prioritization for Implementation

### Priority 1: Critical Educational Features (Immediate Focus)

**1. Quiz Answer Validation & Form Data Processing**
- **Impact**: Directly affects student assessment accuracy
- **Usage**: Every quiz interaction across the platform
- **Risk**: Incorrect validation could misgrade students
- **Effort**: Medium - Clear extraction path
- **Files**: QuizRenderer.tsx, PupilQuiz.view.tsx

**2. Video Player Time Calculations**
- **Impact**: Learning analytics and progress tracking
- **Usage**: All video-based lessons
- **Risk**: Inaccurate tracking affects teacher insights
- **Effort**: Low - Simple calculations
- **Files**: VideoPlayer.tsx

**3. School Data Extraction**
- **Impact**: User onboarding and data accuracy
- **Usage**: Every new user registration
- **Risk**: Invalid URNs could break integrations
- **Effort**: Low - Clear validation rules
- **Files**: OnBoardingForm.tsx

### Priority 2: User Experience Improvements

**4. Form Error Message Formatting**
- **Impact**: User experience and accessibility
- **Usage**: All forms across the platform
- **Risk**: Poor error messages increase support burden
- **Effort**: Low - Standard patterns

**5. Resource Type Mapping**
- **Impact**: Teacher workflow efficiency
- **Usage**: Resource selection and downloads
- **Risk**: Confusion in resource types
- **Effort**: Low - Simple mappings

**6. Network Error Classification**
- **Impact**: Error handling and recovery
- **Usage**: All video playback
- **Risk**: Poor error messages confuse users
- **Effort**: Medium - Multiple error types

### Priority 3: Performance & Optimization

**7-10. Additional Optimizations**
- Image calculations
- Download categorization
- Storage validation
- Focus on most-used components first

### Implementation Strategy

1. **Start with Priority 1** - These directly impact Oak's core educational mission
2. **Extract incrementally** - One function at a time with full test coverage
3. **Measure improvement** - Track test quality scores before and after
4. **Share patterns** - Create examples for the team to follow
5. **Build momentum** - Quick wins in Priority 1 will demonstrate value