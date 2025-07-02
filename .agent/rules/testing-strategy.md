# Testing Strategy

## Core Principle

The key distinction for all tests: **side effects or no side effects**.

No side effects is STRONGLY preferred. Basic logging to console is allowed, but no other side effects are allowed.

Unit tests of PURE functions are STRONGLY preferred.

## TDD Requirement

**ALL code development or code modification MUST happen via TDD (Test-Driven Development).**

- Always write tests BEFORE writing code
- Write failing tests first, then make them pass
- No exceptions to this rule

## Test Categories

### 1. Unit Tests (Run in `pnpm test`, CI, and git hooks)

- **Definition**: Tests of pure functions with no side effects
- **Pure functions only** - no side effects whatsoever
- Test data transformations, calculations, business logic
- No I/O operations at all (no file system, network, database, console, timers, random numbers)
- Fast, deterministic, isolated
- STRONG preference for as much code as practical to be pure functions validated with unit tests
- File pattern: `*.unit.test.ts` or in `tests/unit/`

### 2. Integration Tests (Run in `pnpm test`, CI, and git hooks)

- **Definition**: Tests of code that _would_ have side effects, but those side effect causing systems have been mocked, so no actual side effects take place
- Test logical collections of units at integration boundaries
- **ALL I/O must be mocked** - no side effects whatsoever
- Test how units work together
- Still fast and deterministic
- Must have no dependence on external systems
- File pattern: `*.integration.test.ts` or in `tests/integration/`

### 3. In-Process Tests (Excluded from `pnpm test` - manual runs only)

- **Definition**: Tests of code that does cause side effects, and can be of collections of units, up to entire systems
- Can cause side effects
- May do real I/O (file system, network, databases)
- Test large sections or entire system
- May be slow, non-deterministic
- May depend on external services
- Never included in automated test runs
- Location: `tests/in-process-tests/`
- Run with: `pnpm test:in-process`

## Key Rules

Unit tests of PURE functions are STRONGLY preferred.

1. **ALL code development or modification MUST happen via TDD** - always always always TDD
2. **CI and git hooks run only unit and integration tests** - no side effects allowed
3. **Almost ALL tests must be unit tests** - prefer testing pure functions
4. **Integration tests must mock ALL I/O** - no exceptions
5. **In-process tests are for manual quality gates only** - never in automated runs
6. **All tests in `pnpm test` must be FAST and have no dependence on external systems or cause any IO**
7. **If a function under test can cause side effects, it is not a unit test** - refactor to use pure functions
8. **Always attempt to refactor before moving tests** - in-process tests are a last resort

## Writing Tests

### Unit Test Example

```typescript
/**
 * @category unit
 * Tests pure functions with no side effects
 */
describe("parseAlgorithmName", () => {
  it("should default to strange-attractor", () => {
    expect(parseAlgorithmName(undefined)).toBe("strange-attractor");
  });
});
```

### Integration Test Example

```typescript
/**
 * @category integration
 * Tests multiple units together with ALL I/O mocked
 */
describe("InventoryManager", () => {
  beforeEach(() => {
    vi.mock("fs");
    vi.mock("child_process");
  });

  it("should process inventory through multiple stages", () => {
    // Test units working together, but with mocked I/O
  });
});
```

### In-Process Test Example

```typescript
/**
 * @category in-process
 * WARNING: This test has side effects and is excluded from automated runs
 */
describe("apply-test-mode script", () => {
  it("should actually run the script and modify files", () => {
    // Real I/O operations allowed here
    execSync("tsx apply-test-mode.ts inventory.csv");
  });
});
```

## Configuration

Tests use standard Vitest configuration from `@voxquant/tooling-config`:

```typescript
// vitest.config.ts
import { defineVitestConfig } from "@voxquant/tooling-config/vitest";
export default defineVitestConfig(__dirname, "library");
```

## Test-Driven Development Process

1. **Write a failing test first** - describes what the code should do
2. **Write minimal code** - just enough to make the test pass
3. **Refactor** - improve the code while keeping tests green
4. **Repeat** - continue this cycle for each new feature or bug fix

## Running Tests

