# Test Improvement Execution Plans

This folder contains **actionable plans** for improving Oak's test quality from 6.2/10 to 8.5/10.

## Structure

```text
test-improvement/
├── README.md                              # This file
├── 01-executive-summary.md               # Overview and key findings
├── 02-improvement-prioritization-matrix.md # All improvements ranked
├── 04-quality-gates-definition.md        # Progressive quality enforcement
├── phase-3/                              # Implementation work items
│   └── 03-work-items-batch-1.md         # First 10 detailed tasks
├── tracking/                             # Progress monitoring
│   └── 05-progress-tracking-template.md # Living progress document
├── guides/                               # Step-by-step implementation guides
│   └── [Phase 2.1 outputs]              # Detailed how-to guides
└── patterns/                             # Reusable patterns and templates
    └── [Extracted patterns]              # Templates from successful implementations
```

## Quick Start

1. **Understand the scope**: Read `01-executive-summary.md`
2. **See priorities**: Review `02-improvement-prioritization-matrix.md`
3. **Start work**: Open `phase-3/03-work-items-batch-1.md`
4. **Track progress**: Update `tracking/05-progress-tracking-template.md`

## Current Status

- **Phase 1**: ✅ Complete (Analysis and understanding)
- **Phase 2.0**: ✅ Complete (Foundation planning)
- **Phase 2.1**: 🔄 In Progress (Implementation guides)
- **Phase 3**: 📅 Ready to start (Code changes)

## Work Item Assignment

Based on our two-person team:

**AI Assistant (Me)**:

- Pure function extractions (QW-001, QW-002, QW-003, QW-004)
- Test utilities and benchmarks (QW-006, QW-007)
- Test quality improvements (QW-009)

**Human (You)**:

- Mock factory patterns (SI-001)
- Complex hook testing (SI-002, SI-003)
- Architectural decisions and reviews

## Key Files

### For Planning

- `01-executive-summary.md` - High-level overview
- `02-improvement-prioritization-matrix.md` - What to work on and why

### For Execution

- `phase-3/03-work-items-batch-1.md` - Detailed task descriptions
- `guides/` - Step-by-step implementation instructions
- `patterns/` - Reusable code templates

### For Tracking

- `tracking/05-progress-tracking-template.md` - Update after each work item
- `04-quality-gates-definition.md` - Quality standards to maintain

## Workflow

1. **Select work item** from `phase-3/` folder
2. **Follow guide** from `guides/` folder (once created)
3. **Apply patterns** from `patterns/` folder
4. **Update tracking** in `tracking/` folder
5. **Verify quality** using gates definition

## Phase 3 Execution Order

1. QW-001: Extract Quiz Validation (establish pattern)
2. QW-002: Extract Video Progress (apply pattern)
3. SI-001: Mock Factory Base (enable better testing)
4. QW-003: Extract School Validation
5. QW-006: Performance Benchmarks
6. QW-007: Base Test Utilities
7. SI-002: Test useShareExperiment
8. QW-004: Extract Resource Formatting
9. SI-003: Test useTeacherNotes
10. QW-009: Fix ButtonAsLink Tests

## Success Metrics

Track these in the progress template:

- Average test quality: 6.2 → 8.5
- Pure function coverage: ~20% → 60%
- Custom hook coverage: 0% → 100%
- Behaviour test ratio: <30% → 80%

## Prerequisites

Before starting Phase 3 implementation:

1. **Development Environment**:
   - Node.js 18+ installed
   - Access to Oak Web Application repository
   - Git configured for incremental commits

2. **Testing Tools**:
   - Jest and React Testing Library installed (already in project)
   - Performance measurement tools: `performance.now()` API
   - Coverage reporting enabled: `npm run test:coverage`

3. **Quality Gates Setup**:
   ```bash
   # Verify these commands work:
   npm run format          # Prettier formatting
   npm run lint           # ESLint checks
   npm run type-check     # TypeScript validation
   npm run test:ci        # All tests passing
   npm run build          # Production build works
   ```

4. **Baseline Metrics**:
   - Run `npm run test:coverage` and note current coverage %
   - Document current test execution time
   - Count existing pure functions vs mixed logic

## Remember

- **No code changes in Phase 2** - Only planning and guides
- **Start with quick wins** - Build momentum
- **Document patterns** - Enable team scaling
- **Track everything** - Visibility drives success

---

For questions about the research and analysis behind these plans, see:
`.agent/plans/archive/testing-improvement-research/`
