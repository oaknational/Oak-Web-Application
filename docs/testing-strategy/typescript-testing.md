# TypeScript Testing Patterns

**Type-safe testing strategies for Oak's educational platform using Jest, React Testing Library, and TypeScript**

## Overview

TypeScript brings powerful type safety to Oak's testing strategy, enabling better test reliability, improved developer experience, and enhanced accessibility testing. This document covers patterns specific to Oak's TypeScript configuration and educational domain.

Oak's TypeScript setup uses strict type checking with educational domain modeling and accessibility-first component interfaces.

## Core TypeScript Testing Principles

### Type-Safe Test Setup

```typescript
// __tests__/types/test-types.ts - Oak's testing type definitions
import type {
  OakLesson,
  OakUnit,
  OakProgramme,
} from "@/common-lib/curriculum-api-2023/types";
import type { ComponentPropsWithoutRef, ElementRef } from "react";
import type { MockedFunction } from "jest-mock";

// Educational content types for testing
export interface TestLessonData extends Omit<OakLesson, "_id"> {
  _id?: string; // Optional for test data
}

export interface TestCurriculumFilters {
  subjects: Array<{ slug: string; title: string }>;
  keyStages: Array<{ slug: string; title: string }>;
  examBoards?: Array<{ slug: string; title: string }>;
}

// Component testing utilities
export type ComponentTestProps<T> = ComponentPropsWithoutRef<T> & {
  "data-testid"?: string;
};

// Mock function types with proper TypeScript support
export type MockedApi<T extends (...args: any[]) => any> = MockedFunction<T>;
export type MockedHook<T extends (...args: any[]) => any> = MockedFunction<T>;

// Accessibility testing types
export interface AccessibilityTestResult {
  violations: Array<{
    id: string;
    impact: "minor" | "moderate" | "serious" | "critical";
    description: string;
    nodes: Array<{ target: string[] }>;
  }>;
  passes: number;
}
```

### Type-Safe Mock Factories

```typescript
// __tests__/__helpers__/mockFactories.ts - Oak's type-safe mock system
import type { DeepPartial } from "@/common-lib/types/utility";
import type {
  OakLesson,
  OakUnit,
} from "@/common-lib/curriculum-api-2023/types";

// Generic factory pattern with type safety
export function createTypedMock<T>(
  defaultValues: T,
  overrides: DeepPartial<T> = {},
): T {
  return {
    ...defaultValues,
    ...overrides,
  } as T;
}

// Oak-specific educational content factories
export function createMockOakLesson(
  overrides: DeepPartial<OakLesson> = {},
): OakLesson {
  return createTypedMock<OakLesson>(
    {
      _id: "lesson-test-id",
      _state: "published",
      title: "Introduction to Fractions",
      slug: "introduction-to-fractions-6crp",
      subjectSlug: "mathematics",
      keyStageSlug: "ks2",
      yearTitle: "Year 3",
      unitTitle: "Fractions and Decimals",
      lessonNumber: 1,
      pupils: true,
      deprecated: false,
      contentGuidance: [],
      supervisionLevel: "adult_required",
      equipment: ["A pen or pencil", "Paper"],
      videoMuxPlaybackId: "test-video-id",
      videoTitle: "What is a fraction?",
      lessonCohort: "2023-2024",
    },
    overrides,
  );
}

export function createMockOakUnit(
  overrides: DeepPartial<OakUnit> = {},
): OakUnit {
  return createTypedMock<OakUnit>(
    {
      _id: "unit-test-id",
      title: "Fractions and Decimals",
      slug: "fractions-and-decimals",
      description: "Understanding fractions and their decimal equivalents",
      domain: "Number",
      domainId: "number-domain",
      keystageSlug: "ks2",
      keystageTitle: "Key stage 2",
      subjectSlug: "mathematics",
      subjectTitle: "Mathematics",
      yearTitle: "Year 3",
      cohort: "2023-2024",
      unitStudyOrder: 1,
      lessons: [createMockOakLesson()],
      lessonCount: 8,
      nullUnitId: null,
      programmeSlug: "mathematics-primary-ks2",
      expired: false,
      examplarQuizzes: [],
    },
    overrides,
  );
}

// Type-safe component prop builders
export function createButtonProps(
  overrides: DeepPartial<ComponentTestProps<"button">> = {},
): ComponentTestProps<"button"> {
  return {
    type: "button",
    "aria-label": "Test button",
    ...overrides,
  };
}
```

