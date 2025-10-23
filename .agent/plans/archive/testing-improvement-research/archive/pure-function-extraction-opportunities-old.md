# Pure Function Extraction Opportunities for Test Improvement

This document identifies business logic currently embedded in React components that can be extracted into pure functions. This extraction will enable better unit testing patterns and improve our component test scores from 5.2/10 towards the utility pattern's 7.8/10.

## 1. Quiz Form Data Processing (QuizRenderer)

### Current Location
`src/components/PupilComponents/QuizRenderer/QuizRenderer.tsx` (lines 64-108)

### Current Implementation
Business logic for extracting answers from FormData is embedded in the handleSubmit event handler:

```typescript
// Multiple-choice answer extraction
for (const entries of formData.entries()) {
  const i = Number((entries[1] as string).at(-1)); // assumes last char is index
  const a = answers?.["multiple-choice"]?.[i];
  a && selectedAnswers.push(a);
}
```

### Proposed Pure Functions

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

export function extractAnswerIndex(value: string): number | null {
  const lastChar = value.at(-1);
  if (!lastChar) return null;
  const index = Number(lastChar);
  return isNaN(index) ? null : index;
}

export function extractOrderAnswers(formData: FormData, questionUid: string): number[] {
  return formData
    .getAll(`order-${questionUid}`)
    .map(Number)
    .filter(n => !isNaN(n));
}

export function extractMatchAnswers(
  formData: FormData, 
  questionUid: string
): { matches: string[], choices: string[] } {
  return {
    matches: formData.getAll(`match-${questionUid}-match`).map(String),
    choices: formData.getAll(`match-${questionUid}-choice`).map(String)
  };
}
```

### Test Examples
```typescript
describe('extractMultipleChoiceAnswers', () => {
  it('extracts selected answers based on form data indices', () => {
    const formData = new FormData();
    formData.append('answer', 'choice-0');
    formData.append('answer', 'choice-2');
    
    const available = [
      { answer: 'A', correct: true },
      { answer: 'B', correct: false },
      { answer: 'C', correct: true }
    ];
    
    expect(extractMultipleChoiceAnswers(formData, available))
      .toEqual([available[0], available[2]]);
  });
});
```

## 2. Video Player Time Calculations

### Current Location
`src/components/SharedComponents/VideoPlayer/VideoPlayer.tsx` (lines 178-196)

### Current Implementation
Percentage calculation and completion logic mixed with React component:

```typescript
if (getPercentageElapsed(mediaElRef) >= 90 && !hasTrackedEndRef.current) {
  videoTracking.onEnd();
  hasTrackedEndRef.current = true;
  // ...
}
```

### Proposed Pure Functions

```typescript
// src/utils/video/progressCalculations.ts

export function calculateWatchedPercentage(
  currentTime: number | null | undefined,
  duration: number | null | undefined
): number {
  if (!isValidTime(currentTime) || !isValidTime(duration) || duration === 0) {
    return 0;
  }
  return Math.min(100, (currentTime / duration) * 100);
}

export function isVideoNearComplete(
  percentage: number,
  threshold: number = 90
): boolean {
  return percentage >= threshold;
}

export function isValidTime(time: number | null | undefined): time is number {
  return typeof time === 'number' && !isNaN(time) && time >= 0;
}

