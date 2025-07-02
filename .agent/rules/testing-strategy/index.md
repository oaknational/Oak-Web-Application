# Testing Strategy

**This document replaces the previous single testing-strategy.md file with a modular, comprehensive approach tailored specifically to the Oak Web Application.**

## Core Philosophy

Testing is not validation after the fact—it's **design through testing**. Every piece of code should be written using Test-Driven Development (TDD), with a strong preference for pure functions and testable architecture.

## Navigation

### Core Documents
- [**Core Principles**](core-principles.md) - TDD, pure functions, testable design (START HERE)
- [**React Testing**](react-testing.md) - Component testing with React Testing Library
- [**Next.js Testing**](nextjs-testing.md) - Pages, API routes, SSG/SSR testing
- [**TypeScript Testing**](typescript-testing.md) - Type-safe testing patterns
- [**Test Organization**](test-organization.md) - File structure, naming, Jest configuration

### Transformation Guides
- [**Transformation Guide**](transformation-guide.md) - How to improve existing tests
- [**Examples**](examples/) - Concrete patterns and refactoring examples

## Quick Start

1. **New Code**: Start with [Core Principles](core-principles.md) and always use TDD
2. **Existing Code**: Use [Transformation Guide](transformation-guide.md) to improve tests
3. **React Components**: Follow [React Testing](react-testing.md) patterns
4. **Next.js Features**: Apply [Next.js Testing](nextjs-testing.md) strategies

## Key Differentiators from Generic Testing Guides

- **Oak-specific examples** from our actual codebase
- **Jest-based** patterns (not Vitest)
- **Curriculum domain knowledge** integrated into test examples
- **TDD as mandatory practice** with concrete workflows
- **Transformation strategy** for improving existing code
- **Pure function emphasis** for better architecture

## Quality Gates

All code changes must pass:
- `npm run format`
- `npm run lint` 
- `npm run type-check`
- `npm run test:ci`
- `npm run build`

---

**Status**: 🚧 Under active development - see [improvement plan](../../plans/testing-strategy-improvement-plan.md) for progress