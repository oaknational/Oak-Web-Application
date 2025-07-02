# Testing Best Practices Research

**Comprehensive research on modern testing methodologies to inform Oak's testing strategy transformation**

## React Testing Library Best Practices

### Core Philosophy by Kent C. Dodds

React Testing Library follows the principle: **"The more your tests resemble the way your software is used, the more confidence they can give you."**

Key tenets:
- Focus on user behavior, not implementation details
- Tests should work with actual DOM nodes, not React component instances
- Encourage accessibility through testing approach
- Make tests maintainable through refactoring

### Query Priority Hierarchy

**1. getByRole (Highest Priority)**
- Queries elements by accessibility role
- Ensures UI is accessible by default
- Most resilient to changes
- Use with `name` option for accessible name matching

```typescript
// Preferred - tests accessibility and functionality
screen.getByRole('button', { name: /submit/i })
screen.getByRole('textbox', { name: /email address/i })
screen.getByRole('heading', { level: 2 })
```

**2. getByLabelText (Forms)**
- Essential for form testing
- Ensures proper form accessibility
- Tests label-input associations

```typescript
// Form elements with proper labels
screen.getByLabelText(/password/i)
screen.getByLabelText(/confirm password/i)
```

**3. getByText (Content)**
- For text content outside forms
- Primary way users find non-interactive elements
- Should be used carefully as text can change

```typescript
// Visible text content
screen.getByText(/learn about fractions/i)
screen.getByText(/lesson complete/i)
```

**4. getByTestId (Last Resort)**
- Only for dynamic content or when other queries don't work
- Does not promote accessibility
- Most stable but least user-like

### Modern React Component Testing Patterns

#### User-Centric Testing
```typescript
// Good - tests user behavior
await user.click(screen.getByRole('button', { name: /start lesson/i }))
expect(screen.getByText(/lesson started/i)).toBeInTheDocument()

// Avoid - tests implementation
expect(component.state.isStarted).toBe(true)
```

#### Accessibility-First Approach
```typescript
// Tests both functionality and accessibility
const lessonCard = screen.getByRole('article', { name: /fractions lesson/i })
const startButton = within(lessonCard).getByRole('button', { name: /start/i })
await user.click(startButton)
```

#### Async Testing Patterns
```typescript
// Wait for elements to appear
await waitFor(() => {
  expect(screen.getByText(/lesson loaded/i)).toBeInTheDocument()
})

// Find elements that will appear
const successMessage = await screen.findByText(/lesson saved/i)
```

## Jest Configuration Best Practices

### Essential Jest Setup
```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/index.{js,ts}'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
}
```

### Mocking Strategies
```typescript
// Mock at boundaries, not internals
jest.mock('../api/lessons', () => ({
  fetchLesson: jest.fn(),
  saveLesson: jest.fn()
}))

// Mock external dependencies
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    query: {},
    pathname: '/lessons'
  })
}))
```

## TypeScript Testing Patterns

### Jest Configuration for TypeScript
```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}'
  ]
}
```

### Type-Safe Mocking with MockedFunction
```typescript
import { MockedFunction } from 'jest-mock'
import { fetchLessonData } from '@/api/lessons'

// Type-safe mock that enforces interface compliance
const mockFetchLessonData = fetchLessonData as MockedFunction<typeof fetchLessonData>

jest.mock('@/api/lessons', () => ({
  fetchLessonData: jest.fn()
}))

describe('LessonLoader', () => {
  beforeEach(() => {
    mockFetchLessonData.mockClear()
  })

  it('handles lesson data correctly', async () => {
    // TypeScript ensures mock matches real function signature
    mockFetchLessonData.mockResolvedValue({
      id: 'lesson-123',
      title: 'Fractions',
      duration: 45
    })

    const result = await loadLesson('lesson-123')
    expect(result.title).toBe('Fractions')
  })
})
```