export function formatTimeElapsed(seconds: number | null | undefined): string {
  if (!isValidTime(seconds)) return '0:00';
  
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
```

## 3. Network Error Classification (VideoPlayer)

### Current Location
`src/components/SharedComponents/VideoPlayer/VideoPlayer.tsx` (lines 204-222)

### Current Implementation
Error checking logic embedded in event handler:

```typescript
const checkNetworkError = (evt: Event): { isNetworkError: boolean; ignore?: boolean } => {
  const networkError = (evt as CustomEvent).detail?.data?.type === "networkError";
  // ... mixed with UI logic
}
```

### Proposed Pure Functions

```typescript
// src/utils/video/errorClassification.ts

export interface NetworkErrorInfo {
  isNetworkError: boolean;
  errorCode?: number;
  shouldIgnore: boolean;
  shouldRetry: boolean;
}

export function classifyVideoError(errorEvent: any): NetworkErrorInfo {
  const errorType = errorEvent?.detail?.data?.type;
  const errorCode = errorEvent?.detail?.data?.response?.code;
  
  if (errorType !== 'networkError') {
    return {
      isNetworkError: false,
      shouldIgnore: false,
      shouldRetry: false
    };
  }
  
  return classifyNetworkError(errorCode);
}

export function classifyNetworkError(code: number | undefined): NetworkErrorInfo {
  const errorClassifications: Record<number, Partial<NetworkErrorInfo>> = {
    403: { shouldIgnore: false, shouldRetry: false }, // Forbidden
    404: { shouldIgnore: false, shouldRetry: false }, // Not Found
    500: { shouldIgnore: false, shouldRetry: true },  // Server Error
    502: { shouldIgnore: false, shouldRetry: true },  // Bad Gateway
    503: { shouldIgnore: false, shouldRetry: true },  // Service Unavailable
  };
  
  const classification = code ? errorClassifications[code] : {};
  
  return {
    isNetworkError: true,
    errorCode: code,
    shouldIgnore: classification.shouldIgnore ?? true,
    shouldRetry: classification.shouldRetry ?? false
  };
}
```

## 4. School Data Extraction and Formatting

### Current Location
`src/components/TeacherComponents/helpers/downloadAndShareHelpers/getFormattedDetailsForTracking.tsx` (lines 48-54)

### Current Implementation
Regex parsing mixed with formatting:

```typescript
export const extractUrnAndSchool = (school: string) => {
  const match = /^(?:(\d{7}|\d{6}|\d{3}-\d{4}))-(.*)/.exec(school);
  return {
    urn: match?.at(1),
    schoolName: match?.at(2),
  };
};
```

### Proposed Pure Functions

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

export function isValidUrn(urn: string): boolean {
  const patterns = [
    /^\d{6}$/,        // English/Welsh
    /^\d{7}$/,        // Scottish
    /^\d{3}-\d{4}$/   // Northern Irish
  ];
  
  return patterns.some(pattern => pattern.test(urn));
}

export function formatSchoolDisplay(school: SchoolIdentifier): string {
  const typeLabels = {
    'english': 'England/Wales',
    'welsh': 'England/Wales',
    'scottish': 'Scotland',
    'northern-irish': 'Northern Ireland',
    'unknown': ''
  };
  
  const typeLabel = typeLabels[school.type];
  return typeLabel ? `${school.name} (${typeLabel})` : school.name;
}
```

## 5. Resource Type Mapping and Formatting

### Current Location
`src/components/TeacherComponents/helpers/downloadAndShareHelpers/getFormattedDetailsForTracking.tsx` (lines 65-76)

### Current Implementation
String transformations embedded in tracking function:

```typescript
const selectedResourcesForTracking = selectedResources.map((resource) => {
  const readableResourceName = resource.split("-").join(" ");
  if (resource === "presentation") {
    return "slide deck";
  } else if (resource === "intro-quiz-questions") {
    return "starter quiz questions";
  }
  // ...
});
```

### Proposed Pure Functions

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

export function formatResourceType(resourceType: string): string {
  return RESOURCE_DISPLAY_NAMES[resourceType] || 
         resourceType.split('-').join(' ');
}

export function formatResourceList(resources: string[]): string {
  const formatted = resources.map(formatResourceType);
  
  if (formatted.length === 0) return '';
  if (formatted.length === 1) return formatted[0];
  if (formatted.length === 2) return `${formatted[0]} and ${formatted[1]}`;
  
  const last = formatted.pop();
  return `${formatted.join(', ')}, and ${last}`;
}

export function groupResourcesByType(resources: string[]): Record<string, string[]> {
  const groups: Record<string, string[]> = {
    quizzes: [],
    worksheets: [],
    presentations: [],
    other: []
  };
  
  resources.forEach(resource => {
    if (resource.includes('quiz')) {
      groups.quizzes.push(resource);
    } else if (resource.includes('worksheet')) {
      groups.worksheets.push(resource);
    } else if (resource === 'presentation') {
      groups.presentations.push(resource);
    } else {
      groups.other.push(resource);
    }
  });
  
  return groups;
}
```

## 6. Quiz Answer Validation and Classification

### Current Location
`src/components/PupilViews/PupilQuiz/PupilQuiz.view.tsx` (lines 331-362)

### Current Implementation
Tooltip and tab navigation logic mixed with component:

```typescript
function pickTooltip(answers: QuizQuestionAnswers) {
  switch (true) {
    case isOrderAnswer(answers):
      return "You need to order to move on!";
    // ...
  }
}
```

### Proposed Pure Functions

```typescript
// src/utils/quiz/answerValidation.ts

export interface ValidationMessage {
  tooltip: string;
  ariaLabel: string;
  errorType: 'missing' | 'incomplete' | 'invalid';
}

export function getAnswerValidationMessage(
  questionType: string,
  answerState?: any
): ValidationMessage {
  const messages: Record<string, ValidationMessage> = {
    'order': {
      tooltip: 'You need to order to move on!',
      ariaLabel: 'Please arrange all items in order',
      errorType: 'incomplete'
    },
    'match': {
      tooltip: 'You need to match to move on!',
      ariaLabel: 'Please match all items',
      errorType: 'incomplete'
    },
    'short-answer': {
      tooltip: 'You need to type an answer to move on!',
      ariaLabel: 'Please enter your answer',
      errorType: 'missing'
    },
    'multiple-choice-multi': {
      tooltip: 'You need to select answers to move on!',
      ariaLabel: 'Please select one or more answers',
      errorType: 'missing'
    },
    'multiple-choice-single': {
      tooltip: 'You need to select an answer to move on!',
      ariaLabel: 'Please select an answer',
      errorType: 'missing'
    }
  };
  
  return messages[questionType] || {
    tooltip: 'Please complete the question',
    ariaLabel: 'Question incomplete',
    errorType: 'invalid'
  };
}

export function validateQuizAnswer(
  questionType: string,
  answer: any
): { isValid: boolean; errors: string[] } {
  switch (questionType) {
    case 'short-answer':
      return validateShortAnswer(answer);
    case 'order':
      return validateOrderAnswer(answer);
    case 'match':
      return validateMatchAnswer(answer);
    default:
      return { isValid: true, errors: [] };
  }
}

function validateShortAnswer(answer: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!answer || answer.trim().length === 0) {
    errors.push('Answer cannot be empty');
  }
  if (answer && answer.length > 500) {
    errors.push('Answer is too long (max 500 characters)');
  }
  
  return { isValid: errors.length === 0, errors };
}
```

## 7. Download Category Mapping

### Current Location
`src/components/CurriculumComponents/CurriculumDownloads/CurriculumDownloads.tsx` (lines 152-164)

### Current Implementation
Mapping function embedded in component:

```typescript
const downloadCategoryAsKeyStageTitle = (input: DownloadCategory) => {
  const obj: Record<DownloadCategory, KeyStageTitleValueType> = {
    EYFS: "Early Years Foundation stage",
    KS1: "Key stage 1",
    // ...
  };
  return obj[input];
};
```

### Proposed Pure Functions

```typescript
// src/utils/curriculum/categoryMappings.ts

