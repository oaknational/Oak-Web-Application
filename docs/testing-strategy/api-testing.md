# API Testing Strategy

Testing Next.js API routes and external service integrations with comprehensive mocking patterns.

## API Test Architecture

### Route Handler Testing Pattern

All API tests are **out-of-process** with external dependencies mocked:

```typescript
import { createMocks } from 'node-mocks-http';
import handler from '../../../pages/api/lessons/[lessonId]';

// Mock external dependencies
jest.mock('../../../node-lib/sanity-client');
jest.mock('../../../common-lib/analytics');

describe('/api/lessons/[lessonId]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return lesson data for valid lesson ID', async () => {
    const mockLesson = createMockCurriculumLesson({
      slug: 'fractions-introduction',
      subject: 'Mathematics',
      keyStage: 'ks2'
    });

    // Mock Sanity CMS response
    mockSanityClient.fetch.mockResolvedValue(mockLesson);

    const { req, res } = createMocks({
      method: 'GET',
      query: { lessonId: 'fractions-introduction' }
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({
      lesson: mockLesson,
      downloadPermissions: expect.objectContaining({
        canDownload: true,
        region: 'GB'
      })
    });
  });
});
```

### Error Handling Testing

```typescript
describe('API error scenarios', () => {
  it('should handle Sanity CMS service unavailable', async () => {
    mockSanityClient.fetch.mockRejectedValue(
      new Error('Service temporarily unavailable')
    );

    const { req, res } = createMocks({
      method: 'GET',
      query: { lessonId: 'valid-lesson' }
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(503);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Service temporarily unavailable',
      retryAfter: 60
    });
  });

  it('should validate lesson ID format', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: { lessonId: 'invalid-id-format-123' }
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Invalid lesson ID format',
      expectedFormat: 'slug-format-with-hyphens'
    });
  });
});
```

### Authentication & Authorization Testing

```typescript
describe('API authentication', () => {
  it('should require valid teacher authentication', async () => {
    mockClerkAuth.getAuth.mockReturnValue({
      userId: null,
      user: null
    });

    const { req, res } = createMocks({
      method: 'POST',
      body: { action: 'download' }
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(401);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Authentication required',
      redirectUrl: '/sign-in'
    });
  });

  it('should verify teacher permissions for region-restricted content', async () => {
    mockClerkAuth.getAuth.mockReturnValue({
      userId: 'teacher-123',
      user: { region: 'US' }
    });

    const { req, res } = createMocks({
      method: 'GET',
      query: { lessonId: 'uk-only-lesson' }
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(403);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Content not available in your region',
      availableRegions: ['GB']
    });
  });
});
```

### External Service Contract Testing

```typescript
describe('HubSpot integration contract', () => {
  it('should send properly formatted contact data', async () => {
    const expectedContactData = {
      properties: {
        email: 'teacher@school.edu',
        region: 'GB',
        oak_user_type: 'teacher',
        registration_source: 'lesson_download'
      }
    };

    mockHubSpotClient.contacts.create.mockResolvedValue({
      id: '12345',
      properties: expectedContactData.properties
    });

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        email: 'teacher@school.edu',
        region: 'GB'
      }
    });

    await handler(req, res);

    expect(mockHubSpotClient.contacts.create).toHaveBeenCalledWith(
      expectedContactData
    );
    expect(res._getStatusCode()).toBe(201);
  });
});
```

## API Test Quality Standards

### Performance Requirements
- **Target**: <200ms per test
- **Maximum**: <500ms per test
- **Rationale**: Mocked external services should be fast

### Coverage Requirements
- **Happy path**: All successful operations
- **Error states**: Network failures, service unavailable, timeouts
- **Validation**: Input validation, schema compliance
- **Authentication**: All auth states (authenticated, unauthenticated, unauthorized)
- **Edge cases**: Malformed data, unexpected responses

### Mocking Strategy

```typescript
// Good: Mock at module boundary
jest.mock('../../../node-lib/sanity-client', () => ({
  sanityClient: {
    fetch: jest.fn(),
    getDocument: jest.fn()
  }
}));

// Good: Mock external HTTP clients
jest.mock('../../../common-lib/hubspot-client', () => ({
  hubSpotClient: {
    contacts: {
      create: jest.fn(),
      update: jest.fn()
    }
  }
}));

// Avoid: Mocking internal business logic
// jest.mock('../../../utils/validate-lesson-permissions'); // Don't do this
```

## Test Data Management

### Realistic Test Data

```typescript
// Good: Domain-specific test data
const createMockCurriculumLesson = (overrides = {}) => ({
  slug: 'fractions-introduction',
  title: 'Introduction to Fractions',
  subject: 'Mathematics',
  keyStage: 'ks2',
  learningObjectives: [
    'Understand what a fraction represents',
    'Identify numerator and denominator',
    'Compare simple fractions'
  ],
  resources: {
    slidesPdf: 'https://cdn.oak.org.uk/lessons/fractions-intro-slides.pdf',
    worksheetPdf: 'https://cdn.oak.org.uk/lessons/fractions-intro-worksheet.pdf'
  },
  duration: 60,
  ...overrides
});

// Good: Edge case test data
const createMockEmptyLesson = () => ({
  slug: 'empty-lesson',
  title: '',
  resources: {},
  learningObjectives: []
});
```

## Integration with Frontend

### API Contract Validation

```typescript
// Ensure API responses match frontend expectations
describe('API contract compliance', () => {
  it('should return lesson data in format expected by frontend', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: { lessonId: 'test-lesson' }
    });

    await handler(req, res);

    const responseData = JSON.parse(res._getData());
    
    // Validate against TypeScript interface
    expect(responseData.lesson).toMatchSchema(LessonDataSchema);
    expect(responseData.downloadPermissions).toMatchSchema(PermissionsSchema);
  });
});
```

## Related Documents

- [Test Quality Rubrics](./test-quality-rubrics.md) - Quality standards for API tests
- [Next.js Testing](./nextjs-testing.md) - Framework-specific patterns
- [Core Principles](./core-principles.md) - Testing philosophy