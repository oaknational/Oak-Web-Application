# Testing Strategy

Comprehensive testing guidance for Oak's educational platform using Jest, React Testing Library, and TypeScript.

## Requirements

All new code must:

- **Prefer unit tests of pure functions** - If it contains a mock, it is not a unit test
- Use Test-Driven Development (TDD) workflow
- Follow accessibility-first testing patterns (React components)
- Extract pure functions where possible
- Include comprehensive test coverage
- Meet [Test Quality Rubric](./test-quality-rubrics.md) standards (target 8+/10)

**Testing Hierarchy**: Unit tests prove engineering correctness, integration tests prove intended effects. We need both, although we need a LOT more unit tests than integration tests.

## Documentation

### Implementation Guides

- [**Core Principles**](core-principles.md) - TDD workflow and testable design patterns
- [**Test Quality Rubrics**](test-quality-rubrics.md) - Comprehensive quality evaluation with performance standards
- [**Test Types Guide**](test-types-guide.md) - Detailed examples of unit, integration, component, and API tests
- [**React Testing**](react-testing.md) - Component testing with accessibility-first RTL patterns
- [**React Testability**](react-testability.md) - Refactoring React components for better testing
- [**API Testing**](api-testing.md) - Next.js API routes with comprehensive mocking
- [**Next.js Testing**](nextjs-testing.md) - SSG/SSR, API routes, and performance testing
- [**Next.js Architecture**](nextjs-architecture.md) - Architecting Next.js applications for testability
- [**TypeScript Testing**](typescript-testing.md) - Type-safe testing with MockedFunction
- [**Mock Factories**](mock-factories.md) - Comprehensive patterns for creating test data
- [**Test Organization**](test-organization.md) - Jest configuration and file structure

### Improvement Resources

- [**Transformation Guide**](transformation-guide.md) - Upgrading existing test suites
- [**Recursive Practices**](recursive-practices.md) - Advanced testing techniques
- [**Examples**](examples/) - Refactoring patterns and component architectures

## Quick Start

### New Feature Development

1. Read [Core Principles](core-principles.md) for TDD workflow
2. Follow [React Testing](react-testing.md) for component patterns
3. Apply [TypeScript Testing](typescript-testing.md) for type safety
4. Use [Test Organization](test-organization.md) for file structure

### Improving Existing Code

1. Start with [Transformation Guide](transformation-guide.md)
2. Extract pure functions using [Examples](examples/pure-functions.md)
3. Refactor components using [Examples](examples/component-patterns.md)
4. Apply [Recursive Practices](recursive-practices.md) for systematic improvement

## Oak-Specific Approach

- **Real codebase examples** - All patterns use actual Oak components and curriculum data
- **Jest configuration** - Matches Oak's current testing infrastructure
- **Educational domain focus** - Tests reflect lesson, unit, and programme concepts
- **Accessibility-first** - Every pattern includes inclusive design validation
- **Gradual transformation** - Concrete steps for improving existing code

## Quality Gates

All code changes must pass:

- `npm run format`
- `npm run lint`
- `npm run type-check`
- `npm run test:ci`
- `npm run build`

## Command Reference

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run linting and type checking
npm run lint
npm run type-check

# Format code
npm run format
```