export const CATEGORY_TO_KEY_STAGE: Record<string, string> = {
  'EYFS': 'Early Years Foundation stage',
  'KS1': 'Key stage 1',
  'KS2': 'Key stage 2',
  'KS3': 'Key stage 3',
  'KS4': 'Key stage 4',
  'Therapies': 'Therapies',
  'Specialist': 'Specialist',
};

export const KEY_STAGE_TO_PHASE: Record<string, string> = {
  'EYFS': 'foundation',
  'KS1': 'primary',
  'KS2': 'primary',
  'KS3': 'secondary',
  'KS4': 'secondary',
  'Therapies': 'specialist',
  'Specialist': 'specialist',
};

export function getCategoryDisplayName(category: string): string {
  return CATEGORY_TO_KEY_STAGE[category] || category;
}

export function getPhaseFromCategory(category: string): string {
  return KEY_STAGE_TO_PHASE[category] || 'unknown';
}

export function getCategoryOrder(category: string): number {
  const order: Record<string, number> = {
    'EYFS': 1,
    'KS1': 2,
    'KS2': 3,
    'KS3': 4,
    'KS4': 5,
    'Therapies': 6,
    'Specialist': 7,
  };
  return order[category] || 999;
}

export function sortCategories(categories: string[]): string[] {
  return [...categories].sort((a, b) => 
    getCategoryOrder(a) - getCategoryOrder(b)
  );
}
```

## 8. Quiz Image Dimension Calculations

### Current Location
`src/components/TeacherComponents/LessonOverviewQuizContainer/quizUtils/index.tsx` (lines 51-62)

### Current Implementation
Dimension calculations embedded in component utility:

```typescript
export const constrainHeight = (h?: number) =>
  h ? Math.max(Math.min(200, h), 96) : undefined;

