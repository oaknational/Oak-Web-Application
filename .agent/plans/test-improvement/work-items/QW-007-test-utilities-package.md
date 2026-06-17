# Implementation Guide: QW-007 - Create Test Utilities Package

**Quick Win ID**: QW-007  
**Title**: Create Test Utilities Package  
**Assignee**: AI Assistant  
**Complexity**: Medium  
**Expected Outcome**: Centralized test utilities reducing boilerplate by 50%+

## Pre-Implementation Checklist

- [ ] Audit existing test helper patterns
- [ ] Identify common test setup code
- [ ] Review renderWithTheme and similar utilities
- [ ] Plan backwards-compatible approach
- [ ] Document migration strategy

## Implementation Steps

### Step 1: Analyze Current Test Patterns

**Audit existing test utilities**:
```bash
# Find existing test helpers
find src -name "*.test.tsx" -o -name "*.test.ts" | xargs grep -l "renderWith\|createMock\|test.*[Uu]til"

# Check __helpers__ directories
find src -name "__helpers__" -type d

# Look for repeated test setup
grep -r "beforeEach\|beforeAll" src --include="*.test.*" | head -20
```

**Common patterns to consolidate**:
- Component rendering with providers
- Mock data creation
- Async testing utilities
- User event simulations
- API mocking helpers

### Step 2: Create Test Utilities Structure

**Directory structure**:
```
src/test-utils/
├── index.ts                    # Main exports
├── render.tsx                  # Rendering utilities
├── mocks.ts                   # Mock creation helpers
├── async.ts                   # Async test utilities
├── user-events.ts             # User interaction helpers
├── accessibility.ts           # A11y testing utilities
└── performance.ts             # Performance testing helpers
```

### Step 3: Implement Core Rendering Utilities

**File**: `/src/test-utils/render.tsx`

```typescript
import { ReactElement, ReactNode } from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { oakDefaultTheme } from '@oaknational/oak-components';
import userEvent from '@testing-library/user-event';

export interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  theme?: typeof oakDefaultTheme;
  queryClient?: QueryClient;
  initialRoute?: string;
  user?: ReturnType<typeof userEvent.setup>;
}

interface ProvidersProps {
  children: ReactNode;
  theme?: typeof oakDefaultTheme;
  queryClient?: QueryClient;
}

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
    logger: {
      log: () => {},
      warn: () => {},
      error: () => {},
    },
  });
}

function AllTheProviders({ 
  children, 
  theme = oakDefaultTheme,
  queryClient = createTestQueryClient(),
}: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}

/**
 * Custom render method that includes all necessary providers
 * @param ui The component to render
 * @param options Custom render options
 * @returns RenderResult with additional utilities
 */
export function renderWithProviders(
  ui: ReactElement,
  options: CustomRenderOptions = {}
): RenderResult & { user: ReturnType<typeof userEvent.setup> } {
  const {
    theme,
    queryClient,
    user = userEvent.setup(),
    ...renderOptions
  } = options;

  const result = render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders theme={theme} queryClient={queryClient}>
        {children}
      </AllTheProviders>
    ),
    ...renderOptions,
  });

  return {
    ...result,
    user,
  };
}

/**
 * Render hook with all providers
 */
export { renderHook } from '@testing-library/react';

/**
 * Re-export commonly used testing library utilities
 */
export * from '@testing-library/react';
export { userEvent };
```

### Step 4: Create Mock Utilities

**File**: `/src/test-utils/mocks.ts`

```typescript
import { Mock } from 'jest';

/**
 * Creates a properly typed mock function
 */
export function createMockFunction<T extends (...args: any[]) => any>(): Mock<
  ReturnType<T>,
  Parameters<T>
> {
  return jest.fn<ReturnType<T>, Parameters<T>>();
}

/**
 * Creates a mock with all methods mocked
 */
export function createMock<T>(
  methods: Record<keyof T, any> = {} as any
): jest.Mocked<T> {
  return methods as jest.Mocked<T>;
}

/**
 * Mock fetch for API tests
 */
export function mockFetch(response: any, options: RequestInit = {}) {
  global.fetch = jest.fn().mockResolvedValueOnce({
    ok: true,
    json: async () => response,
    text: async () => JSON.stringify(response),
    ...options,
  });
  
  return global.fetch as jest.Mock;
}

/**
 * Mock window.location
 */
export function mockLocation(url: string) {
  delete (window as any).location;
  window.location = new URL(url) as any;
  window.location.assign = jest.fn();
  window.location.replace = jest.fn();
  window.location.reload = jest.fn();
}

/**
 * Mock IntersectionObserver
 */
export function mockIntersectionObserver() {
  const mockIntersectionObserver = jest.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });
  window.IntersectionObserver = mockIntersectionObserver as any;
  
  return mockIntersectionObserver;
}
```