### Type-Safe Test Utilities
```typescript
// Generic factory function with type safety
interface MockLessonProps {
  title: string
  duration: number
  completed?: boolean
  subject?: string
  keyStage?: string
}

function createMockLesson(overrides: Partial<MockLessonProps> = {}): Lesson {
  return {
    id: 'lesson-123',
    title: 'Test Lesson',
    duration: 45,
    completed: false,
    subject: 'mathematics',
    keyStage: 'ks2',
    ...overrides
  }
}

// Type-safe curriculum factory
function createMockCurriculum(overrides: Partial<Curriculum> = {}): Curriculum {
  return {
    subject: 'mathematics',
    keyStage: 'ks2',
    units: [],
    ...overrides
  }
}
```

### Testing TypeScript Interfaces and Types
```typescript
// Test type constraints and business logic
describe('Lesson interface validation', () => {
  it('should enforce required properties', () => {
    const lesson: Lesson = createMockLesson({
      title: 'Fractions',
      duration: 60
    })
    
    expect(lesson.title).toBe('Fractions')
    expect(lesson.duration).toBe(60)
    // TypeScript compiler ensures all required fields are present
  })

  it('should handle optional properties correctly', () => {
    const incompleteLesson = createMockLesson()
    expect(incompleteLesson.completed).toBe(false)

    const completedLesson = createMockLesson({ completed: true })
    expect(completedLesson.completed).toBe(true)
  })
})

// Test type guards and utility functions
describe('Type guards', () => {
  it('should correctly identify lesson types', () => {
    const lesson = createMockLesson()
    const isValidLesson = (obj: any): obj is Lesson => {
      return obj && typeof obj.title === 'string' && typeof obj.duration === 'number'
    }

    expect(isValidLesson(lesson)).toBe(true)
    expect(isValidLesson({})).toBe(false)
    expect(isValidLesson(null)).toBe(false)
  })
})
```

### Testing Generic Functions
```typescript
// Generic utility function
function createArray<T>(length: number, factory: (index: number) => T): T[] {
  return Array.from({ length }, (_, index) => factory(index))
}

// Type-safe testing of generics
describe('createArray utility', () => {
  it('creates typed arrays correctly', () => {
    const lessons = createArray(3, (index) => createMockLesson({ 
      title: `Lesson ${index + 1}` 
    }))

    expect(lessons).toHaveLength(3)
    expect(lessons[0].title).toBe('Lesson 1')
    expect(lessons[2].title).toBe('Lesson 3')
    
    // TypeScript ensures all elements are Lesson type
    lessons.forEach(lesson => {
      expect(typeof lesson.title).toBe('string')
      expect(typeof lesson.duration).toBe('number')
    })
  })
})
```

### Testing Async TypeScript Functions
```typescript
// Type-safe async testing
describe('Async lesson operations', () => {
  it('should handle lesson loading with proper types', async () => {
    const mockLesson = createMockLesson({ title: 'Async Lesson' })
    mockFetchLessonData.mockResolvedValue(mockLesson)

    const loadedLesson: Lesson = await loadLesson('lesson-123')
    
    expect(loadedLesson.title).toBe('Async Lesson')
    expect(mockFetchLessonData).toHaveBeenCalledWith('lesson-123')
  })

  it('should handle errors with proper typing', async () => {
    const error = new Error('Lesson not found')
    mockFetchLessonData.mockRejectedValue(error)

    await expect(loadLesson('invalid-id')).rejects.toThrow('Lesson not found')
  })
})
```

### Best Practices for TypeScript Testing
1. **Use strict TypeScript configuration** - Enable strict mode for better type checking
2. **Mock with type safety** - Use MockedFunction for type-safe mocks
3. **Test type guards** - Verify runtime type checking functions
4. **Factory functions** - Create typed factory functions for test data
5. **Generic testing** - Test generic functions with multiple types
6. **Interface compliance** - Ensure mocks comply with actual interfaces

## Next.js Testing Strategies