```bash
# Run all tests safe for CI (unit + integration with mocked I/O)
# This is what runs in CI/CD and git hooks - MUST be fast with no side effects
pnpm test

# Run only unit tests
pnpm test:unit

# Run only integration tests
pnpm test:integration

# Run in-process tests (manual only - has side effects!)
pnpm test:in-process

# Run everything including side-effect tests
pnpm test:all
```

## Refactoring Guide

When encountering code with side effects:

1. **Always prefer refactoring to pure functions** over moving tests
2. Extract logic from I/O operations
3. Create thin wrappers for side effects
4. Test pure functions with unit tests

### Refactoring Pattern

```typescript
// BEFORE: Mixed I/O and logic
async function processFile(filePath: string): Promise<Result> {
  const content = await fs.readFile(filePath, "utf-8");
  const lines = content.split("\n");
  const processed = lines.map((line) => line.trim().toUpperCase());
  await fs.writeFile(filePath + ".processed", processed.join("\n"));
  return { lineCount: processed.length };
}

// AFTER: Separated pure functions and I/O
// Pure function (unit testable)
export function processContent(content: string): ProcessedData {
  const lines = content.split("\n");
  const processed = lines.map((line) => line.trim().toUpperCase());
  return {
    content: processed.join("\n"),
    lineCount: processed.length,
  };
}

// Thin I/O wrapper (integration test with mocks or in-process test)
async function processFile(filePath: string): Promise<Result> {
  const content = await fs.readFile(filePath, "utf-8");
  const processed = processContent(content);
  await fs.writeFile(filePath + ".processed", processed.content);
  return { lineCount: processed.lineCount };
}
```

### Dependency Injection Pattern

For functions that must perform I/O operations, use dependency injection instead of direct imports:

```typescript
// BEFORE: Direct import makes testing difficult
import { statSync } from "fs";

export function getFileStats(filePath: string): FileStats | null {
  try {
    const stats = statSync(filePath);
    return {
      mtime: stats.mtimeMs,
      size: stats.size,
    };
  } catch {
    return null;
  }
}

// AFTER: Dependency injection for easy testing
export type StatFunction = (path: string) => Stats;

export function createGetFileStats(statFn: StatFunction) {
  return function getFileStats(filePath: string): FileStats | null {
    try {
      const stats = statFn(filePath);
      return {
        mtime: stats.mtimeMs,
        size: stats.size,
      };
    } catch {
      return null;
    }
  };
}

// In tests, pass a fake implementation:
const fakeStatFn = (path: string) => ({
  mtimeMs: 1234567890,
  size: 100,
  // ... other required Stats properties
});

const getFileStats = createGetFileStats(fakeStatFn);
// Now test without real file system access
```

This pattern allows testing with minimal effort by passing fake implementations rather than mocking imports.

## Migration Guide

When migrating existing tests:

1. **First attempt to refactor** the code to extract pure functions
2. If refactoring is possible → create unit tests for pure functions
3. If it tests multiple units with ALL I/O mocked → integration test
4. If it does ANY real I/O and cannot be refactored → in-process test

When in doubt, prefer extracting pure functions and testing those as unit tests.

## Legacy Tests

Legacy tests are tests that do not follow the above rules. They are not true unit tests, integration tests, or in-process tests.

Where we find legacy tests, we must assess them, relocate them to the appropriate category, and refactor them to follow the above rules.

## Reference

[Testing Architecture](../architecture/core-patterns/testing-architecture.md)

# Testing Architecture

## Overview

This document outlines the testing architecture, patterns, and strategies used across the VoxQuant platform. Our testing approach emphasizes reliability, maintainability, and edge-runtime compatibility.

## Testing Philosophy

### Core Principles

1. **Test-Driven Development (TDD)**: MANDATORY - ALL code development or modification MUST happen via TDD. Always always always TDD. No exceptions.
2. **Pure Functions First**: STRONG preference for as much code as practical to be pure functions validated with unit tests
3. **Test the Contract, Not Implementation**: Focus on behavior
4. **Mock at Boundaries**: Only mock external dependencies that cause side effects
5. **Fast and Deterministic**: All tests in `pnpm test` must be FAST with no external dependencies
6. **Edge-Runtime Compatible**: Tests run in all environments
7. **No Side Effects in CI**: If a function under test can cause side effects, it is not a unit test - refactor to use pure functions

