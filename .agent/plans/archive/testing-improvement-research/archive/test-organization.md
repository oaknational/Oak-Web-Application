# Test Organization and Structure

**Organizing tests for maintainability, clarity, and accessibility-first development at Oak using Jest and TypeScript**

## Overview

Test organization patterns for Oak's testing infrastructure using Jest and TypeScript.

## Directory Structure

### 1. Oak's Actual Test File Organization

Based on research of Oak's existing codebase structure:

```text
src/
├── components/
│   ├── SharedComponents/
│   │   ├── OakBox/
│   │   │   ├── OakBox.tsx
│   │   │   └── OakBox.test.tsx              # Co-located with component
│   │   ├── AppComponents/
│   │   │   ├── LessonOverviewHeader/
│   │   │   │   ├── LessonOverviewHeader.tsx
│   │   │   │   └── LessonOverviewHeader.test.tsx
│   │   └── Button/
│   │       ├── Button.tsx
│   │       └── Button.test.tsx
│   ├── TeacherComponents/
│   │   ├── LessonOverviewRequiredContent/
│   │   │   ├── LessonOverviewRequiredContent.tsx
│   │   │   └── LessonOverviewRequiredContent.test.tsx
│   └── PupilComponents/
│       ├── PupilJourneyHeader/
│       │   ├── PupilJourneyHeader.tsx
│       │   └── PupilJourneyHeader.test.tsx
├── hooks/
│   ├── useLocalStorage.ts
│   ├── useLocalStorage.test.ts             # Co-located pattern
│   ├── useOakTheme.ts
│   └── useOakTheme.test.ts
├── utils/
│   ├── curriculumApi2023/
│   │   ├── helpers.ts
│   │   └── helpers.test.ts
│   ├── curriculum/
│   │   ├── formatters.ts
│   │   └── formatters.test.ts
│   └── requestLimiter/
│       ├── requestLimiter.ts
│       └── requestLimiter.test.ts
├── pages-helpers/
│   ├── teacher/
│   │   ├── helpers/
│   │   │   ├── downloadAndShareHelpers/
│   │   │   │   ├── downloadAndShareHelpers.ts
│   │   │   │   └── downloadAndShareHelpers.test.ts
│   │   └── __tests__/
│   │       └── pages/                      # Page component tests
│   │           ├── teacher-hub.test.tsx
│   │           └── lesson-overview.test.tsx
├── pages/
│   └── api/
│       ├── curriculum/
│       │   ├── [subject].ts
│       │   └── __tests__/
│       │       └── [subject].test.ts
└── __tests__/                             # Global test configuration
    ├── __helpers__/
    │   ├── mockData/
    │   │   ├── curriculum.ts
    │   │   └── lessons.ts
    │   └── renderWithProviders.tsx          # Oak's actual test utility
    ├── setup.ts
    └── mocks/
        ├── next-router.ts
        ├── sanity-client.ts
        └── analytics.ts
```

### 2. Test Type Organization (Accessibility-Aware)

```text
# Co-located by default (Oak's current pattern)
components/Button/
├── Button.tsx
├── Button.test.tsx           # Unit tests with accessibility validation
├── Button.stories.tsx        # Storybook stories
└── Button.a11y.test.tsx      # Dedicated accessibility tests (optional)

# Specialized test types
__tests__/
├── integration/              # Cross-component interactions
│   ├── curriculum-flow.test.tsx
│   └── lesson-navigation.test.tsx
├── e2e/                     # Full user journeys (Playwright)
│   ├── teacher-lesson-planning.spec.ts
│   └── pupil-lesson-journey.spec.ts
├── visual/                  # Storybook Chromatic
│   └── component-snapshots/
└── accessibility/           # Dedicated a11y test suite
    ├── keyboard-navigation.test.tsx
    └── screen-reader.test.tsx
```

## File Naming Conventions

### 1. Test File Names

