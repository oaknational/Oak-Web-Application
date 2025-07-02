# Test Organization and Structure

**Organizing tests for maintainability, clarity, and cultural consistency at Oak**

## Directory Structure

### 1. Recommended Test File Organization

```text
src/
├── components/
│   ├── SharedComponents/
│   │   ├── LessonCard.tsx
│   │   └── __tests__/
│   │       ├── LessonCard.test.tsx
│   │       └── LessonCard.integration.test.tsx
│   └── TeacherComponents/
│       ├── CurriculumBrowser.tsx
│       └── __tests__/
│           └── CurriculumBrowser.test.tsx
├── hooks/
│   ├── useLessonData.ts
│   └── __tests__/
│       └── useLessonData.test.ts
├── utils/
│   ├── curriculumHelpers.ts
│   └── __tests__/
│       ├── curriculumHelpers.test.ts
│       └── curriculumHelpers.integration.test.ts
├── pages/
│   ├── teachers/
│   │   ├── lessons/
│   │   │   ├── [lessonSlug].tsx
│   │   │   └── __tests__/
│   │   │       └── [lessonSlug].test.tsx
│   └── api/
│       ├── curriculum/
│       │   ├── [subject].ts
│       │   └── __tests__/
│       │       └── [subject].test.ts
└── __tests__/
    ├── setup.ts
    ├── test-utils.tsx
    └── mocks/
        ├── curriculum.ts
        ├── lessons.ts
        └── api.ts
```

### 2. Test Type Organization

```text
__tests__/
├── unit/           # Pure functions, isolated logic
├── integration/    # Component + hooks + data flow
├── e2e/           # Full user journeys
└── visual/        # Storybook visual regression
```

## File Naming Conventions

### 1. Test File Names

```typescript
// Unit tests - test isolated functionality
curriculumHelpers.test.ts
calculateLessonDuration.test.ts
formatKeyStage.test.ts

// Integration tests - test component interactions
LessonPage.integration.test.tsx
CurriculumBrowser.integration.test.tsx

// API tests
api/lessons.test.ts
api/curriculum/mathematics.test.ts

// Hook tests
useLessonData.test.ts
useCurriculumFilters.test.ts
```

### 2. Test Suite Organization

```typescript
// Descriptive test suites grouped by behavior
describe("LessonCard", () => {
  describe("lesson information display", () => {
    // Tests for what users see
  });
  
  describe("interaction handling", () => {
    // Tests for user actions
  });
  
  describe("accessibility features", () => {
    // Tests for screen readers, keyboard nav
  });
  
  describe("responsive behavior", () => {
    // Tests for different screen sizes
  });
});

// Pure function suites grouped by domain
describe("curriculumHelpers", () => {
  describe("calculateLessonDuration", () => {
    // Focus on edge cases and business logic
  });
  
  describe("formatCurriculumTitle", () => {
    // Test formatting consistency
  });
});
```

## Jest Configuration for Oak

### 1. Primary Jest Configuration

```javascript
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  
  // Test file patterns
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}',
    '<rootDir>/__tests__/**/*.{js,jsx,ts,tsx}'
  ],
  
  // Module mapping for Oak-specific paths
  moduleNameMapping: {
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@/utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@/types/(.*)$': '<rootDir>/src/types/$1',
    '^@/api/(.*)$': '<rootDir>/src/pages/api/$1',
    '^@/fixtures/(.*)$': '<rootDir>/__tests__/fixtures/$1',
    '^@/mocks/(.*)$': '<rootDir>/__tests__/mocks/$1'
  },
  
  // Transform configuration
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }]
  },
  
  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/index.{js,jsx,ts,tsx}',
    '!src/**/__tests__/**',
  ],
  
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  
  // Test timeout for async operations
  testTimeout: 10000
};

module.exports = createJestConfig(customJestConfig);
```

### 2. Test Setup Configuration