### Step 5: Create Async Testing Utilities

**File**: `/src/test-utils/async.ts`

```typescript
import { waitFor, waitForOptions } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

/**
 * Wait for async operations with better error messages
 */
export async function waitForAsync(
  callback: () => void | Promise<void>,
  options?: waitForOptions
): Promise<void> {
  try {
    await waitFor(callback, {
      ...options,
      onTimeout: (error) => {
        console.error('Async operation timed out. Current DOM:', document.body.innerHTML);
        return error;
      },
    });
  } catch (error) {
    throw new Error(`Async test failed: ${error.message}`);
  }
}

/**
 * Flush all promises in the queue
 */
export function flushPromises(): Promise<void> {
  return act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
}

/**
 * Wait for next tick
 */
export async function nextTick(): Promise<void> {
  return new Promise((resolve) => process.nextTick(resolve));
}

/**
 * Retry an assertion until it passes
 */
export async function retry(
  assertion: () => void,
  { times = 3, delay = 100 } = {}
): Promise<void> {
  for (let i = 0; i < times; i++) {
    try {
      assertion();
      return;
    } catch (error) {
      if (i === times - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}
```

### Step 6: Create Accessibility Testing Utilities

**File**: `/src/test-utils/accessibility.ts`

```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

/**
 * Run accessibility tests on rendered component
 */
export async function testAccessibility(container: HTMLElement) {
  const results = await axe(container, {
    rules: {
      // Disable region rule for test environment
      region: { enabled: false },
    },
  });
  
  expect(results).toHaveNoViolations();
}

/**
 * Check keyboard navigation
 */
export function testKeyboardNavigation(
  container: HTMLElement,
  expectedOrder: string[]
) {
  const focusableElements = container.querySelectorAll(
    'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const actualOrder = Array.from(focusableElements).map(
    (el) => el.getAttribute('data-testid') || el.textContent
  );
  
  expect(actualOrder).toEqual(expectedOrder);
}
```

### Step 7: Create Main Export File

**File**: `/src/test-utils/index.ts`

```typescript
// Main render utilities
export { renderWithProviders, renderHook } from './render';

// Re-export testing library
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';

// Mock utilities
export * from './mocks';

// Async utilities
export * from './async';

// Accessibility utilities
export * from './accessibility';

// Performance utilities (from QW-006)
export { measurePerformance, PerformanceCollector } from './performance';

// Common test data factories
export * from './factories';
```

### Step 8: Update Existing Tests

**Migration example**:
```typescript
// Before
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import userEvent from '@testing-library/user-event';

const queryClient = new QueryClient({ /* config */ });

const { getByText } = render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={theme}>
      <MyComponent />
    </ThemeProvider>
  </QueryClientProvider>
);

// After
import { renderWithProviders, screen } from '@/test-utils';

const { user } = renderWithProviders(<MyComponent />);
const button = screen.getByText('Click me');
await user.click(button);
```

### Step 9: Create Migration Script

**File**: `/scripts/migrate-to-test-utils.js`

```javascript
const fs = require('fs');
const path = require('path');

// Simple script to update imports
function updateTestImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Replace common patterns
  content = content.replace(
    /import \{ render \} from ['"]@testing-library\/react['"]/g,
    "import { renderWithProviders as render } from '@/test-utils'"
  );
  
  // Add migration comment
  if (content.includes('@/test-utils')) {
    content = '// TODO: Review test utility migration\n' + content;
  }
  
  fs.writeFileSync(filePath, content);
}

// Run on all test files
// Usage: node scripts/migrate-to-test-utils.js
```

## Rollback Plan

1. Test utilities are additive - existing tests continue to work
2. If issues arise, imports can be reverted
3. Keep old utilities during transition period
4. Document any breaking changes

## Success Verification

- [ ] Test utilities reduce boilerplate by 50%+
- [ ] All utilities have their own tests
- [ ] Migration guide documented
- [ ] Performance impact <5ms per test
- [ ] Team adopts utilities in new tests

## Additional Notes

### Best Practices
- Keep utilities simple and focused
- Avoid over-abstraction
- Document each utility with examples
- Maintain backwards compatibility

### Future Enhancements
- Add visual regression utilities
- Create snapshot testing helpers
- Add GraphQL mocking utilities
- Create E2E test utilities

This package will significantly improve test maintainability and reduce duplication across the codebase.