```typescript
// Unit tests - test isolated functionality
curriculumHelpers.test.ts;
calculateLessonDuration.test.ts;
formatKeyStage.test.ts;

// Integration tests - test component interactions
LessonPage.integration.test.tsx;
CurriculumBrowser.integration.test.tsx;

// API tests
api / lessons.test.ts;
api / curriculum / mathematics.test.ts;

// Hook tests
useLessonData.test.ts;
useCurriculumFilters.test.ts;
```

### 2. Accessibility-First Test Suite Organization

```typescript
// Component tests with accessibility integration
describe("LessonOverviewHeader", () => {
  describe("educational content display", () => {
    it("presents lesson title as accessible heading", () => {
      render(<LessonOverviewHeader lesson={mockLesson} />);
      expect(screen.getByRole("heading", { name: /introduction to fractions/i }))
        .toBeInTheDocument();
    });

    it("displays curriculum metadata accessibly", () => {
      // Test subject, key stage, duration are properly labeled
    });
  });

  describe("teacher interactions", () => {
    it("provides accessible download controls", () => {
      // Test download buttons have proper accessible names
      // Test keyboard navigation works
    });

    it("supports bookmark functionality for all users", () => {
      // Test both click and keyboard activation
      // Test state changes are announced to screen readers
    });
  });

  describe("accessibility compliance", () => {
    it("meets WCAG 2.1 Level AA standards", () => {
      // Test color contrast, focus management, ARIA usage
    });

    it("supports assistive technology", () => {
      // Test screen reader announcements
      // Test keyboard-only navigation
    });
  });

  describe("responsive inclusive design", () => {
    it("maintains accessibility across breakpoints", () => {
      // Test mobile, tablet, desktop maintain semantic structure
    });
  });
});

// Pure function suites with educational domain focus
describe("curriculumHelpers", () => {
  describe("areLessonsAvailable", () => {
    it("correctly identifies published lesson availability", () => {
      const lessons = [{ _state: "published" }, { _state: "new" }];
      expect(areLessonsAvailable(lessons)).toBe(true);
    });

    it("handles edge cases for teacher experience", () => {
      // Empty arrays, all draft lessons, malformed data
    });
  });

  describe("formatLessonTitle", () => {
    it("ensures consistent educational content presentation", () => {
      // Test title formatting supports screen readers
      // Test special characters are handled properly
    });
  });
});
```

## Jest Configuration for Oak

### 1. Primary Jest Configuration