## Component Testing with TypeScript

### Type-Safe Component Testing

```typescript
// components/SharedComponents/OakButton/OakButton.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OakButton } from './OakButton';
import type { OakButtonProps } from './OakButton';

// Type-safe test props with proper component interface
const defaultProps: Required<Pick<OakButtonProps, 'variant' | 'children'>> = {
  variant: 'primary',
  children: 'Click me'
};

describe('OakButton', () => {
  it('renders with correct accessibility attributes', () => {
    const props: OakButtonProps = {
      ...defaultProps,
      'aria-label': 'Start lesson about fractions',
      disabled: false
    };

    render(<OakButton {...props} />);

    const button = screen.getByRole('button', {
      name: /start lesson about fractions/i
    });

    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type', 'button');
    expect(button).not.toBeDisabled();
  });

  it('handles click events with proper typing', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn<void, [React.MouseEvent<HTMLButtonElement>]>();

    const props: OakButtonProps = {
      ...defaultProps,
      onClick: handleClick
    };

    render(<OakButton {...props} />);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'click',
        target: button
      })
    );
  });

  it('supports different variants with type safety', () => {
    const variants: Array<OakButtonProps['variant']> = [
      'primary',
      'secondary',
      'minimal',
      'brush'
    ];

    variants.forEach(variant => {
      const { rerender } = render(
        <OakButton variant={variant}>Test Button</OakButton>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveClass(`oak-button--${variant}`);

      rerender(<div />); // Clear for next iteration
    });
  });
});
```

### Type-Safe Hook Testing

```typescript
// hooks/__tests__/useOakTheme.test.ts
import { renderHook, act } from "@testing-library/react";
import { useOakTheme } from "../useOakTheme";
import type { OakTheme, OakThemeChoice } from "@/styles/theme/types";

// Type-safe hook testing with proper return type validation
describe("useOakTheme", () => {
  it("returns correctly typed theme object", () => {
    const { result } = renderHook(() => useOakTheme());

    // TypeScript ensures we're testing the actual hook interface
    const themeHook: {
      theme: OakTheme;
      setTheme: (theme: OakThemeChoice) => void;
      themeChoice: OakThemeChoice;
    } = result.current;

    expect(themeHook.theme).toBeDefined();
    expect(themeHook.theme.colors).toBeDefined();
    expect(themeHook.theme.spacing).toBeDefined();
    expect(typeof themeHook.setTheme).toBe("function");
  });

  it("updates theme with type-safe values only", () => {
    const { result } = renderHook(() => useOakTheme());

    act(() => {
      // TypeScript prevents invalid theme choices at compile time
      result.current.setTheme("dark");
    });

    expect(result.current.themeChoice).toBe("dark");

    act(() => {
      result.current.setTheme("light");
    });

    expect(result.current.themeChoice).toBe("light");

    // This would cause TypeScript error at compile time:
    // result.current.setTheme('invalid'); // ❌ Type error
  });
});
```

## API and Service Testing with TypeScript

### Type-Safe API Mocking