### Testing getStaticProps
```typescript
import { getStaticProps } from '../pages/lessons/[slug]'
import { GetStaticPropsContext } from 'next'
import { ParsedUrlQuery } from 'querystring'

describe('Lesson Page getStaticProps', () => {
  it('returns lesson data for valid slug', async () => {
    const context = {
      params: { slug: 'fractions-intro' } as ParsedUrlQuery
    } as GetStaticPropsContext

    const result = await getStaticProps(context)
    
    expect(result).toEqual({
      props: {
        lesson: expect.objectContaining({
          slug: 'fractions-intro'
        })
      },
      revalidate: 3600
    })
  })

  it('returns notFound for invalid lesson', async () => {
    const context = {
      params: { slug: 'invalid-lesson' } as ParsedUrlQuery
    } as GetStaticPropsContext

    const result = await getStaticProps(context)
    
    expect(result).toEqual({ notFound: true })
  })
})
```

### Testing getServerSideProps
```typescript
import { getServerSideProps } from '../pages/teachers/search'
import { GetServerSidePropsContext } from 'next'

describe('Search Page getServerSideProps', () => {
  it('returns search results for valid query', async () => {
    const context = {
      query: { 
        q: 'fractions',
        subject: 'mathematics',
        keyStage: 'ks2'
      }
    } as GetServerSidePropsContext

    const result = await getServerSideProps(context)
    
    expect(result).toEqual({
      props: {
        results: expect.any(Array),
        searchParams: {
          q: 'fractions',
          subject: 'mathematics',
          keyStage: 'ks2'
        }
      }
    })
  })

  it('handles missing search term', async () => {
    const context = {
      query: {}
    } as GetServerSidePropsContext

    const result = await getServerSideProps(context)
    
    expect(result.props.results).toEqual([])
  })
})
```

### API Route Testing with node-mocks-http
```typescript
/**
 * @jest-environment node
 */
import handler from '../api/lessons/[id]'
import { createMocks } from 'node-mocks-http'
import type { NextApiRequest, NextApiResponse } from 'next'

describe('/api/lessons/[id]', () => {
  it('returns lesson for valid ID', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: { id: 'lesson-123' }
    })
    
    await handler(req, res)
    
    expect(res._getStatusCode()).toBe(200)
    expect(JSON.parse(res._getData())).toEqual({
      id: 'lesson-123',
      title: expect.any(String)
    })
  })

  it('returns 404 for invalid lesson ID', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: { id: 'invalid-id' }
    })
    
    await handler(req, res)
    
    expect(res._getStatusCode()).toBe(404)
  })

  it('returns 405 for unsupported method', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'DELETE',
      query: { id: 'lesson-123' }
    })
    
    await handler(req, res)
    
    expect(res._getStatusCode()).toBe(405)
  })
})
```

### Testing API Routes with Authentication
```typescript
describe('/api/lessons/bookmark', () => {
  it('creates bookmark for authenticated teacher', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: { 
        lessonId: 'lesson-123',
        teacherId: 'teacher-456'
      },
      headers: {
        authorization: 'Bearer valid-token'
      }
    })
    
    await handler(req, res)
    
    expect(res._getStatusCode()).toBe(201)
    expect(JSON.parse(res._getData())).toEqual({
      bookmarked: true,
      lessonId: 'lesson-123'
    })
  })
})
```

### Testing Middleware Functions
```typescript
// Helper for creating mocked request objects
function createMockedRequest({ 
  query = {}, 
  body = {}, 
  headers = {},
  method = 'GET'
}) {
  const req = createRequest({ 
    query, 
    body, 
    headers, 
    method 
  }) as NextApiRequest
  
  const res: any = {
    status: jest.fn(() => res),
    json: jest.fn(() => res),
    end: jest.fn(() => res)
  }
  
  const next = jest.fn() as any
  
  return { req, res, next }
}

describe('Authentication Middleware', () => {
  it('passes through for valid auth token', async () => {
    const { req, res, next } = createMockedRequest({
      headers: { authorization: 'Bearer valid-token' }
    })
    
    await authMiddleware(req, res, next)
    
    expect(next).toHaveBeenCalled()
    expect(res.status).not.toHaveBeenCalled()
  })

  it('blocks request for invalid token', async () => {
    const { req, res, next } = createMockedRequest({
      headers: { authorization: 'Bearer invalid-token' }
    })
    
    await authMiddleware(req, res, next)
    
    expect(next).not.toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(401)
  })
})
```