```javascript
// jest.config.js - Oak's Actual Configuration Pattern
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

// Configuration based on Oak's actual setup with TypeScript and accessibility focus
const customJestConfig = {
  setupFilesAfterEnv: [
    "<rootDir>/jest.setup.js", // Oak's actual setup file
    "<rootDir>/__tests__/setup.ts", // Additional test configuration
  ],
  testEnvironment: "jest-environment-jsdom",

  // Test file patterns matching Oak's structure
  testMatch: [
    "<rootDir>/src/**/*.test.{js,jsx,ts,tsx}", // Co-located tests
    "<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}", // Test directories
    "<rootDir>/__tests__/**/*.{js,jsx,ts,tsx}", // Global tests
    "<rootDir>/pages-helpers/**/*.test.{js,jsx,ts,tsx}", // Page helper tests
  ],

  // Module mapping reflecting Oak's actual import patterns
  moduleNameMapping: {
    // Oak's component structure
    "^@/components/SharedComponents/(.*)$":
      "<rootDir>/src/components/SharedComponents/$1",
    "^@/components/TeacherComponents/(.*)$":
      "<rootDir>/src/components/TeacherComponents/$1",
    "^@/components/PupilComponents/(.*)$":
      "<rootDir>/src/components/PupilComponents/$1",

    // Oak's utility and helper patterns
    "^@/hooks/(.*)$": "<rootDir>/src/hooks/$1",
    "^@/utils/(.*)$": "<rootDir>/src/utils/$1",
    "^@/context/(.*)$": "<rootDir>/src/context/$1",
    "^@/pages-helpers/(.*)$": "<rootDir>/src/pages-helpers/$1",

    // Oak's type definitions
    "^@/common-lib/(.*)$": "<rootDir>/src/common-lib/$1",
    "^@/node-lib/(.*)$": "<rootDir>/src/node-lib/$1",

    // Test utilities and mocks
    "^@/__tests__/(.*)$": "<rootDir>/__tests__/$1",
    "^@/test-helpers/(.*)$": "<rootDir>/__tests__/__helpers__/$1",

    // Asset mocking for tests
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/__tests__/__mocks__/fileMock.js",
  },

  // TypeScript and Next.js transform configuration
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }],
  },

  // Coverage for Oak's accessibility-first development
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "src/pages-helpers/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/*.stories.{js,jsx,ts,tsx}",
    "!src/**/index.{js,jsx,ts,tsx}",
    "!src/**/__tests__/**",
    "!src/**/*.test.{js,jsx,ts,tsx}",
    // Exclude generated and configuration files
    "!src/styles/globals.css",
    "!src/types/sanity-schema.ts", // Generated types
  ],

  // Coverage thresholds encouraging accessibility-first development
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    // Higher standards for accessibility-critical components
    "src/components/**/Button/**": {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
    "src/components/**/Form/**": {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },

  // Extended timeout for accessibility testing (screen reader simulation)
  testTimeout: 15000,

  // Jest environment options for accessibility testing
  testEnvironmentOptions: {
    url: "http://localhost:3000",
  },

  // Reporters for accessibility insights
  reporters: [
    "default",
    [
      "jest-junit",
      {
        outputDirectory: "./test-results",
        outputName: "junit.xml",
        classNameTemplate: "{classname}",
        titleTemplate: "{title}",
        ancestorSeparator: " › ",
        usePathForSuiteName: true,
      },
    ],
  ],
};

module.exports = createJestConfig(customJestConfig);
```

### 2. Test Setup Configuration

```typescript
// __tests__/setup.ts - Enhanced for Accessibility-First Testing
import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';
import { server } from './mocks/server';
import { toHaveNoViolations } from 'jest-axe';

// Add jest-axe matchers for accessibility testing
expect.extend(toHaveNoViolations);

// Configure React Testing Library for accessibility-first queries
configure({
  testIdAttribute: 'data-testid',
  // Encourage accessibility queries by making getByTestId harder to use accidentally
  getElementError: (message, container) => {
    const error = new Error(
      `${message}\n\nConsider using more accessible queries first:\n` +
      `• getByRole (most accessible)\n` +
      `• getByLabelText\n` +
      `• getByPlaceholderText\n` +
      `• getByText\n` +
      `• getByDisplayValue\n` +
      `\nSee: https://testing-library.com/docs/queries/about#priority`
    );
    error.name = 'TestingLibraryElementError';
    error.stack = null;
    return error;
  }
});

// Mock Next.js router with accessibility-aware navigation
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn().mockImplementation((url) => {
        // Simulate focus management after navigation
        const mainContent = document.querySelector('main');
        if (mainContent) {
          mainContent.focus();
        }
        return Promise.resolve(true);
      }),
      replace: jest.fn(),
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

// Mock Next.js Image component with accessibility attributes
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ alt = '', ...props }: any) => {
    // Ensure alt attribute is always present for accessibility
    return <img alt={alt} {...props} />;
  },
}));

// Mock Oak's analytics to avoid side effects in tests
jest.mock('@/context/Analytics/useAnalytics', () => ({
  useAnalytics: () => ({
    track: jest.fn(),
    identify: jest.fn(),
    posthogDistinctId: 'test-id'
  })
}));

