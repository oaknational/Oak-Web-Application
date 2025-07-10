# API Routes Test Coverage Analysis

**Purpose**: Identify API routes missing test coverage  
**Finding**: 100% of API routes have test files ✅  
**Date**: July 9, 2025

## Executive Summary

**Great news!** All API routes in Oak's codebase have corresponding test files. This is exceptional and shows strong testing discipline for API endpoints.

## API Routes Inventory

### Pages API Routes (`src/pages/api/`)

| Route | Test Location | Complexity |
|-------|---------------|------------|
| `/api/curriculum-downloads/index.ts` | `__tests__/pages/api/curriculum-downloads/index.test.ts` | High (325 lines) |
| `/api/educator/getSavedContentLists/index.tsx` | `__tests__/pages/api/educator/getSavedContentLists/index.test.tsx` | Medium |
| `/api/educator/getSavedUnitCount/index.ts` | `__tests__/pages/api/educator/getSavedUnitCount/index.test.ts` | Low |
| `/api/educator/getSavedUnits/[programmeSlug].ts` | `__tests__/pages/api/educator/getSavedUnits/[programmeSlug].test.ts` | Medium |
| `/api/educator/saveUnit/[programmeSlug]/[unitSlug].ts` | `__tests__/pages/api/educator/saveUnit/[programmeSlug]/[unitSlug].test.ts` | Medium |
| `/api/educator/unsaveUnit/[programmeSlug]/[unitSlug].ts` | `__tests__/pages/api/educator/unsaveUnit/[programmeSlug]/[unitSlug].test.ts` | Medium |
| `/api/exit-preview/[[...path]].ts` | `__tests__/pages/api/exit-preview/[[...path]].test.ts` | Low |
| `/api/health.ts` | `__tests__/pages/api/health.test.ts` | Low |
| `/api/hubspot/contact-lookup/index.ts` | Same directory `.test.ts` | Medium |
| `/api/hubspot/contacts/index.ts` | Same directory `.test.ts` | Medium |
| `/api/hubspot/subscription/index.ts` | Same directory `.test.ts` | Medium |
| `/api/preview/[[...path]].ts` | `__tests__/pages/api/preview/[[...path]].test.ts` | Low |
| `/api/video/signed-url.ts` | `__tests__/pages/api/video/signed-url.test.ts` | Medium |

### App API Routes (`src/app/api/`)

| Route | Test Location | Purpose |
|-------|---------------|---------|
| `/api/auth/onboarding/route.ts` | Same directory `route.test.ts` | Authentication |
| `/api/webhooks/route.ts` | Same directory `route.test.ts` | External webhooks |

## Test Organization Patterns

### Pattern 1: Co-located Tests

HubSpot APIs keep tests next to implementation:

```text
hubspot/
├── contacts/
│   ├── index.ts
│   └── index.test.ts
```

### Pattern 2: Centralized Tests

Most APIs have tests in `__tests__` directory:

```text
__tests__/pages/api/
├── curriculum-downloads/
│   └── index.test.ts
├── educator/
│   └── [various test files]
```

## Quality Considerations

While all routes have test files, we should verify:

### 1. Test Completeness

- Are all endpoints tested (GET, POST, PUT, DELETE)?
- Are error cases covered?
- Is authentication/authorization tested?

### 2. Complex API Testing

**`curriculum-downloads/index.ts`** (325 lines) needs:

- Unit tests for extracted business logic
- Integration tests for the full flow
- Performance tests for document generation
- Error handling for each external service

### 3. External Service Mocking

APIs calling external services should test:

- Success responses
- Error responses
- Timeout scenarios
- Rate limiting

## Recommendations

### 1. Review Test Quality

While coverage exists, ensure tests follow best practices:

```typescript
// Good API test pattern
describe('/api/educator/saveUnit', () => {
  it('saves unit for authenticated teacher', async () => {
    // Arrange
    const mockAuth = createMockAuth({ role: 'teacher' });
    const { req, res } = createMocks({
      method: 'POST',
      body: { unitId: 'unit-123' },
    });
    
    // Act
    await handler(req, res);
    
    // Assert
    expect(res._getStatusCode()).toBe(200);
    expect(mockDatabase.save).toHaveBeenCalledWith(
      expect.objectContaining({ unitId: 'unit-123' })
    );
  });
  
  it('returns 401 for unauthenticated requests', async () => {
    // Test auth failure
  });
  
  it('returns 400 for invalid data', async () => {
    // Test validation
  });
});
```

### 2. Extract Business Logic

For complex APIs like `curriculum-downloads`:

- Move logic to service classes
- Test services independently
- Keep API routes thin

### 3. Performance Testing

Add performance tests for heavy operations:

```typescript
it('generates curriculum document within 2 seconds', async () => {
  const start = performance.now();
  
  const response = await testApiHandler(handler, {
    query: validQueryParams,
  });
  
  const duration = performance.now() - start;
  expect(duration).toBeLessThan(2000);
});
```

## Next Steps

Since API test coverage is complete, focus on:

1. Reviewing test quality using the rubric
2. Extracting business logic from complex APIs
3. Adding performance benchmarks
4. Ensuring consistent error handling

## Success Metric

**Current**: 100% of API routes have test files ✅  
**Target**: 100% of API routes have high-quality tests (8+/10 on rubric)

This excellent API test coverage provides a strong foundation for the testing improvement initiative.