## Test Categories

### 1. Unit Tests

**Purpose**: Test pure functions with no side effects whatsoever

**Requirements**:

- Must test ONLY pure functions
- No I/O operations (file system, network, database, console, timers, random numbers)
- Fast, deterministic, isolated
- This is where the majority of tests should be

```typescript
// Named: *.unit.test.ts
// Location: Co-located with source

describe("parsePrice", () => {
  it("should parse valid price strings", () => {
    expect(parsePrice("$123.45")).toBe(123.45);
    expect(parsePrice("€99.99")).toBe(99.99);
  });

  it("should throw for invalid input", () => {
    expect(() => parsePrice("invalid")).toThrow(ValidationError);
  });
});
```

### 2. Integration Tests

**Purpose**: Test code that would have side effects, but with all side-effect-causing systems mocked

**Requirements**:

- ALL I/O must be mocked - no actual side effects
- Tests logical collections of units at integration boundaries
- Still fast and deterministic
- No dependence on external systems

```typescript
// Named: *.integration.test.ts
// Location: Co-located with source

describe("RedditService Integration", () => {
  let service: RedditService;
  let mockHttpClient: MockHttpClient;

  beforeEach(() => {
    mockHttpClient = new MockHttpClient();
    service = new RedditService(mockHttpClient);
  });

  it("should fetch and parse posts", async () => {
    mockHttpClient.mockResponse("/api/posts", mockPostsResponse);

    const posts = await service.getPosts("subreddit");

    expect(posts).toHaveLength(25);
    expect(posts[0]).toMatchObject({
      id: expect.any(String),
      title: expect.any(String),
    });
  });
});
```

### 3. Contract Tests

**Purpose**: Verify API contracts remain stable

```typescript
// Named: *.contract.test.ts
// Location: tests/contract/

describe("Reddit API Contract", () => {
  it("should match expected listing response shape", async () => {
    const response = await loadFixture("listing-response.json");

    expect(() => ListingSchema.parse(response)).not.toThrow();
  });
});
```

### 4. In-Process Tests

**Purpose**: Tests that do cause side effects, can test collections of units up to entire systems

**Requirements**:

- Can perform real I/O operations
- May depend on external services
- May be slow, non-deterministic
- NEVER included in `pnpm test` or automated CI/CD
- Manual runs only

**When In-Process Tests Are Appropriate**:

- End-to-end system validation
- Testing actual third-party API integrations
- Performance benchmarks with real resources
- Database migration scripts
- Deployment verification scripts

**When Refactoring Is Not Practical**:

- The primary purpose is to test the integration itself
- The code is a thin wrapper around external services
- The value is in verifying actual system behavior
- Performance characteristics of real systems need testing

```typescript
// Located in: tests/in-process-tests/
// Run with: pnpm test:in-process

describe("Full System Integration", () => {
  it("should actually connect to database", async () => {
    const db = await connectToDatabase();
    const result = await db.query("SELECT 1");
    expect(result).toBeDefined();
  });
});
```

### 5. Smoke Tests

**Purpose**: Basic functionality verification (subset of integration tests)

```typescript
// Named: *.smoke.test.ts
// Location: tests/smoke/

describe("SDK Smoke Tests", () => {
  it("should initialize without errors", () => {
    expect(() =>
      initSdk({
        clientId: "test",
        clientSecret: "test",
      }),
    ).not.toThrow();
  });

  it("should export expected API", () => {
    const sdk = initSdk(testConfig);
    expect(sdk).toHaveProperty("auth");
    expect(sdk).toHaveProperty("listings");
    expect(sdk).toHaveProperty("posts");
  });
});
```

## Test-Driven Development Process

### The TDD Cycle

1. **Red**: Write a failing test that describes desired behavior
2. **Green**: Write minimal code to make the test pass
3. **Refactor**: Improve the code while keeping tests green

### TDD Rules

- **Never write production code without a failing test**
- **Write only enough test code to fail**
- **Write only enough production code to pass the failing test**
- **Refactor only when tests are green**

### Example TDD Flow