// Mock Sanity client to avoid external API calls
jest.mock('@/node-lib/sanity', () => ({
  sanityApi: {
    fetch: jest.fn().mockResolvedValue([]),
    getClient: jest.fn().mockReturnValue({
      fetch: jest.fn().mockResolvedValue([])
    })
  }
}));

// Setup MSW for API mocking
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'warn' });

  // Set up accessibility testing environment
  global.IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));

  global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));

  // Mock matchMedia for responsive testing
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

afterEach(() => {
  server.resetHandlers();
  // Clean up any focus or accessibility state between tests
  document.body.focus();
});

afterAll(() => {
  server.close();
});

// Enhanced console filtering for cleaner test output
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = (...args: any[]) => {
    // Filter out known Next.js and React warnings in test environment
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render is deprecated') ||
       args[0].includes('Warning: componentWillReceiveProps') ||
       args[0].includes('act(...)') ||
       args[0].includes('Warning: An invalid form control'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };

  console.warn = (...args: any[]) => {
    // Filter out verbose Next.js warnings in test environment
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('deprecated') ||
       args[0].includes('legacy'))
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});

// Global test utilities for accessibility
(global as any).waitForElementToBeRemoved = require('@testing-library/react').waitForElementToBeRemoved;
(global as any).axe = require('axe-core');

// Custom test environment setup for Oak's educational context
process.env.NODE_ENV = 'test';
process.env.NEXT_PUBLIC_SANITY_DATASET = 'test';
process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'test-project';
```

## Test Utilities and Helpers

### 1. Common Test Utilities

```typescript
// __tests__/test-utils.tsx - Oak's Enhanced Accessibility-First Test Utilities
import React from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'styled-components';
import { AnalyticsProvider } from '@/context/Analytics';
import { OakThemeProvider } from '@/components/SharedComponents/OakThemeProvider';
import { axe, toHaveNoViolations } from 'jest-axe';
import type { MockedFunction } from 'jest-mock';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Create test query client with Oak-specific defaults
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
        staleTime: 0,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
    logger: {
      // Suppress query errors in test environment
      log: () => {},
      warn: () => {},
      error: () => {},
    },
  });
}

// Enhanced render options for Oak testing
interface OakRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialQueryClient?: QueryClient;
  theme?: 'light' | 'dark' | 'auto';
  skipAccessibilityCheck?: boolean;
  analyticsEnabled?: boolean;
}

// Enhanced render result with accessibility testing
interface OakRenderResult extends RenderResult {
  checkAccessibility: () => Promise<void>;
}

// Custom render function matching Oak's actual renderWithProviders pattern
export function renderWithProviders(
  ui: React.ReactElement,
  {
    initialQueryClient = createTestQueryClient(),
    theme = 'light',
    skipAccessibilityCheck = false,
    analyticsEnabled = false,
    ...renderOptions
  }: OakRenderOptions = {}
): OakRenderResult {
  function Wrapper({ children }: { children: React.ReactNode }) {
    const mockAnalytics = {
      track: jest.fn(),
      identify: jest.fn(),
      posthogDistinctId: 'test-user',
      posthogConfig: {},
      isEnabled: analyticsEnabled
    };

    return (
      <QueryClientProvider client={initialQueryClient}>
        <AnalyticsProvider value={mockAnalytics}>
          <OakThemeProvider themeChoice={theme}>
            {children}
          </OakThemeProvider>
        </AnalyticsProvider>
      </QueryClientProvider>
    );
  }

  const renderResult = render(ui, { wrapper: Wrapper, ...renderOptions });

  // Add accessibility checking function
  const checkAccessibility = async () => {
    if (skipAccessibilityCheck) return;

    const results = await axe(renderResult.container);
    expect(results).toHaveNoViolations();
  };

  return {
    ...renderResult,
    checkAccessibility,
  };
}