export const calcDims = (w?: number, h?: number) => {
  const constrainedHeight = constrainHeight(h);
  return w && h && constrainedHeight
    ? {
        width: Math.round((w / h) * constrainedHeight),
        height: constrainedHeight,
      }
    : { width: undefined, height: undefined };
};
```

### Proposed Pure Functions

```typescript
// src/utils/images/dimensionCalculations.ts

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ImageConstraints {
  minHeight?: number;
  maxHeight?: number;
  minWidth?: number;
  maxWidth?: number;
  maintainAspectRatio?: boolean;
}

const DEFAULT_CONSTRAINTS: ImageConstraints = {
  minHeight: 96,
  maxHeight: 200,
  maintainAspectRatio: true
};

export function constrainImageHeight(
  height: number,
  constraints: ImageConstraints = DEFAULT_CONSTRAINTS
): number {
  const { minHeight = 96, maxHeight = 200 } = constraints;
  return Math.max(minHeight, Math.min(maxHeight, height));
}

export function calculateConstrainedDimensions(
  originalDimensions: ImageDimensions | null,
  constraints: ImageConstraints = DEFAULT_CONSTRAINTS
): ImageDimensions | null {
  if (!originalDimensions || originalDimensions.width <= 0 || originalDimensions.height <= 0) {
    return null;
  }
  
  const { width, height } = originalDimensions;
  const constrainedHeight = constrainImageHeight(height, constraints);
  
  if (!constraints.maintainAspectRatio) {
    return { width, height: constrainedHeight };
  }
  
  const aspectRatio = width / height;
  return {
    width: Math.round(aspectRatio * constrainedHeight),
    height: constrainedHeight
  };
}

export function getAspectRatioClass(dimensions: ImageDimensions): string {
  const ratio = dimensions.width / dimensions.height;
  
  if (ratio > 1.7) return 'landscape-wide';
  if (ratio > 1.3) return 'landscape';
  if (ratio > 0.7) return 'square';
  if (ratio > 0.5) return 'portrait';
  return 'portrait-tall';
}
```

## 9. Form Error Message Formatting

### Current Location
`src/components/CurriculumComponents/CurriculumDownloads/CurriculumDownloads.tsx` (lines 352-359)

### Current Implementation
Error message extraction in JSX:

```typescript
{getFormErrorMessages(form.errors).map((err, i) => {
  return (
    <OakLI $color={"red"} key={i}>
      {err}
    </OakLI>
  );
})}
```

### Proposed Pure Functions

```typescript
// src/utils/forms/errorFormatting.ts

export interface FormError {
  field: string;
  message: string;
  type: 'required' | 'invalid' | 'custom';
}