```typescript
// node-lib/curriculum-api-2023/__tests__/queries.test.ts
import { lessonBrowsePageProps, programmeUnits } from "../queries";
import type { LessonBrowsePageData, ProgrammeUnitsPageData } from "../queries";
import {
  createMockOakLesson,
  createMockOakUnit,
} from "@/__tests__/__helpers__/mockFactories";

// Mock Sanity client with proper types
jest.mock("../sanity-client", () => ({
  sanityApi: {
    fetch: jest.fn<Promise<any>, [string, any?]>(),
  },
}));

import { sanityApi } from "../sanity-client";
const mockSanityFetch = sanityApi.fetch as jest.MockedFunction<
  typeof sanityApi.fetch
>;

describe("Curriculum API Queries", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("lessonBrowsePageProps", () => {
    it("returns properly typed lesson data for teachers", async () => {
      const mockSanityResponse = {
        lesson: createMockOakLesson({
          slug: "test-lesson-slug",
          title: "Algebraic Expressions",
        }),
        curriculumData: {
          subjectTitle: "Mathematics",
          keyStageTitle: "Key stage 3",
          keyStageSlug: "ks3",
        },
      };

      mockSanityFetch.mockResolvedValue(mockSanityResponse);

      const result: LessonBrowsePageData | null = await lessonBrowsePageProps({
        lessonSlug: "test-lesson-slug",
      });

      // TypeScript ensures the result matches expected interface
      expect(result).toEqual({
        lesson: expect.objectContaining({
          slug: "test-lesson-slug",
          title: "Algebraic Expressions",
          _state: "published",
        }),
        curriculumData: expect.objectContaining({
          subjectTitle: "Mathematics",
          keyStageTitle: "Key stage 3",
        }),
      });

      // Verify Sanity query with type safety
      expect(mockSanityFetch).toHaveBeenCalledWith(
        expect.stringContaining("*[slug.current == $lessonSlug]"),
        { lessonSlug: "test-lesson-slug" },
      );
    });

    it("handles missing lesson data with type safety", async () => {
      mockSanityFetch.mockResolvedValue(null);

      const result = await lessonBrowsePageProps({
        lessonSlug: "non-existent-lesson",
      });

      // TypeScript ensures null handling is explicit
      expect(result).toBeNull();
    });
  });

  describe("programmeUnits", () => {
    it("returns typed programme with units data", async () => {
      const mockProgrammeData = {
        programme: {
          title: "Mathematics Key stage 2",
          slug: "mathematics-primary-ks2",
          subjectTitle: "Mathematics",
        },
        units: [
          createMockOakUnit({
            title: "Number and Place Value",
            unitStudyOrder: 1,
          }),
          createMockOakUnit({
            title: "Addition and Subtraction",
            unitStudyOrder: 2,
          }),
        ],
      };

      mockSanityFetch.mockResolvedValue(mockProgrammeData);

      const result: ProgrammeUnitsPageData | null = await programmeUnits({
        programmeSlug: "mathematics-primary-ks2",
      });

      expect(result).toEqual({
        programme: expect.objectContaining({
          title: "Mathematics Key stage 2",
          slug: "mathematics-primary-ks2",
        }),
        units: expect.arrayContaining([
          expect.objectContaining({
            title: "Number and Place Value",
            unitStudyOrder: 1,
          }),
        ]),
      });
    });
  });
});
```

### Type-Safe Utility Function Testing

```typescript
// utils/curriculum/__tests__/formatters.test.ts
import {
  formatLessonTitle,
  formatKeyStageTitle,
  areLessonsAvailable,
  sortUnitsByOrder,
} from "../formatters";
import type {
  OakLesson,
  OakUnit,
} from "@/common-lib/curriculum-api-2023/types";
import {
  createMockOakLesson,
  createMockOakUnit,
} from "@/__tests__/__helpers__/mockFactories";

describe("Curriculum Formatters", () => {
  describe("formatLessonTitle", () => {
    it("formats lesson titles consistently with type safety", () => {
      // Input type is enforced by TypeScript
      const title: string = "introduction to fractions";
      const result: string = formatLessonTitle(title);

      expect(result).toBe("Introduction to Fractions");
      expect(typeof result).toBe("string");
    });

    it("handles edge cases with proper typing", () => {
      // TypeScript prevents passing wrong types
      expect(formatLessonTitle("")).toBe("");
      expect(formatLessonTitle("a")).toBe("A");
      expect(formatLessonTitle("ALREADY UPPERCASE")).toBe("Already Uppercase");
    });
  });

  describe("areLessonsAvailable", () => {
    it("correctly identifies published lessons with type checking", () => {
      const lessons: OakLesson[] = [
        createMockOakLesson({ _state: "published" }),
        createMockOakLesson({ _state: "draft" }),
        createMockOakLesson({ _state: "published" }),
      ];

      const result: boolean = areLessonsAvailable(lessons);
      expect(result).toBe(true);
    });

    it("handles empty arrays with type safety", () => {
      const emptyLessons: OakLesson[] = [];
      expect(areLessonsAvailable(emptyLessons)).toBe(false);
    });

    it("returns false when no published lessons exist", () => {
      const draftLessons: OakLesson[] = [
        createMockOakLesson({ _state: "draft" }),
        createMockOakLesson({ _state: "new" }),
      ];

      expect(areLessonsAvailable(draftLessons)).toBe(false);
    });
  });

  describe("sortUnitsByOrder", () => {
    it("sorts units by study order with type preservation", () => {
      const units: OakUnit[] = [
        createMockOakUnit({ title: "Unit 3", unitStudyOrder: 3 }),
        createMockOakUnit({ title: "Unit 1", unitStudyOrder: 1 }),
        createMockOakUnit({ title: "Unit 2", unitStudyOrder: 2 }),
      ];

      const sorted: OakUnit[] = sortUnitsByOrder(units);

      expect(sorted).toHaveLength(3);
      expect(sorted[0].unitStudyOrder).toBe(1);
      expect(sorted[1].unitStudyOrder).toBe(2);
      expect(sorted[2].unitStudyOrder).toBe(3);

      // Original array should not be mutated
      expect(units[0].unitStudyOrder).toBe(3);
    });

    it("handles units with same order gracefully", () => {
      const unitsWithDuplicates: OakUnit[] = [
        createMockOakUnit({ title: "Unit A", unitStudyOrder: 1 }),
        createMockOakUnit({ title: "Unit B", unitStudyOrder: 1 }),
        createMockOakUnit({ title: "Unit C", unitStudyOrder: 2 }),
      ];

      const sorted = sortUnitsByOrder(unitsWithDuplicates);
      expect(sorted).toHaveLength(3);
      expect(sorted[0].unitStudyOrder).toBe(1);
      expect(sorted[1].unitStudyOrder).toBe(1);
      expect(sorted[2].unitStudyOrder).toBe(2);
    });
  });
});
```