```typescript
// __tests__/setup.ts
import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';
import { server } from './mocks/server';

// Configure React Testing Library
configure({
  testIdAttribute: 'data-testid',
});

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    };
  },
}));

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

// Setup MSW for API mocking
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Mock IntersectionObserver for components using it
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Console error suppression for known issues
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is deprecated')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
```

## Test Utilities and Helpers

### 1. Common Test Utilities

```typescript
// __tests__/test-utils.tsx
import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'styled-components';
import { oakTheme } from '@/styles/theme';

// Create test query client
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
      },
    },
  });
}

// Custom render with providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialQueryClient?: QueryClient;
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    initialQueryClient = createTestQueryClient(),
    ...renderOptions
  }: CustomRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={initialQueryClient}>
        <ThemeProvider theme={oakTheme}>
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// Re-export everything from React Testing Library
export * from '@testing-library/react';
export { renderWithProviders as render };
```

### 2. Mock Factories

```typescript
// __tests__/mocks/curriculum.ts
import { Lesson, Unit, Curriculum } from '@/types/curriculum';

export function createMockLesson(overrides: Partial<Lesson> = {}): Lesson {
  return {
    id: 'lesson-123',
    slug: 'introduction-to-fractions',
    title: 'Introduction to Fractions',
    description: 'Learn the basics of fractions',
    subject: 'mathematics',
    keyStage: 'ks2',
    yearGroup: '4',
    duration: 45,
    lessonNumber: 1,
    unitTitle: 'Fractions and Decimals',
    topics: ['fractions', 'number'],
    tierTitle: null,
    equipment: ['whiteboard', 'fraction cards'],
    copyrightContent: [],
    isNew: false,
    updatedAt: '2024-01-01T00:00:00Z',
    ...overrides
  };
}

export function createMockUnit(overrides: Partial<Unit> = {}): Unit {
  return {
    id: 'unit-456',
    title: 'Fractions and Decimals',
    description: 'Understanding fractions and decimal representations',
    domain: 'Number',
    estimatedLearningHours: 8,
    lessonCount: 12,
    lessons: [createMockLesson()],
    ...overrides
  };
}

export function createMockCurriculum(overrides: Partial<Curriculum> = {}): Curriculum {
  return {
    subject: 'mathematics',
    keyStage: 'ks2',
    units: [createMockUnit()],
    ...overrides
  };
}
```

### 3. API Mocking with MSW

```typescript
// __tests__/mocks/handlers.ts
import { rest } from 'msw';
import { createMockLesson, createMockCurriculum } from './curriculum';

export const handlers = [
  // Lesson API
  rest.get('/api/lessons/:slug', (req, res, ctx) => {
    const { slug } = req.params;
    return res(
      ctx.status(200),
      ctx.json(createMockLesson({ slug: slug as string }))
    );
  }),

  // Curriculum API
  rest.get('/api/curriculum/:subject', (req, res, ctx) => {
    const { subject } = req.params;
    return res(
      ctx.status(200),
      ctx.json(createMockCurriculum({ subject: subject as string }))
    );
  }),

  // Search API
  rest.get('/api/search/lessons', (req, res, ctx) => {
    const query = req.url.searchParams.get('q');
    return res(
      ctx.status(200),
      ctx.json({
        lessons: [createMockLesson({ title: `Search result for: ${query}` })],
        totalCount: 1
      })
    );
  }),
];

// __tests__/mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

## Test Data Management

### 1. Fixture Organization

```typescript
// __tests__/fixtures/curriculum-data.ts
export const mathsKS2Curriculum = {
  subject: 'mathematics',
  keyStage: 'ks2',
  units: [
    {
      id: 'number-place-value',
      title: 'Number and Place Value',
      lessons: [
        {
          id: 'place-value-intro',
          title: 'Introduction to Place Value',
          duration: 45,
          lessonNumber: 1
        }
      ]
    }
  ]
};

export const englishKS1Lessons = [
  {
    id: 'phonics-phase-2',
    title: 'Phonics Phase 2',
    subject: 'english',
    keyStage: 'ks1',
    duration: 30
  }
];
```

### 2. Test Data Builders

```typescript
// __tests__/builders/lesson-builder.ts
export class LessonBuilder {
  private lesson: Partial<Lesson> = {};