export function extractFormErrors(errors: any): FormError[] {
  const formErrors: FormError[] = [];
  
  Object.keys(errors || {}).forEach(field => {
    const error = errors[field];
    if (error?.message) {
      formErrors.push({
        field,
        message: error.message,
        type: error.type || 'custom'
      });
    }
  });
  
  return formErrors;
}

export function formatErrorMessage(error: FormError): string {
  const fieldLabels: Record<string, string> = {
    email: 'Email address',
    school: 'School',
    resources: 'Resources',
    terms: 'Terms and conditions',
  };
  
  const fieldLabel = fieldLabels[error.field] || error.field;
  
  switch (error.type) {
    case 'required':
      return `${fieldLabel} is required`;
    case 'invalid':
      return `${fieldLabel} is invalid`;
    default:
      return error.message;
  }
}

export function prioritizeErrors(errors: FormError[]): FormError[] {
  const priority: Record<string, number> = {
    'resources': 1,
    'email': 2,
    'school': 3,
    'terms': 4,
  };
  
  return [...errors].sort((a, b) => {
    const aPriority = priority[a.field] || 999;
    const bPriority = priority[b.field] || 999;
    return aPriority - bPriority;
  });
}
```

## 10. Local Storage Data Validation

### Current Location
`src/components/CurriculumComponents/CurriculumDownloads/CurriculumDownloads.tsx` (lines 92-110)

### Current Implementation
Local storage handling mixed with component logic:

```typescript
const handleLocalStorageUpdates = (data: {
  email?: string | undefined;
  school: string;
  schoolName: string;
  terms: boolean;
}) => {
  const { email, school, schoolName, terms } = data;
  if (email) setEmailInLocalStorage(email);
  if (terms) setTermsInLocalStorage(terms);
  
  const isSpecialSchool = school === "homeschool" || school === "notListed";
  // ...
};
```

### Proposed Pure Functions

```typescript
// src/utils/storage/localStorageValidation.ts

export interface UserPreferences {
  email?: string;
  schoolId: string;
  schoolName: string;
  termsAccepted: boolean;
  lastUpdated: string;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isSpecialSchoolType(schoolId: string): boolean {
  return ['homeschool', 'notListed'].includes(schoolId);
}

export function normalizeSchoolData(
  schoolId: string,
  schoolName?: string
): { id: string; name: string } {
  if (isSpecialSchoolType(schoolId)) {
    return {
      id: schoolId,
      name: schoolId === 'homeschool' ? 'Homeschool' : 'School not listed'
    };
  }
  
  return {
    id: schoolId,
    name: schoolName || 'Unknown school'
  };
}

export function validateUserPreferences(data: any): UserPreferences | null {
  if (!data || typeof data !== 'object') return null;
  
  const { email, schoolId, schoolName, termsAccepted } = data;
  
  // Required fields
  if (!schoolId || typeof schoolId !== 'string') return null;
  if (typeof termsAccepted !== 'boolean') return null;
  
  // Optional email validation
  if (email && !validateEmail(email)) return null;
  
  const normalizedSchool = normalizeSchoolData(schoolId, schoolName);
  
  return {
    email: email || undefined,
    schoolId: normalizedSchool.id,
    schoolName: normalizedSchool.name,
    termsAccepted,
    lastUpdated: new Date().toISOString()
  };
}
```

## Summary

These 10 examples demonstrate clear opportunities to extract business logic from React components into pure, testable functions. Each extraction:

1. **Improves testability** - Pure functions are easier to test in isolation
2. **Enhances reusability** - Logic can be shared across components
3. **Increases maintainability** - Business rules are centralized
4. **Enables better typing** - Clear input/output contracts
5. **Supports composition** - Functions can be combined for complex operations

The proposed structure follows the utility pattern that achieves 7.8/10 test scores by:
- Organizing related functions into domain-specific modules
- Providing comprehensive type definitions
- Enabling thorough unit testing without React dependencies
- Creating a foundation for integration tests that use these utilities

Next steps would be to:
1. Create the utility modules with the proposed functions
2. Write comprehensive unit tests for each function
3. Refactor components to use the new utilities
4. Update component tests to focus on integration rather than logic testing