## Advanced TypeScript Testing Patterns

### Generic Component Testing

```typescript
// components/SharedComponents/OakSelect/OakSelect.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OakSelect } from './OakSelect';
import type { OakSelectProps } from './OakSelect';

// Type-safe option interface for educational content
interface SubjectOption {
  value: string;
  label: string;
  keyStage?: string;
}

interface KeyStageOption {
  value: string;
  label: string;
  ageRange: string;
}

describe('OakSelect Generic Component', () => {
  it('works with subject options and proper typing', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn<void, [SubjectOption]>();

    const subjectOptions: SubjectOption[] = [
      { value: 'mathematics', label: 'Mathematics', keyStage: 'ks2' },
      { value: 'english', label: 'English', keyStage: 'ks2' },
      { value: 'science', label: 'Science', keyStage: 'ks2' }
    ];

    const props: OakSelectProps<SubjectOption> = {
      options: subjectOptions,
      value: null,
      onChange: handleChange,
      placeholder: 'Select a subject',
      getOptionLabel: (option) => option.label,
      getOptionValue: (option) => option.value,
      'aria-label': 'Choose subject for lesson filtering'
    };

    render(<OakSelect {...props} />);

    const select = screen.getByLabelText(/choose subject for lesson filtering/i);
    expect(select).toBeInTheDocument();

    await user.click(select);

    const mathsOption = screen.getByText('Mathematics');
    await user.click(mathsOption);

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        value: 'mathematics',
        label: 'Mathematics',
        keyStage: 'ks2'
      })
    );
  });

  it('works with key stage options and different typing', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn<void, [KeyStageOption]>();

    const keyStageOptions: KeyStageOption[] = [
      { value: 'ks1', label: 'Key stage 1', ageRange: '5-7' },
      { value: 'ks2', label: 'Key stage 2', ageRange: '7-11' }
    ];

    const props: OakSelectProps<KeyStageOption> = {
      options: keyStageOptions,
      value: null,
      onChange: handleChange,
      placeholder: 'Select key stage',
      getOptionLabel: (option) => `${option.label} (ages ${option.ageRange})`,
      getOptionValue: (option) => option.value,
      'aria-label': 'Choose key stage for curriculum filtering'
    };

    render(<OakSelect {...props} />);

    await user.click(screen.getByLabelText(/choose key stage/i));
    await user.click(screen.getByText(/key stage 1.*ages 5-7/i));

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        value: 'ks1',
        ageRange: '5-7'
      })
    );
  });
});
```

### Type-Safe Error Boundary Testing