## TDD Methodologies for React/TypeScript

### Red-Green-Refactor Cycle

**Red Phase - Write Failing Test**
```typescript
describe('LessonProgress', () => {
  it('calculates completion percentage', () => {
    // This will fail initially
    expect(calculateProgress(3, 10)).toBe(30)
  })
})
```

**Green Phase - Minimal Implementation**
```typescript
export function calculateProgress(completed: number, total: number): number {
  return Math.round((completed / total) * 100)
}
```

**Refactor Phase - Improve Design**
```typescript
export function calculateProgress(completed: number, total: number): number {
  if (total === 0) return 0
  if (completed > total) return 100
  return Math.round((completed / total) * 100)
}
```

### Component TDD Workflow

**1. Test Component Interface**
```typescript
describe('LessonCard', () => {
  it('displays lesson title and duration', () => {
    render(<LessonCard lesson={mockLesson} />)
    
    expect(screen.getByText('Fractions Intro')).toBeInTheDocument()
    expect(screen.getByText('45 minutes')).toBeInTheDocument()
  })
})
```

**2. Test User Interactions**
```typescript
it('calls onStart when start button clicked', async () => {
  const onStart = jest.fn()
  const user = userEvent.setup()
  
  render(<LessonCard lesson={mockLesson} onStart={onStart} />)
  
  await user.click(screen.getByRole('button', { name: /start/i }))
  expect(onStart).toHaveBeenCalledWith(mockLesson.id)
})
```

**3. Test State Changes**
```typescript
it('shows completion state when lesson is completed', () => {
  const completedLesson = { ...mockLesson, completed: true }
  
  render(<LessonCard lesson={completedLesson} />)
  
  expect(screen.getByText(/completed/i)).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: /start/i })).not.toBeInTheDocument()
})
```

## Storybook Integration Testing

### Visual Regression Testing
```typescript
// .storybook/test-runner.js
export default {
  async postRender(page, context) {
    const elementHandler = await page.$('#root')
    const innerHTML = await elementHandler.innerHTML()
    expect(innerHTML).toMatchSnapshot()
  }
}
```

### Component Testing in Isolation
```typescript
// LessonCard.stories.tsx
export default {
  title: 'Components/LessonCard',
  component: LessonCard,
  parameters: {
    docs: {
      description: {
        component: 'Card component for displaying lesson information'
      }
    }
  }
}

export const Default = {
  args: {
    lesson: {
      title: 'Introduction to Fractions',
      duration: 45,
      completed: false
    }
  }
}

export const Completed = {
  args: {
    lesson: {
      title: 'Introduction to Fractions',
      duration: 45,
      completed: true
    }
  }
}
```

## Key Principles for Oak Implementation

### 1. User-Focused Testing
- Test from teacher and student perspectives
- Use accessibility queries by default
- Focus on educational workflows

### 2. Domain-Driven Testing
- Use Oak curriculum terminology in tests
- Test educational business logic thoroughly
- Create realistic curriculum fixtures

### 3. Maintainable Test Architecture
- Separate test setup from test logic
- Create reusable test utilities
- Mock at appropriate boundaries

### 4. Cultural Transformation
- Embed TDD practices gradually
- Document testing patterns as they emerge
- Make testing part of code review process

---

*This research forms the foundation for Oak's testing strategy transformation, emphasizing accessibility, user-focused testing, and educational domain expertise.*