  static create() {
    return new LessonBuilder();
  }

  withTitle(title: string) {
    this.lesson.title = title;
    return this;
  }

  withSubject(subject: string) {
    this.lesson.subject = subject;
    return this;
  }

  withDuration(duration: number) {
    this.lesson.duration = duration;
    return this;
  }

  asCompleted() {
    this.lesson.completed = true;
    return this;
  }

  build(): Lesson {
    return createMockLesson(this.lesson);
  }
}

// Usage in tests
const lesson = LessonBuilder
  .create()
  .withTitle('Advanced Algebra')
  .withSubject('mathematics')
  .withDuration(60)
  .asCompleted()
  .build();
```

## Performance Testing Setup

### 1. Bundle Size Testing

```typescript
// __tests__/performance/bundle-size.test.ts
import { analyzeBundle } from '../utils/bundle-analyzer';

describe('Bundle Size Analysis', () => {
  it('should not exceed size thresholds', async () => {
    const analysis = await analyzeBundle();
    
    expect(analysis.totalSize).toBeLessThan(500 * 1024); // 500KB
    expect(analysis.chunks.main).toBeLessThan(200 * 1024); // 200KB
  });
});
```

### 2. Render Performance Testing

```typescript
// __tests__/performance/render-performance.test.tsx
import { render } from '@testing-library/react';
import { performance } from 'perf_hooks';
import { LessonGrid } from '@/components/LessonGrid';

describe('LessonGrid Performance', () => {
  it('should render 100 lessons within performance budget', () => {
    const lessons = Array.from({ length: 100 }, (_, i) => 
      createMockLesson({ id: `lesson-${i}` })
    );

    const start = performance.now();
    render(<LessonGrid lessons={lessons} />);
    const renderTime = performance.now() - start;

    expect(renderTime).toBeLessThan(50); // 50ms budget
  });
});
```

## Debugging Test Configuration

### 1. Test Debugging Setup

```typescript
// __tests__/debug.test.ts
import { debug, screen } from '@testing-library/react';

describe('Debug helpers', () => {
  it('shows current DOM state', () => {
    render(<LessonCard {...defaultProps} />);
    
    // Debug specific element
    debug(screen.getByTestId('lesson-card'));
    
    // Debug entire container
    debug();
  });
});
```

### 2. Custom Debug Utilities

```typescript
// __tests__/debug-utils.ts
export function logComponentProps(component: any) {
  console.log('Component props:', component.props);
  console.log('Component state:', component.state);
}

export function logTestQueries() {
  console.log('Available queries:', Object.keys(screen));
}
```

## IDE Integration

### 1. VS Code Test Configuration

```json
// .vscode/settings.json
{
  "jest.jestCommandLine": "npm run test",
  "jest.autoRun": {
    "watch": false,
    "onStartup": ["all-tests"]
  },
  "jest.showCoverageOnLoad": true,
  "typescript.preferences.includePackageJsonAutoImports": "on"
}
```

### 2. Test Scripts in package.json

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:debug": "jest --detectOpenHandles",
    "test:ci": "jest --ci --coverage --watchAll=false"
  }
}
```

## Best Practices Summary

### 1. Organization Principles
- **Co-locate tests** with source files when possible
- **Group related tests** in logical describe blocks
- **Use descriptive names** that explain behavior
- **Separate test types** (unit, integration, e2e)

### 2. Configuration Standards
- **Centralize common setup** in test utilities
- **Mock external dependencies** consistently
- **Use realistic test data** that mirrors production
- **Maintain performance budgets** for test execution

### 3. Cultural Guidelines
- **Make tests discoverable** through clear naming
- **Document test patterns** for team consistency
- **Share test utilities** across the codebase
- **Review test quality** alongside code quality

---

*This organization structure serves Oak's mission by making tests maintainable, discoverable, and culturally consistent across the development team.*