// Utility for testing components in different themes
export function renderWithThemes(
  ui: React.ReactElement,
  options: Omit<OakRenderOptions, 'theme'> = {}
) {
  return {
    light: renderWithProviders(ui, { ...options, theme: 'light' }),
    dark: renderWithProviders(ui, { ...options, theme: 'dark' }),
  };
}

// Mock hook factory with TypeScript support
export function createMockHook<T extends (...args: any[]) => any>(
  hook: T,
  returnValue: ReturnType<T>
): MockedFunction<T> {
  return jest.fn().mockReturnValue(returnValue) as MockedFunction<T>;
}

// Accessibility-focused test utilities
export const accessibilityHelpers = {
  // Check if element has proper accessible name
  expectAccessibleName: (element: HTMLElement, expectedName: string | RegExp) => {
    const accessibleName = element.getAttribute('aria-label') ||
                          element.getAttribute('aria-labelledby') ||
                          element.textContent;
    if (typeof expectedName === 'string') {
      expect(accessibleName).toBe(expectedName);
    } else {
      expect(accessibleName).toMatch(expectedName);
    }
  },

  // Check if element is properly announced to screen readers
  expectScreenReaderText: (element: HTMLElement, expectedText: string | RegExp) => {
    const srText = element.getAttribute('aria-label') ||
                   element.getAttribute('aria-describedby') ||
                   element.textContent;
    if (typeof expectedText === 'string') {
      expect(srText).toContain(expectedText);
    } else {
      expect(srText).toMatch(expectedText);
    }
  },

  // Simulate keyboard navigation
  simulateKeyboardNavigation: async (user: any, steps: string[]) => {
    for (const step of steps) {
      await user.keyboard(step);
    }
  }
};

// Re-export everything from React Testing Library with accessibility focus
export * from '@testing-library/react';
export { renderWithProviders as render };
export { userEvent } from '@testing-library/user-event';
```

### 2. Mock Factories

```typescript
// __tests__/__helpers__/mockData/curriculum.ts - Oak's Actual Type-Safe Mock Factories

// Oak-specific lesson type based on actual schema
export interface OakLesson {
  _id: string;
  _state: "published" | "new" | "draft";
  title: string;
  slug: string;
  description?: string;
  subject: string;
  keyStage: "key-stage-1" | "key-stage-2" | "key-stage-3" | "key-stage-4";
  year?: string;
  lessonNumber: number;
  unitTitle: string;
  programmeSlug?: string;
  contentGuidance?: string[];
  supervisionLevel?: string;
  equipment?: string[];
  videoMuxPlaybackId?: string;
  videoTitle?: string;
  downloadableResources?: {
    type: string;
    label: string;
    url?: string;
  }[];
}

// Type-safe mock factories reflecting Oak's actual data structure
export function createMockLesson(
  overrides: Partial<OakLesson> = {},
): OakLesson {
  return {
    _id: "lesson-123",
    _state: "published",
    title: "Introduction to Fractions",
    slug: "introduction-to-fractions",
    description: "Learn the basics of fractions using visual representations",
    subject: "mathematics",
    keyStage: "key-stage-2",
    year: "4",
    lessonNumber: 1,
    unitTitle: "Fractions and Decimals",
    programmeSlug: "mathematics-primary-ks2",
    contentGuidance: [],
    supervisionLevel: "adult_required",
    equipment: ["A pen or pencil", "Paper", "Fraction wall (see resource)"],
    videoMuxPlaybackId: "abc123def456",
    videoTitle: "What is a fraction?",
    downloadableResources: [
      {
        type: "worksheet",
        label: "Exit ticket",
        url: "/resources/fraction-exit-ticket.pdf",
      },
      {
        type: "video",
        label: "Lesson video",
      },
    ],
    ...overrides,
  };
}

export function createMockUnit(overrides = {}) {
  return {
    _id: "unit-456",
    title: "Fractions and Decimals",
    description: "Understanding fractions and decimal representations",
    domain: "Number",
    order: 1,
    lessonCount: 12,
    estimatedLearningHours: 8,
    lessons: [createMockLesson()],
    ...overrides,
  };
}