```typescript
// components/SharedComponents/OakErrorBoundary/OakErrorBoundary.test.tsx
import { render, screen } from '@testing-library/react';
import { OakErrorBoundary } from './OakErrorBoundary';
import type { ErrorInfo } from 'react';

// Component that throws typed errors for testing
interface TestError extends Error {
  code?: string;
  context?: 'lesson' | 'curriculum' | 'api';
}

const ThrowingComponent: React.FC<{ shouldThrow: boolean; errorType?: string }> = ({
  shouldThrow,
  errorType = 'generic'
}) => {
  if (shouldThrow) {
    const error: TestError = new Error(`Test ${errorType} error`);
    error.code = errorType;
    error.context = errorType as TestError['context'];
    throw error;
  }
  return <div>Component rendered successfully</div>;
};

describe('OakErrorBoundary', () => {
  // Suppress console.error for error boundary tests
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('catches lesson loading errors and displays appropriate message', () => {
    const onError = jest.fn<void, [TestError, ErrorInfo]>();

    render(
      <OakErrorBoundary
        onError={onError}
        fallback={({ error }) => (
          <div role="alert">
            Lesson could not be loaded: {error.message}
          </div>
        )}
      >
        <ThrowingComponent shouldThrow={true} errorType="lesson" />
      </OakErrorBoundary>
    );

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Lesson could not be loaded: Test lesson error'
    );

    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Test lesson error',
        code: 'lesson',
        context: 'lesson'
      }),
      expect.objectContaining({
        componentStack: expect.any(String)
      })
    );
  });

  it('renders children successfully when no errors occur', () => {
    render(
      <OakErrorBoundary>
        <ThrowingComponent shouldThrow={false} />
      </OakErrorBoundary>
    );

    expect(screen.getByText('Component rendered successfully')).toBeInTheDocument();
  });

  it('provides educational context in error messages', () => {
    render(
      <OakErrorBoundary
        fallback={({ error }) => (
          <div role="alert">
            <h2>Educational Content Unavailable</h2>
            <p>We're having trouble loading this lesson. Please try again or contact support.</p>
            <details>
              <summary>Technical details</summary>
              <code>{error.message}</code>
            </details>
          </div>
        )}
      >
        <ThrowingComponent shouldThrow={true} errorType="curriculum" />
      </OakErrorBoundary>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Educational Content Unavailable')).toBeInTheDocument();
    expect(screen.getByText(/we're having trouble loading this lesson/i)).toBeInTheDocument();

    // Technical details should be available but collapsed
    expect(screen.getByText('Technical details')).toBeInTheDocument();
  });
});
```

## Testing Custom Hooks with TypeScript

### Educational Domain Hooks

```typescript
// hooks/__tests__/useCurriculumData.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useCurriculumData } from '../useCurriculumData';
import type { CurriculumFilters, CurriculumData } from '../useCurriculumData';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

// Type-safe wrapper for hook testing
function createHookWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

describe('useCurriculumData', () => {
  it('returns properly typed curriculum data', async () => {
    const filters: CurriculumFilters = {
      subject: 'mathematics',
      keyStage: 'ks2',
      examBoard: null
    };

    const { result } = renderHook(
      () => useCurriculumData(filters),
      { wrapper: createHookWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // TypeScript ensures proper interface compliance
    const hookResult: {
      data: CurriculumData | undefined;
      isLoading: boolean;
      error: Error | null;
      refetch: () => void;
    } = result.current;

    expect(hookResult.data).toBeDefined();
    expect(hookResult.data?.programmes).toBeInstanceOf(Array);
    expect(hookResult.error).toBeNull();
  });

  it('handles filter changes with type safety', async () => {
    const initialFilters: CurriculumFilters = {
      subject: 'mathematics',
      keyStage: 'ks1',
      examBoard: null
    };

    const { result, rerender } = renderHook(
      ({ filters }) => useCurriculumData(filters),
      {
        wrapper: createHookWrapper(),
        initialProps: { filters: initialFilters }
      }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Change filters with type safety
    const newFilters: CurriculumFilters = {
      subject: 'english',
      keyStage: 'ks2',
      examBoard: null
    };

    rerender({ filters: newFilters });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Data should reflect new filters
    expect(result.current.data?.filters).toEqual(newFilters);
  });

  it('provides type-safe error handling', async () => {
    // Mock API to return error
    const mockFetch = jest.fn().mockRejectedValue(
      new Error('Curriculum API unavailable')
    );

    const filters: CurriculumFilters = {
      subject: 'mathematics',
      keyStage: 'ks2',
      examBoard: null
    };

    const { result } = renderHook(
      () => useCurriculumData(filters),
      { wrapper: createHookWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Error should be properly typed
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('Curriculum API unavailable');
    expect(result.current.data).toBeUndefined();
  });
});
```

## Best Practices for TypeScript Testing at Oak

### Type-Safe Test Organization

