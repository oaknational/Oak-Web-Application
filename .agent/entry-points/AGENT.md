# AGENT.md

This file provides guidance to agentic AI when it is working with code in this repository.

Read this entire document first, and _then_ follow the instructions.

## Critical Rules

1. Always use TDD with PURE functions and unit tests.
2. Never use `any` or `as`
3. Read an ENTIRE file before taking action; context is everything.

- Read and reflect on [General Best Practice](general-best-practice.md) document
- Read and reflect on [TypeScript Rules](typescript-rules.md) document
- Read and reflect on [Testing Strategy](rules/testing-strategy/index.md) document

## Development Commands

### Quality Gates

The quality gates are

- `npm run format`
- `npm run lint`
- `npm run type-check`
- `npm run test:ci`
- `npm run build`

The type checks must be run after any major change. Any issues must be resolved, regardless of location or cause.

### Core Development Commands

```bash
# Development
npm run dev                    # Start development server on http://localhost:3000
npm run build                  # Production build
npm start                      # Start production server

# Testing
npm run test                   # Run tests in watch mode without coverage
npm run test:coverage          # Run tests in watch mode with coverage
npm run test:ci               # Run all tests once (for CI)
npm run pa11y                 # Run accessibility tests (requires dev server running)

# Code Quality
npm run lint                   # Run ESLint
npm run lint:precommit         # Run ESLint with auto-fix
npm run type-check            # Run TypeScript type checking
npm run format                 # Format all files with Prettier
npm run format:check          # Check formatting without fixing

# GraphQL Code Generation
npm run gql-codegen:curriculum-2023  # Generate types for Curriculum API
npm run gql-codegen:sanity          # Generate types for Sanity CMS
npm run gql-codegen:educator        # Generate types for Educator API

# Bundle Analysis
npm run build:analyse-bundle   # Build with bundle analyzer
npm run report:open           # Open build report in browser
```

## Architecture Overview

see [architectural-overview.md](../architectural-overview.md)