export function createMockProgramme(overrides = {}) {
  return {
    _id: "programme-789",
    title: "Mathematics Primary Key Stage 2",
    slug: "mathematics-primary-ks2",
    subject: "mathematics",
    keyStage: "key-stage-2",
    tier: null,
    units: [createMockUnit()],
    unitCount: 12,
    lessonCount: 120,
    ...overrides,
  };
}

// Helper to create lessons with published state (commonly needed in tests)
export function createPublishedLesson(overrides = {}) {
  return createMockLesson({ _state: "published", ...overrides });
}

// Helper to create draft lessons for testing editorial workflows
export function createDraftLesson(overrides = {}) {
  return createMockLesson({ _state: "draft", ...overrides });
}

// Accessibility-focused mock with proper ARIA and semantic structure
export function createAccessibleLessonData(overrides = {}) {
  return createMockLesson({
    title: "Introduction to Fractions",
    description:
      "Learn about fractions using visual diagrams and real-world examples",
    contentGuidance: [
      "This lesson includes visual representations of fractions",
      "Students will work with physical fraction models",
    ],
    equipment: [
      "Paper with fraction diagrams (provided in resources)",
      "Coloured pencils or crayons",
      "Fraction circles or bars (if available)",
    ],
    ...overrides,
  });
}

// Mock data for testing curriculum browsing and filtering
export const mockCurriculumData = {
  mathematics: {
    "key-stage-1": [
      createMockLesson({
        keyStage: "key-stage-1",
        year: "1",
        title: "Counting to 10",
        unitTitle: "Number and Place Value",
      }),
      createMockLesson({
        keyStage: "key-stage-1",
        year: "2",
        title: "Counting to 100",
        unitTitle: "Number and Place Value",
      }),
    ],
    "key-stage-2": [
      createMockLesson({
        keyStage: "key-stage-2",
        year: "3",
        title: "Introduction to Fractions",
        unitTitle: "Fractions",
      }),
      createMockLesson({
        keyStage: "key-stage-2",
        year: "4",
        title: "Adding Fractions",
        unitTitle: "Fractions",
      }),
    ],
  },
  english: {
    "key-stage-1": [
      createMockLesson({
        subject: "english",
        keyStage: "key-stage-1",
        title: "Phonics: Phase 2",
        unitTitle: "Reading",
      }),
    ],
  },
};
```

### 3. API Mocking with MSW

```typescript
// __tests__/mocks/handlers.ts
import { rest } from "msw";
import { createMockLesson, createMockCurriculum } from "./curriculum";

export const handlers = [
  // Lesson API
  rest.get("/api/lessons/:slug", (req, res, ctx) => {
    const { slug } = req.params;
    return res(
      ctx.status(200),
      ctx.json(createMockLesson({ slug: slug as string })),
    );
  }),

  // Curriculum API
  rest.get("/api/curriculum/:subject", (req, res, ctx) => {
    const { subject } = req.params;
    return res(
      ctx.status(200),
      ctx.json(createMockCurriculum({ subject: subject as string })),
    );
  }),

  // Search API
  rest.get("/api/search/lessons", (req, res, ctx) => {
    const query = req.url.searchParams.get("q");
    return res(
      ctx.status(200),
      ctx.json({
        lessons: [createMockLesson({ title: `Search result for: ${query}` })],
        totalCount: 1,
      }),
    );
  }),
];

// __tests__/mocks/server.ts
import { setupServer } from "msw/node";
import { handlers } from "./handlers";

export const server = setupServer(...handlers);
```

## Test Data Management

### 1. Fixture Organization

```typescript
// __tests__/fixtures/curriculum-data.ts
export const mathsKS2Curriculum = {
  subject: "mathematics",
  keyStage: "ks2",
  units: [
    {
      id: "number-place-value",
      title: "Number and Place Value",
      lessons: [
        {
          id: "place-value-intro",
          title: "Introduction to Place Value",
          duration: 45,
          lessonNumber: 1,
        },
      ],
    },
  ],
};