```typescript
// Step 1: Write failing test
describe("calculateDiscount", () => {
  it("should apply 10% discount for orders over $100", () => {
    expect(calculateDiscount(150)).toBe(15);
  });
});
// Test fails: calculateDiscount is not defined

// Step 2: Write minimal code to pass
function calculateDiscount(amount: number): number {
  return 15;
}
// Test passes but implementation is naive

// Step 3: Write another failing test to drive correct implementation
it("should apply 10% discount for any order over $100", () => {
  expect(calculateDiscount(200)).toBe(20);
  expect(calculateDiscount(100)).toBe(0);
});
// Test fails: returns 15 for all inputs

// Step 4: Fix implementation
function calculateDiscount(amount: number): number {
  return amount > 100 ? amount * 0.1 : 0;
}
// All tests pass

// Step 5: Refactor if needed (while keeping tests green)
```

## Testing Patterns

### 1. Arrange-Act-Assert (AAA)

```typescript
describe("TickerExtractor", () => {
  it("should extract valid tickers", () => {
    // Arrange
    const text = "I bought $AAPL and $GOOGL today";
    const extractor = new TickerExtractor();

    // Act
    const tickers = extractor.extract(text);

    // Assert
    expect(tickers).toEqual(["AAPL", "GOOGL"]);
  });
});
```

### 2. Test Data Builders

```typescript
class PostBuilder {
  private post: Partial<Post> = {
    id: "default-id",
    title: "Default Title",
    author: "default-author",
    created: Date.now(),
  };

  withId(id: string): this {
    this.post.id = id;
    return this;
  }

  withTitle(title: string): this {
    this.post.title = title;
    return this;
  }

  build(): Post {
    return this.post as Post;
  }
}

// Usage
const post = new PostBuilder()
  .withTitle("Test Post")
  .withId("test-123")
  .build();
```

### 3. Parameterized Tests

```typescript
describe.each([
  ["$AAPL", "AAPL"],
  ["$MSFT", "MSFT"],
  ["$", null],
  ["$123", null],
  ["$_ABC", null],
])("parseTicker(%s)", (input, expected) => {
  it(`should return ${expected}`, () => {
    expect(parseTicker(input)).toBe(expected);
  });
});
```

### 4. Boundary Testing

```typescript
describe("RateLimiter", () => {
  describe("boundary conditions", () => {
    it("should handle exactly rate limit", async () => {
      const limiter = new RateLimiter({ limit: 100, window: 60000 });

      // Make exactly 100 requests
      for (let i = 0; i < 100; i++) {
        expect(await limiter.checkLimit()).toBe(true);
      }

      // 101st request should be rate limited
      expect(await limiter.checkLimit()).toBe(false);
    });
  });
});
```

## Mocking Strategies

### 1. Interface-Based Mocks

```typescript
interface ITimeProvider {
  now(): number;
}

class SystemTimeProvider implements ITimeProvider {
  now(): number {
    return Date.now();
  }
}

class MockTimeProvider implements ITimeProvider {
  constructor(private time: number) {}

  now(): number {
    return this.time;
  }

  advance(ms: number): void {
    this.time += ms;
  }
}
```

### 2. HTTP Mocking

```typescript
class MockHttpClient implements IHttpClient {
  private handlers: Array<{
    matcher: (config: RequestConfig) => boolean;
    response: () => Promise<HttpResponse<unknown>>;
  }> = [];

  onRequest(
    matcher: (config: RequestConfig) => boolean,
    response: () => Promise<HttpResponse<unknown>>,
  ): void {
    this.handlers.push({ matcher, response });
  }

  async request<T>(config: RequestConfig): Promise<HttpResponse<T>> {
    const handler = this.handlers.find((h) => h.matcher(config));
    if (!handler) {
      throw new Error(`Unexpected request: ${config.method} ${config.url}`);
    }
    return handler.response() as Promise<HttpResponse<T>>;
  }
}
```

### 3. Vitest Mocking

```typescript
import { vi, describe, it, expect } from "vitest";

// Mock module
vi.mock("../logger", () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

// Mock timers
describe("Retry Logic", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should retry with exponential backoff", async () => {
    const operation = vi
      .fn()
      .mockRejectedValueOnce(new Error("Fail 1"))
      .mockRejectedValueOnce(new Error("Fail 2"))
      .mockResolvedValueOnce("Success");

    const promise = retryWithBackoff(operation);

    // Fast-forward through retries
    await vi.advanceTimersByTimeAsync(1000);
    await vi.advanceTimersByTimeAsync(2000);

    expect(await promise).toBe("Success");
    expect(operation).toHaveBeenCalledTimes(3);
  });
});
```