```typescript
// __tests__/types/curriculum.test-types.ts
import type {
  OakLesson,
  OakUnit,
  OakProgramme,
} from "@/common-lib/curriculum-api-2023/types";

// Test-specific type extensions
export interface TestableOakLesson extends OakLesson {
  // Additional properties for testing
  __testMetadata?: {
    createdAt: Date;
    lastModified: Date;
    testScenario: string;
  };
}

// Union types for test scenarios
export type TestScenario =
  | "happy-path"
  | "error-handling"
  | "edge-case"
  | "accessibility-focus"
  | "performance-test";

// Utility type for creating test variations
export type TestVariation<T> = {
  scenario: TestScenario;
  description: string;
  data: T;
  expectedResult?: any;
  shouldThrow?: boolean;
};

// Test suite builder type
export interface TestSuiteConfig<T> {
  name: string;
  component?: React.ComponentType<T>;
  variations: TestVariation<T>[];
  setupFn?: () => void;
  teardownFn?: () => void;
}
```

### Accessibility-First TypeScript Testing

```typescript
// utils/testing/accessibility-helpers.ts
import type { RenderResult } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

// Type-safe accessibility testing utilities
export interface AccessibilityTestConfig {
  skipAxe?: boolean;
  axeRules?: string[];
  customChecks?: Array<(container: HTMLElement) => void>;
}

export async function validateAccessibility(
  renderResult: RenderResult,
  config: AccessibilityTestConfig = {},
): Promise<void> {
  const { container } = renderResult;
  const { skipAxe = false, axeRules = [], customChecks = [] } = config;

  // Run axe-core accessibility tests
  if (!skipAxe) {
    const results = await axe(container, {
      rules:
        axeRules.length > 0
          ? Object.fromEntries(
              axeRules.map((rule) => [rule, { enabled: true }]),
            )
          : undefined,
    });
    expect(results).toHaveNoViolations();
  }

  // Run custom accessibility checks
  customChecks.forEach((check) => check(container));
}

// Type-safe keyboard navigation testing
export interface KeyboardTestSequence {
  key: string;
  expectedFocus?: string; // CSS selector or test ID
  expectedAnnouncement?: string | RegExp;
}

export async function testKeyboardNavigation(
  user: any, // userEvent instance
  sequences: KeyboardTestSequence[],
): Promise<void> {
  for (const sequence of sequences) {
    await user.keyboard(sequence.key);

    if (sequence.expectedFocus) {
      const expectedElement = document.querySelector(sequence.expectedFocus);
      expect(expectedElement).toHaveFocus();
    }

    if (sequence.expectedAnnouncement) {
      const liveRegions = document.querySelectorAll("[aria-live]");
      const announcements = Array.from(liveRegions)
        .map((region) => region.textContent)
        .join(" ");

      if (typeof sequence.expectedAnnouncement === "string") {
        expect(announcements).toContain(sequence.expectedAnnouncement);
      } else {
        expect(announcements).toMatch(sequence.expectedAnnouncement);
      }
    }
  }
}
```

## Summary: TypeScript Testing Excellence at Oak

### Core Principles

1. **Educational Domain Types** - Use Oak's actual TypeScript interfaces in tests
2. **Type-Safe Mocking** - Leverage MockedFunction and typed mock factories
3. **Accessibility Integration** - Combine TypeScript interfaces with a11y testing
4. **Error Boundary Testing** - Test error handling with proper type safety
5. **Generic Component Testing** - Test reusable components with multiple type scenarios

### Key Benefits

- **Compile-Time Safety** - Catch test errors before runtime
- **Better IntelliSense** - IDE support for test development
- **Refactoring Safety** - Tests break when interfaces change
- **Documentation** - Types serve as test documentation
- **Educational Domain Modeling** - Tests reflect Oak's curriculum concepts

### Quick Reference

```typescript
// ✅ Type-safe mock creation
const lesson = createMockOakLesson({ title: "Test Lesson" });

// ✅ Type-safe component testing
const props: OakButtonProps = { variant: "primary", children: "Click me" };

// ✅ Type-safe hook testing with proper return type validation
const { result } = renderHook(() => useOakTheme());
const themeHook: ReturnType<typeof useOakTheme> = result.current;

// ✅ Type-safe API mocking
const mockApi = jest.fn<Promise<OakLesson[]>, [string]>();

// ✅ Accessibility testing with TypeScript
await validateAccessibility(renderResult, { axeRules: ["button-name"] });
```

---

_TypeScript testing at Oak creates a robust foundation for accessible, reliable educational software through compile-time safety, educational domain modeling, and comprehensive type coverage._