export const englishKS1Lessons = [
  {
    id: "phonics-phase-2",
    title: "Phonics Phase 2",
    subject: "english",
    keyStage: "ks1",
    duration: 30,
  },
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
const lesson = LessonBuilder.create()
  .withTitle("Advanced Algebra")
  .withSubject("mathematics")
  .withDuration(60)
  .asCompleted()
  .build();
```

## Performance Testing Setup

### 1. Bundle Size Testing

```typescript
// __tests__/performance/bundle-size.test.ts
import { analyzeBundle } from "../utils/bundle-analyzer";

describe("Bundle Size Analysis", () => {
  it("should not exceed size thresholds", async () => {
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
  console.log("Component props:", component.props);
  console.log("Component state:", component.state);
}

export function logTestQueries() {
  console.log("Available queries:", Object.keys(screen));
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

## Accessibility-First Best Practices for Oak

### 1. Organization Principles

- **Co-locate tests** with components (Oak's current pattern)
- **Accessibility-first test structure** - organize by user experience, not implementation
- **Educational domain naming** - use Oak curriculum terminology (lessons, units, programmes)
- **Type-safe test patterns** - leverage TypeScript for better test reliability

### 2. Configuration Standards

- **Centralized accessibility testing** - jest-axe integration in every test
- **Oak-specific mocking** - Sanity CMS, analytics, and Next.js patterns
- **Realistic curriculum data** - use actual Oak lesson/unit structures in tests
- **Performance budgets** that account for accessibility testing overhead

### 3. TypeScript Integration

- **Strict type checking** in tests prevents runtime errors
- **MockedFunction** for type-safe mocking of hooks and utilities
- **Interface testing** ensures components accept correct props
- **Generic test utilities** for reusable, type-safe testing patterns

### 4. Cultural Guidelines for Oak

- **Educational context** - tests reflect teacher and student workflows
- **Inclusive design validation** - every component test includes accessibility checks
- **Curriculum-aware naming** - use real subject names, key stages, lesson titles
- **Collaborative testing** - share accessibility patterns across Teacher/Pupil components

### 5. Continuous Accessibility Integration

- **Automated a11y testing** in CI/CD pipeline
- **Coverage metrics** include accessibility test coverage
- **Performance monitoring** for screen reader compatibility
- **Documentation** that teaches accessibility-first testing patterns

---

## Quick Reference: Oak Testing Patterns

```typescript
// ✅ Accessibility-first component test
describe("LessonCard", () => {
  it("displays lesson information accessibly", async () => {
    const { checkAccessibility } = renderWithProviders(<LessonCard lesson={mockLesson} />);

    expect(screen.getByRole("heading", { name: /introduction to fractions/i }))
      .toBeInTheDocument();

    await checkAccessibility(); // Automated a11y check
  });
});

// ✅ Type-safe utility testing
describe("areLessonsAvailable", () => {
  it("correctly identifies published lessons", () => {
    const lessons: OakLesson[] = [createPublishedLesson()];
    expect(areLessonsAvailable(lessons)).toBe(true);
  });
});

// ✅ Educational workflow testing
describe("Curriculum browsing", () => {
  it("supports teacher lesson planning workflow", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CurriculumBrowser />);

    // Test accessible filtering
    await user.selectOptions(screen.getByLabelText(/subject/i), "mathematics");
    await user.selectOptions(screen.getByLabelText(/key stage/i), "key-stage-2");

    expect(screen.getByRole("list", { name: /lesson results/i }))
      .toBeInTheDocument();
  });
});
```

---

_This organization structure serves Oak's mission by making tests maintainable, discoverable, and accessible-first across the development team. Every test becomes an act of care for diverse learners and educators._