## Test Organization

### Directory Structure

```
package/
├── src/
│   ├── feature/
│   │   ├── service.ts
│   │   ├── service.unit.test.ts      # Unit tests (pure functions)
│   │   ├── service.integration.test.ts # Integration tests (mocked I/O)
│   │   └── types.ts
│   └── utils/
│       ├── parser.ts
│       └── parser.unit.test.ts
├── tests/
│   ├── unit/                          # Additional unit tests
│   ├── integration/                   # Additional integration tests
│   ├── in-process-tests/              # Tests with side effects (manual only)
│   │   └── full-system.test.ts
│   ├── contract/                      # API contract tests
│   │   └── reddit-api.contract.test.ts
│   ├── smoke/                         # Smoke tests
│   │   └── sdk-initialization.smoke.test.ts
│   └── fixtures/                      # Test data
│       └── responses/
│           └── listing.json
└── vitest.config.ts
```

### Configuration Management

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "edge-runtime",
    include: ["src/**/*.{test,spec}.ts", "tests/**/*.{test,spec}.ts"],
    exclude: [
      "tests/in-process-tests/**", // NEVER run automatically - has side effects
      "tests/smoke/**", // Run separately
      "tests/contract/**", // Run separately
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: ["src/**/*.ts"],
      exclude: ["src/**/*.test.ts", "src/**/*.spec.ts", "src/types/**"],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
});
```

## Coverage Strategy

### Coverage Targets

- **Lines**: >90% for SDKs, >80% for apps
- **Branches**: >85% for critical paths
- **Functions**: >90% for public APIs
- **Statements**: >85% overall

### What to Test

1. **Always Test**:

   - Public API surface
   - Error conditions
   - Edge cases and boundaries
   - State transitions
   - Async operations

2. **Consider Testing**:

   - Complex internal logic
   - Performance-critical code
   - Security-sensitive operations

3. **Don't Test**:
   - Third-party libraries
   - Simple getters/setters
   - Framework code
   - Types/interfaces

## Mutation Testing

### Configuration

```javascript
// stryker.config.mjs
export default {
  packageManager: "pnpm",
  testRunner: "vitest",
  mutate: [
    "src/**/*.ts",
    "!src/**/*.test.ts",
    "!src/**/*.spec.ts",
    "!src/types/**",
  ],
  thresholds: {
    high: 90,
    low: 80,
    break: 20, // Target <20% survival
  },
};
```

### Improving Mutation Score

```typescript
// Weak test - mutations survive
it("should calculate total", () => {
  const result = calculateTotal([10, 20, 30]);
  expect(result).toBeDefined();
});

// Strong test - kills mutations
it("should calculate total", () => {
  expect(calculateTotal([10, 20, 30])).toBe(60);
  expect(calculateTotal([])).toBe(0);
  expect(calculateTotal([0])).toBe(0);
  expect(calculateTotal([-10, 10])).toBe(0);
});
```

## Performance Testing

### Benchmarking

```typescript
import { bench, describe } from "vitest";

describe("Parser Performance", () => {
  bench("parse small payload", () => {
    parseResponse(smallPayload);
  });

  bench("parse large payload", () => {
    parseResponse(largePayload);
  });

  bench("parse with validation", () => {
    parseResponse(payload, { validate: true });
  });
});
```

### Load Testing

```typescript
describe("Rate Limiter Load Test", () => {
  it("should handle burst traffic", async () => {
    const limiter = new RateLimiter({ limit: 1000, window: 1000 });
    const start = Date.now();

    // Simulate burst
    const requests = Array(1000)
      .fill(0)
      .map(() => limiter.checkLimit());

    const results = await Promise.all(requests);
    const duration = Date.now() - start;

    expect(results.filter((r) => r === true)).toHaveLength(1000);
    expect(duration).toBeLessThan(100); // Should be fast
  });
});
```

## Edge Runtime Testing

### Environment Detection

```typescript
describe("Edge Compatibility", () => {
  it("should not use Node.js APIs", () => {
    // This test will fail in edge runtime if Node APIs are used
    expect(typeof process).toBe("undefined");
    expect(typeof require).toBe("undefined");
    expect(typeof __dirname).toBe("undefined");
  });

  it("should use Web APIs", () => {
    expect(typeof fetch).toBe("function");
    expect(typeof URL).toBe("function");
    expect(typeof TextEncoder).toBe("function");
  });
});
```

### Platform-Specific Tests

```typescript
import { runtime } from "../runtime";

describe.skipIf(!runtime.isCloudflareWorkers)("Cloudflare Features", () => {
  it("should access KV store", async () => {
    const kv = getKVNamespace();
    await kv.put("test", "value");
    expect(await kv.get("test")).toBe("value");
  });
});
```

## Continuous Integration

### Test Pipeline

```yaml
test:
  runs-on: ubuntu-latest
  strategy:
    matrix:
      node: [18, 20]
      environment: [node, edge-runtime]
  steps:
    - name: Unit Tests
      run: pnpm test:unit

    - name: Integration Tests
      run: pnpm test:integration

    - name: Coverage
      run: pnpm coverage

    - name: Mutation Testing
      run: pnpm mutate
      if: matrix.node == 20
```

## Refactoring Patterns for Testability

### Pattern 1: Extract Pure Functions from I/O

```typescript
// BEFORE: Untestable without I/O
class ConfigLoader {
  async loadConfig(): Promise<Config> {
    const data = await fs.readFile("config.json", "utf-8");
    const parsed = JSON.parse(data);
    if (!parsed.version || parsed.version < 2) {
      throw new Error("Invalid config version");
    }
    return parsed;
  }
}

// AFTER: Testable pure function + thin I/O wrapper
// Pure function
export function validateConfig(data: unknown): Config {
  if (!isConfig(data)) {
    throw new Error("Invalid config format");
  }
  if (!data.version || data.version < 2) {
    throw new Error("Invalid config version");
  }
  return data;
}

// I/O wrapper
class ConfigLoader {
  async loadConfig(): Promise<Config> {
    const data = await fs.readFile("config.json", "utf-8");
    const parsed = JSON.parse(data);
    return validateConfig(parsed);
  }
}
```

### Pattern 2: Dependency Injection for Side Effects

```typescript
// BEFORE: Hard-coded side effects
class NotificationService {
  async notify(message: string) {
    const formatted = `[${new Date().toISOString()}] ${message}`;
    await fetch("/api/notify", { method: "POST", body: formatted });
    console.log(formatted);
  }
}

// AFTER: Injected dependencies, pure formatting
interface Logger {
  log(message: string): void;
}

interface HttpClient {
  post(url: string, data: unknown): Promise<void>;
}

// Pure function
export function formatNotification(message: string, timestamp: Date): string {
  return `[${timestamp.toISOString()}] ${message}`;
}

// Testable with mocks
class NotificationService {
  constructor(
    private http: HttpClient,
    private logger: Logger,
    private clock: () => Date = () => new Date(),
  ) {}

  async notify(message: string) {
    const formatted = formatNotification(message, this.clock());
    await this.http.post("/api/notify", formatted);
    this.logger.log(formatted);
  }
}
```

## Best Practices

1. **Always Use TDD**: Write tests first, always always always TDD
2. **Write Pure Functions**: If a function can cause side effects, refactor it to be pure
3. **Extract Logic from I/O**: Separate business logic from side effects
4. **Keep Tests Simple**: Each test should verify one thing
5. **Use Descriptive Names**: Test names should explain what and why
6. **Avoid Test Interdependence**: Tests must run in any order
7. **Clean Up After Tests**: Reset state, clear mocks
8. **Prefer Unit Tests of Pure Functions**: Fastest and most reliable
9. **Test User Journeys**: Not just individual functions
10. **Make Tests Fast**: All tests in `pnpm test` must be fast with no I/O
11. **Review Test Code**: Tests need the same quality as production code
12. **No Side Effects in CI**: Only unit and integration tests with mocked I/O
13. **Refactor Before Moving**: Always attempt to refactor to pure functions before moving tests to in-process
