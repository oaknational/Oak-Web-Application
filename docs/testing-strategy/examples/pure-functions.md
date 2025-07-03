# Pure Function Extraction Examples

**Three practical refactoring examples from Oak's codebase showing extraction of testable curriculum domain logic**

## Overview

Pure functions are the foundation of testable code. By extracting business logic from side effects, we create functions that are easy to test, understand, and reason about. This document shows three real examples from Oak's educational domain.

Each refactoring example demonstrates how extracting pure functions improves code clarity and makes business logic assumptions explicit.

## Example 1: Lesson Availability Logic

### Before: Mixed Concerns in Component

```typescript
// components/TeacherComponents/LessonGrid/LessonGrid.tsx (Before)
import React, { useMemo } from 'react';
import { LessonCard } from '../LessonCard';
import type { OakLesson } from '@/common-lib/curriculum-api-2023/types';

interface LessonGridProps {
  lessons: OakLesson[];
  showDrafts?: boolean;
}

export const LessonGrid: React.FC<LessonGridProps> = ({
  lessons,
  showDrafts = false
}) => {
  const availableLessons = useMemo(() => {
    return lessons.filter(lesson => {
      // Complex business logic mixed with component logic
      if (lesson._state === 'published') return true;
      if (showDrafts && lesson._state === 'draft') return true;
      if (lesson.deprecated) return false;
      if (!lesson.pupils && !showDrafts) return false;

      // Date-based availability logic
      const now = new Date();
      if (lesson.embargoedUntil && new Date(lesson.embargoedUntil) > now) {
        return false;
      }

      return false;
    });
  }, [lessons, showDrafts]);

  if (availableLessons.length === 0) {
    return (
      <div role="region" aria-label="No lessons available">
        <p>No lessons are currently available for this selection.</p>
      </div>
    );
  }

  return (
    <div role="grid" aria-label="Available lessons">
      {availableLessons.map(lesson => (
        <LessonCard key={lesson._id} lesson={lesson} />
      ))}
    </div>
  );
};
```

### After: Extracted Pure Functions

```typescript
// utils/curriculum/lessonAvailability.ts (New file)
import type { OakLesson } from "@/common-lib/curriculum-api-2023/types";

export interface LessonAvailabilityOptions {
  showDrafts?: boolean;
  currentDate?: Date; // Injected for testability
}

/**
 * Determines if a lesson is available to teachers based on Oak's business rules
 */
export function isLessonAvailableToTeachers(
  lesson: OakLesson,
  options: LessonAvailabilityOptions = {},
): boolean {
  const { showDrafts = false, currentDate = new Date() } = options;

  // Rule 1: Published lessons are always available
  if (lesson._state === "published") {
    return (
      !isLessonDeprecated(lesson) && !isLessonEmbargoed(lesson, currentDate)
    );
  }

  // Rule 2: Draft lessons only available when explicitly requested
  if (lesson._state === "draft" && showDrafts) {
    return !isLessonDeprecated(lesson);
  }

  // Rule 3: All other states are not available
  return false;
}

/**
 * Checks if a lesson is deprecated
 */
export function isLessonDeprecated(lesson: OakLesson): boolean {
  return Boolean(lesson.deprecated);
}

/**
 * Checks if a lesson is under embargo (not yet released)
 */
export function isLessonEmbargoed(
  lesson: OakLesson,
  currentDate: Date,
): boolean {
  if (!lesson.embargoedUntil) return false;

  const embargoDate = new Date(lesson.embargoedUntil);
  return embargoDate > currentDate;
}

/**
 * Filters lessons to only those available to teachers
 */
export function getAvailableLessons(
  lessons: OakLesson[],
  options: LessonAvailabilityOptions = {},
): OakLesson[] {
  return lessons.filter((lesson) =>
    isLessonAvailableToTeachers(lesson, options),
  );
}

/**
 * Determines appropriate messaging for empty lesson lists
 */
export function getEmptyLessonMessage(
  totalLessons: number,
  availableLessons: number,
  options: LessonAvailabilityOptions,
): string {
  if (totalLessons === 0) {
    return "No lessons found for this curriculum selection.";
  }

  if (availableLessons === 0 && options.showDrafts) {
    return "No lessons are currently published or in draft for this selection.";
  }

  if (availableLessons === 0) {
    return "No published lessons are currently available for this selection.";
  }

  return "";
}
```

### Tests for Pure Functions

```typescript
// utils/curriculum/__tests__/lessonAvailability.test.ts
import {
  isLessonAvailableToTeachers,
  isLessonDeprecated,
  isLessonEmbargoed,
  getAvailableLessons,
  getEmptyLessonMessage,
} from "../lessonAvailability";
import { createMockOakLesson } from "@/__tests__/__helpers__/mockFactories";

describe("Lesson Availability Logic", () => {
  const mockCurrentDate = new Date("2024-01-15T10:00:00Z");

  describe("isLessonAvailableToTeachers", () => {
    it("returns true for published, non-deprecated lessons", () => {
      const lesson = createMockOakLesson({
        _state: "published",
        deprecated: false,
      });

      expect(
        isLessonAvailableToTeachers(lesson, { currentDate: mockCurrentDate }),
      ).toBe(true);
    });

    it("returns false for deprecated lessons even if published", () => {
      const lesson = createMockOakLesson({
        _state: "published",
        deprecated: true,
      });

      expect(
        isLessonAvailableToTeachers(lesson, { currentDate: mockCurrentDate }),
      ).toBe(false);
    });

    it("returns false for embargoed lessons", () => {
      const futureDate = new Date("2024-02-01T10:00:00Z");
      const lesson = createMockOakLesson({
        _state: "published",
        deprecated: false,
        embargoedUntil: futureDate.toISOString(),
      });

      expect(
        isLessonAvailableToTeachers(lesson, { currentDate: mockCurrentDate }),
      ).toBe(false);
    });

    it("returns true for draft lessons when showDrafts is enabled", () => {
      const lesson = createMockOakLesson({
        _state: "draft",
        deprecated: false,
      });

      expect(
        isLessonAvailableToTeachers(lesson, {
          showDrafts: true,
          currentDate: mockCurrentDate,
        }),
      ).toBe(true);
    });

    it("returns false for draft lessons when showDrafts is disabled", () => {
      const lesson = createMockOakLesson({
        _state: "draft",
        deprecated: false,
      });

      expect(
        isLessonAvailableToTeachers(lesson, {
          showDrafts: false,
          currentDate: mockCurrentDate,
        }),
      ).toBe(false);
    });
  });

  describe("getEmptyLessonMessage", () => {
    it("provides specific message when no lessons exist", () => {
      const message = getEmptyLessonMessage(0, 0, {});
      expect(message).toBe("No lessons found for this curriculum selection.");
    });

    it("provides helpful message when lessons exist but none are available", () => {
      const message = getEmptyLessonMessage(5, 0, { showDrafts: false });
      expect(message).toBe(
        "No published lessons are currently available for this selection.",
      );
    });

    it("mentions drafts when showDrafts is enabled", () => {
      const message = getEmptyLessonMessage(3, 0, { showDrafts: true });
      expect(message).toBe(
        "No lessons are currently published or in draft for this selection.",
      );
    });
  });
});
```

### Refactored Component

```typescript
// components/TeacherComponents/LessonGrid/LessonGrid.tsx (After)
import React, { useMemo } from 'react';
import { LessonCard } from '../LessonCard';
import { getAvailableLessons, getEmptyLessonMessage } from '@/utils/curriculum/lessonAvailability';
import type { OakLesson } from '@/common-lib/curriculum-api-2023/types';

interface LessonGridProps {
  lessons: OakLesson[];
  showDrafts?: boolean;
}

export const LessonGrid: React.FC<LessonGridProps> = ({
  lessons,
  showDrafts = false
}) => {
  const availableLessons = useMemo(() => {
    return getAvailableLessons(lessons, { showDrafts });
  }, [lessons, showDrafts]);

  if (availableLessons.length === 0) {
    const emptyMessage = getEmptyLessonMessage(
      lessons.length,
      availableLessons.length,
      { showDrafts }
    );

    return (
      <div role="region" aria-label="No lessons available">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div role="grid" aria-label={`${availableLessons.length} lessons available`}>
      {availableLessons.map(lesson => (
        <LessonCard key={lesson._id} lesson={lesson} />
      ))}
    </div>
  );
};
```

## Example 2: Curriculum Progress Calculation

### Before: Complex Logic in Hook

```typescript
// hooks/useProgrammeProgress.ts (Before)
import { useState, useEffect } from "react";
import type {
  OakUnit,
  OakLesson,
} from "@/common-lib/curriculum-api-2023/types";

interface UseProgrammeProgressResult {
  overallProgress: number;
  unitProgress: Array<{ unitId: string; progress: number; status: string }>;
  completedLessons: number;
  totalLessons: number;
  estimatedTimeRemaining: string;
}

export function useProgrammeProgress(
  units: OakUnit[],
  completedLessonIds: string[],
): UseProgrammeProgressResult {
  const [result, setResult] = useState<UseProgrammeProgressResult>({
    overallProgress: 0,
    unitProgress: [],
    completedLessons: 0,
    totalLessons: 0,
    estimatedTimeRemaining: "",
  });

  useEffect(() => {
    // Complex calculation mixed with side effects
    let totalLessons = 0;
    let completedLessons = 0;
    const unitProgress: Array<{
      unitId: string;
      progress: number;
      status: string;
    }> = [];

    units.forEach((unit) => {
      const unitLessons = unit.lessons || [];
      const unitTotalLessons = unitLessons.length;
      const unitCompletedLessons = unitLessons.filter((lesson) =>
        completedLessonIds.includes(lesson._id),
      ).length;

      totalLessons += unitTotalLessons;
      completedLessons += unitCompletedLessons;

      const unitProgressPercent =
        unitTotalLessons > 0
          ? Math.round((unitCompletedLessons / unitTotalLessons) * 100)
          : 0;

      let status = "not-started";
      if (unitProgressPercent === 100) {
        status = "completed";
      } else if (unitProgressPercent > 0) {
        status = "in-progress";
      }

      unitProgress.push({
        unitId: unit._id,
        progress: unitProgressPercent,
        status,
      });
    });

    const overallProgressPercent =
      totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0;

    // Estimate time remaining (assuming 45 min per lesson)
    const remainingLessons = totalLessons - completedLessons;
    const remainingMinutes = remainingLessons * 45;
    const remainingHours = Math.floor(remainingMinutes / 60);
    const remainingMins = remainingMinutes % 60;

    let estimatedTimeRemaining = "";
    if (remainingHours > 0) {
      estimatedTimeRemaining = `${remainingHours}h ${remainingMins}m`;
    } else if (remainingMins > 0) {
      estimatedTimeRemaining = `${remainingMins}m`;
    } else {
      estimatedTimeRemaining = "Complete";
    }

    setResult({
      overallProgress: overallProgressPercent,
      unitProgress,
      completedLessons,
      totalLessons,
      estimatedTimeRemaining,
    });
  }, [units, completedLessonIds]);

  return result;
}
```

### After: Extracted Pure Functions

```typescript
// utils/curriculum/progressCalculation.ts (New file)
import type {
  OakUnit,
  OakLesson,
} from "@/common-lib/curriculum-api-2023/types";

export interface UnitProgress {
  unitId: string;
  progress: number;
  status: "not-started" | "in-progress" | "completed";
  completedLessons: number;
  totalLessons: number;
}

export interface ProgrammeProgress {
  overallProgress: number;
  unitProgress: UnitProgress[];
  completedLessons: number;
  totalLessons: number;
  estimatedTimeRemaining: string;
}

/**
 * Calculates progress for a single unit
 */
export function calculateUnitProgress(
  unit: OakUnit,
  completedLessonIds: string[],
): UnitProgress {
  const unitLessons = unit.lessons || [];
  const totalLessons = unitLessons.length;

  const completedLessons = unitLessons.filter((lesson) =>
    completedLessonIds.includes(lesson._id),
  ).length;

  const progress =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const status = determineUnitStatus(progress);

  return {
    unitId: unit._id,
    progress,
    status,
    completedLessons,
    totalLessons,
  };
}

/**
 * Determines unit status based on progress percentage
 */
export function determineUnitStatus(
  progressPercent: number,
): UnitProgress["status"] {
  if (progressPercent === 100) return "completed";
  if (progressPercent > 0) return "in-progress";
  return "not-started";
}

/**
 * Calculates overall programme progress
 */
export function calculateProgrammeProgress(
  units: OakUnit[],
  completedLessonIds: string[],
): ProgrammeProgress {
  const unitProgress = units.map((unit) =>
    calculateUnitProgress(unit, completedLessonIds),
  );

  const totalLessons = unitProgress.reduce(
    (sum, unit) => sum + unit.totalLessons,
    0,
  );
  const completedLessons = unitProgress.reduce(
    (sum, unit) => sum + unit.completedLessons,
    0,
  );

  const overallProgress =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const estimatedTimeRemaining = calculateEstimatedTimeRemaining(
    totalLessons - completedLessons,
  );

  return {
    overallProgress,
    unitProgress,
    completedLessons,
    totalLessons,
    estimatedTimeRemaining,
  };
}

/**
 * Calculates estimated time remaining based on lesson count
 * Assumes 45 minutes per lesson (Oak's standard)
 */
export function calculateEstimatedTimeRemaining(
  remainingLessons: number,
): string {
  if (remainingLessons === 0) return "Complete";

  const totalMinutes = remainingLessons * 45; // Oak's standard lesson duration
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }

  return `${minutes}m`;
}

/**
 * Formats progress percentage for display
 */
export function formatProgressPercent(progress: number): string {
  return `${Math.max(0, Math.min(100, progress))}%`;
}
```

### Tests for Pure Functions

```typescript
// utils/curriculum/__tests__/progressCalculation.test.ts
import {
  calculateUnitProgress,
  determineUnitStatus,
  calculateProgrammeProgress,
  calculateEstimatedTimeRemaining,
  formatProgressPercent,
} from "../progressCalculation";
import {
  createMockOakUnit,
  createMockOakLesson,
} from "@/__tests__/__helpers__/mockFactories";

describe("Progress Calculation Logic", () => {
  describe("calculateUnitProgress", () => {
    it("calculates progress correctly for partially completed unit", () => {
      const lessons = [
        createMockOakLesson({ _id: "lesson-1" }),
        createMockOakLesson({ _id: "lesson-2" }),
        createMockOakLesson({ _id: "lesson-3" }),
        createMockOakLesson({ _id: "lesson-4" }),
      ];

      const unit = createMockOakUnit({
        _id: "unit-1",
        lessons,
      });

      const completedLessonIds = ["lesson-1", "lesson-2"];
      const progress = calculateUnitProgress(unit, completedLessonIds);

      expect(progress).toEqual({
        unitId: "unit-1",
        progress: 50, // 2 out of 4 lessons
        status: "in-progress",
        completedLessons: 2,
        totalLessons: 4,
      });
    });

    it("handles units with no lessons", () => {
      const unit = createMockOakUnit({
        _id: "empty-unit",
        lessons: [],
      });

      const progress = calculateUnitProgress(unit, []);

      expect(progress).toEqual({
        unitId: "empty-unit",
        progress: 0,
        status: "not-started",
        completedLessons: 0,
        totalLessons: 0,
      });
    });

    it("calculates 100% for fully completed unit", () => {
      const lessons = [
        createMockOakLesson({ _id: "lesson-1" }),
        createMockOakLesson({ _id: "lesson-2" }),
      ];

      const unit = createMockOakUnit({ lessons });
      const completedLessonIds = ["lesson-1", "lesson-2"];
      const progress = calculateUnitProgress(unit, completedLessonIds);

      expect(progress.progress).toBe(100);
      expect(progress.status).toBe("completed");
    });
  });

  describe("determineUnitStatus", () => {
    it("returns correct status for different progress levels", () => {
      expect(determineUnitStatus(0)).toBe("not-started");
      expect(determineUnitStatus(1)).toBe("in-progress");
      expect(determineUnitStatus(50)).toBe("in-progress");
      expect(determineUnitStatus(99)).toBe("in-progress");
      expect(determineUnitStatus(100)).toBe("completed");
    });
  });

  describe("calculateEstimatedTimeRemaining", () => {
    it("formats time correctly for different lesson counts", () => {
      expect(calculateEstimatedTimeRemaining(0)).toBe("Complete");
      expect(calculateEstimatedTimeRemaining(1)).toBe("45m");
      expect(calculateEstimatedTimeRemaining(2)).toBe("1h 30m");
      expect(calculateEstimatedTimeRemaining(4)).toBe("3h");
      expect(calculateEstimatedTimeRemaining(10)).toBe("7h 30m");
    });

    it("handles edge cases gracefully", () => {
      expect(calculateEstimatedTimeRemaining(-1)).toBe("Complete");
      expect(calculateEstimatedTimeRemaining(0.5)).toBe("Complete"); // Rounds down
    });
  });

  describe("calculateProgrammeProgress", () => {
    it("calculates overall progress across multiple units", () => {
      const unit1 = createMockOakUnit({
        _id: "unit-1",
        lessons: [
          createMockOakLesson({ _id: "lesson-1" }),
          createMockOakLesson({ _id: "lesson-2" }),
        ],
      });

      const unit2 = createMockOakUnit({
        _id: "unit-2",
        lessons: [
          createMockOakLesson({ _id: "lesson-3" }),
          createMockOakLesson({ _id: "lesson-4" }),
        ],
      });

      const completedLessonIds = ["lesson-1", "lesson-3"];
      const progress = calculateProgrammeProgress(
        [unit1, unit2],
        completedLessonIds,
      );

      expect(progress.overallProgress).toBe(50); // 2 out of 4 total lessons
      expect(progress.completedLessons).toBe(2);
      expect(progress.totalLessons).toBe(4);
      expect(progress.estimatedTimeRemaining).toBe("1h 30m"); // 2 remaining lessons
    });
  });
});
```

### Refactored Hook

```typescript
// hooks/useProgrammeProgress.ts (After)
import { useMemo } from "react";
import { calculateProgrammeProgress } from "@/utils/curriculum/progressCalculation";
import type { OakUnit } from "@/common-lib/curriculum-api-2023/types";
import type { ProgrammeProgress } from "@/utils/curriculum/progressCalculation";

export function useProgrammeProgress(
  units: OakUnit[],
  completedLessonIds: string[],
): ProgrammeProgress {
  return useMemo(() => {
    return calculateProgrammeProgress(units, completedLessonIds);
  }, [units, completedLessonIds]);
}
```

## Example 3: Curriculum Search and Filtering

### Before: Complex Filtering in Component

```typescript
// components/TeacherComponents/CurriculumBrowser/CurriculumBrowser.tsx (Before)
import React, { useState, useEffect, useMemo } from 'react';
import type { OakLesson, OakUnit, OakProgramme } from '@/common-lib/curriculum-api-2023/types';

interface CurriculumBrowserProps {
  programmes: OakProgramme[];
  searchTerm: string;
  selectedSubject?: string;
  selectedKeyStage?: string;
  selectedYear?: string;
}

export const CurriculumBrowser: React.FC<CurriculumBrowserProps> = ({
  programmes,
  searchTerm,
  selectedSubject,
  selectedKeyStage,
  selectedYear
}) => {
  const [filteredResults, setFilteredResults] = useState<{
    programmes: OakProgramme[];
    units: OakUnit[];
    lessons: OakLesson[];
  }>({ programmes: [], units: [], lessons: [] });

  const [resultCounts, setResultCounts] = useState({ programmes: 0, units: 0, lessons: 0 });

  useEffect(() => {
    // Complex filtering logic mixed with side effects
    let filteredProgrammes = programmes;
    let allUnits: OakUnit[] = [];
    let allLessons: OakLesson[] = [];

    // Subject filtering
    if (selectedSubject) {
      filteredProgrammes = filteredProgrammes.filter(programme =>
        programme.subjectSlug === selectedSubject
      );
    }

    // Key stage filtering
    if (selectedKeyStage) {
      filteredProgrammes = filteredProgrammes.filter(programme =>
        programme.keystageSlug === selectedKeyStage
      );
    }

    // Year filtering
    if (selectedYear) {
      filteredProgrammes = filteredProgrammes.filter(programme =>
        programme.yearTitle?.toLowerCase().includes(selectedYear.toLowerCase())
      );
    }

    // Extract units and lessons from filtered programmes
    filteredProgrammes.forEach(programme => {
      const programmeUnits = programme.units || [];
      allUnits.push(...programmeUnits);

      programmeUnits.forEach(unit => {
        const unitLessons = unit.lessons || [];
        allLessons.push(...unitLessons);
      });
    });

    // Search term filtering
    if (searchTerm && searchTerm.length >= 2) {
      const searchLower = searchTerm.toLowerCase();

      // Filter programmes by search term
      filteredProgrammes = filteredProgrammes.filter(programme =>
        programme.title?.toLowerCase().includes(searchLower) ||
        programme.subjectTitle?.toLowerCase().includes(searchLower)
      );

      // Filter units by search term
      allUnits = allUnits.filter(unit =>
        unit.title?.toLowerCase().includes(searchLower) ||
        unit.description?.toLowerCase().includes(searchLower) ||
        unit.domain?.toLowerCase().includes(searchLower)
      );

      // Filter lessons by search term
      allLessons = allLessons.filter(lesson =>
        lesson.title?.toLowerCase().includes(searchLower) ||
        lesson.unitTitle?.toLowerCase().includes(searchLower)
      );
    }

    // Sort results
    filteredProgrammes.sort((a, b) =>
      (a.title || '').localeCompare(b.title || '')
    );

    allUnits.sort((a, b) => {
      // Sort by programme order, then unit order
      const aProgrammeOrder = programmes.findIndex(p => p._id === a.programmeSlug) || 0;
      const bProgrammeOrder = programmes.findIndex(p => p._id === b.programmeSlug) || 0;

      if (aProgrammeOrder !== bProgrammeOrder) {
        return aProgrammeOrder - bProgrammeOrder;
      }

      return (a.unitStudyOrder || 0) - (b.unitStudyOrder || 0);
    });

    allLessons.sort((a, b) => {
      // Sort by unit order, then lesson order
      const aUnit = allUnits.find(u => u._id === a.unitId);
      const bUnit = allUnits.find(u => u._id === b.unitId);

      if (aUnit && bUnit && aUnit.unitStudyOrder !== bUnit.unitStudyOrder) {
        return (aUnit.unitStudyOrder || 0) - (bUnit.unitStudyOrder || 0);
      }

      return (a.lessonNumber || 0) - (b.lessonNumber || 0);
    });

    setFilteredResults({
      programmes: filteredProgrammes,
      units: allUnits,
      lessons: allLessons
    });

    setResultCounts({
      programmes: filteredProgrammes.length,
      units: allUnits.length,
      lessons: allLessons.length
    });
  }, [programmes, searchTerm, selectedSubject, selectedKeyStage, selectedYear]);

  return (
    <div>
      <div>
        Results: {resultCounts.programmes} programmes, {resultCounts.units} units, {resultCounts.lessons} lessons
      </div>
      {/* Render filtered results */}
    </div>
  );
};
```

### After: Extracted Pure Functions

```typescript
// utils/curriculum/curriculumFiltering.ts (New file)
import type {
  OakLesson,
  OakUnit,
  OakProgramme,
} from "@/common-lib/curriculum-api-2023/types";

export interface CurriculumFilters {
  subject?: string;
  keyStage?: string;
  year?: string;
  searchTerm?: string;
}

export interface CurriculumSearchResult {
  programmes: OakProgramme[];
  units: OakUnit[];
  lessons: OakLesson[];
  counts: {
    programmes: number;
    units: number;
    lessons: number;
  };
}

/**
 * Filters programmes by subject, key stage, and year
 */
export function filterProgrammesByMetadata(
  programmes: OakProgramme[],
  filters: Pick<CurriculumFilters, "subject" | "keyStage" | "year">,
): OakProgramme[] {
  return programmes.filter((programme) => {
    // Subject filter
    if (filters.subject && programme.subjectSlug !== filters.subject) {
      return false;
    }

    // Key stage filter
    if (filters.keyStage && programme.keystageSlug !== filters.keyStage) {
      return false;
    }

    // Year filter (partial match)
    if (filters.year) {
      const yearLower = filters.year.toLowerCase();
      const programmYear = programme.yearTitle?.toLowerCase() || "";
      if (!programmYear.includes(yearLower)) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Extracts all units from a collection of programmes
 */
export function extractUnitsFromProgrammes(
  programmes: OakProgramme[],
): OakUnit[] {
  const units: OakUnit[] = [];

  programmes.forEach((programme) => {
    const programmeUnits = programme.units || [];
    units.push(...programmeUnits);
  });

  return units;
}

/**
 * Extracts all lessons from a collection of units
 */
export function extractLessonsFromUnits(units: OakUnit[]): OakLesson[] {
  const lessons: OakLesson[] = [];

  units.forEach((unit) => {
    const unitLessons = unit.lessons || [];
    lessons.push(...unitLessons);
  });

  return lessons;
}

/**
 * Filters programmes by search term
 */
export function searchProgrammes(
  programmes: OakProgramme[],
  searchTerm: string,
): OakProgramme[] {
  if (!searchTerm || searchTerm.length < 2) return programmes;

  const searchLower = searchTerm.toLowerCase();

  return programmes.filter(
    (programme) =>
      programme.title?.toLowerCase().includes(searchLower) ||
      programme.subjectTitle?.toLowerCase().includes(searchLower),
  );
}

/**
 * Filters units by search term
 */
export function searchUnits(units: OakUnit[], searchTerm: string): OakUnit[] {
  if (!searchTerm || searchTerm.length < 2) return units;

  const searchLower = searchTerm.toLowerCase();

  return units.filter(
    (unit) =>
      unit.title?.toLowerCase().includes(searchLower) ||
      unit.description?.toLowerCase().includes(searchLower) ||
      unit.domain?.toLowerCase().includes(searchLower),
  );
}

/**
 * Filters lessons by search term
 */
export function searchLessons(
  lessons: OakLesson[],
  searchTerm: string,
): OakLesson[] {
  if (!searchTerm || searchTerm.length < 2) return lessons;

  const searchLower = searchTerm.toLowerCase();

  return lessons.filter(
    (lesson) =>
      lesson.title?.toLowerCase().includes(searchLower) ||
      lesson.unitTitle?.toLowerCase().includes(searchLower),
  );
}

/**
 * Sorts programmes alphabetically by title
 */
export function sortProgrammes(programmes: OakProgramme[]): OakProgramme[] {
  return [...programmes].sort((a, b) =>
    (a.title || "").localeCompare(b.title || ""),
  );
}

/**
 * Sorts units by programme order, then unit study order
 */
export function sortUnits(
  units: OakUnit[],
  programmes: OakProgramme[],
): OakUnit[] {
  return [...units].sort((a, b) => {
    // Find programme order
    const aProgrammeIndex = programmes.findIndex(
      (p) => p._id === a.programmeSlug,
    );
    const bProgrammeIndex = programmes.findIndex(
      (p) => p._id === b.programmeSlug,
    );

    if (aProgrammeIndex !== bProgrammeIndex) {
      return aProgrammeIndex - bProgrammeIndex;
    }

    // Same programme, sort by unit study order
    return (a.unitStudyOrder || 0) - (b.unitStudyOrder || 0);
  });
}

/**
 * Sorts lessons by unit order, then lesson number
 */
export function sortLessons(
  lessons: OakLesson[],
  units: OakUnit[],
): OakLesson[] {
  return [...lessons].sort((a, b) => {
    // Find unit orders
    const aUnit = units.find((u) => u._id === a.unitId);
    const bUnit = units.find((u) => u._id === b.unitId);

    if (aUnit && bUnit && aUnit.unitStudyOrder !== bUnit.unitStudyOrder) {
      return (aUnit.unitStudyOrder || 0) - (bUnit.unitStudyOrder || 0);
    }

    // Same unit or unit not found, sort by lesson number
    return (a.lessonNumber || 0) - (b.lessonNumber || 0);
  });
}

/**
 * Comprehensive curriculum search and filtering
 */
export function searchCurriculum(
  programmes: OakProgramme[],
  filters: CurriculumFilters,
): CurriculumSearchResult {
  // Step 1: Filter programmes by metadata
  let filteredProgrammes = filterProgrammesByMetadata(programmes, filters);

  // Step 2: Extract units and lessons
  let allUnits = extractUnitsFromProgrammes(filteredProgrammes);
  let allLessons = extractLessonsFromUnits(allUnits);

  // Step 3: Apply search term filtering
  if (filters.searchTerm) {
    filteredProgrammes = searchProgrammes(
      filteredProgrammes,
      filters.searchTerm,
    );
    allUnits = searchUnits(allUnits, filters.searchTerm);
    allLessons = searchLessons(allLessons, filters.searchTerm);
  }

  // Step 4: Sort results
  const sortedProgrammes = sortProgrammes(filteredProgrammes);
  const sortedUnits = sortUnits(allUnits, programmes);
  const sortedLessons = sortLessons(allLessons, allUnits);

  return {
    programmes: sortedProgrammes,
    units: sortedUnits,
    lessons: sortedLessons,
    counts: {
      programmes: sortedProgrammes.length,
      units: sortedUnits.length,
      lessons: sortedLessons.length,
    },
  };
}

/**
 * Creates user-friendly search result summary
 */
export function formatSearchResultSummary(
  counts: CurriculumSearchResult["counts"],
  searchTerm?: string,
): string {
  const { programmes, units, lessons } = counts;
  const totalResults = programmes + units + lessons;

  if (totalResults === 0) {
    return searchTerm
      ? `No results found for "${searchTerm}"`
      : "No curriculum content matches the selected filters";
  }

  const parts: string[] = [];
  if (programmes > 0)
    parts.push(`${programmes} programme${programmes !== 1 ? "s" : ""}`);
  if (units > 0) parts.push(`${units} unit${units !== 1 ? "s" : ""}`);
  if (lessons > 0) parts.push(`${lessons} lesson${lessons !== 1 ? "s" : ""}`);

  const resultText = parts.join(", ");

  return searchTerm
    ? `Found ${resultText} for "${searchTerm}"`
    : `Showing ${resultText}`;
}
```

### Tests for Pure Functions

```typescript
// utils/curriculum/__tests__/curriculumFiltering.test.ts
import {
  filterProgrammesByMetadata,
  searchProgrammes,
  searchUnits,
  searchLessons,
  searchCurriculum,
  formatSearchResultSummary,
  extractUnitsFromProgrammes,
  sortUnits,
} from "../curriculumFiltering";
import {
  createMockOakProgramme,
  createMockOakUnit,
  createMockOakLesson,
} from "@/__tests__/__helpers__/mockFactories";

describe("Curriculum Filtering Logic", () => {
  const mockProgrammes = [
    createMockOakProgramme({
      _id: "prog-math-ks2",
      title: "Mathematics Key stage 2",
      subjectSlug: "mathematics",
      keystageSlug: "ks2",
      yearTitle: "Year 4",
    }),
    createMockOakProgramme({
      _id: "prog-english-ks1",
      title: "English Key stage 1",
      subjectSlug: "english",
      keystageSlug: "ks1",
      yearTitle: "Year 1",
    }),
  ];

  describe("filterProgrammesByMetadata", () => {
    it("filters programmes by subject correctly", () => {
      const result = filterProgrammesByMetadata(mockProgrammes, {
        subject: "mathematics",
      });

      expect(result).toHaveLength(1);
      expect(result[0].subjectSlug).toBe("mathematics");
    });

    it("filters programmes by key stage correctly", () => {
      const result = filterProgrammesByMetadata(mockProgrammes, {
        keyStage: "ks1",
      });

      expect(result).toHaveLength(1);
      expect(result[0].keystageSlug).toBe("ks1");
    });

    it("filters programmes by year with partial matching", () => {
      const result = filterProgrammesByMetadata(mockProgrammes, {
        year: "4",
      });

      expect(result).toHaveLength(1);
      expect(result[0].yearTitle).toBe("Year 4");
    });

    it("applies multiple filters simultaneously", () => {
      const result = filterProgrammesByMetadata(mockProgrammes, {
        subject: "mathematics",
        keyStage: "ks2",
        year: "4",
      });

      expect(result).toHaveLength(1);
      expect(result[0]._id).toBe("prog-math-ks2");
    });
  });

  describe("searchProgrammes", () => {
    it("searches programme titles case-insensitively", () => {
      const result = searchProgrammes(mockProgrammes, "mathematics");

      expect(result).toHaveLength(1);
      expect(result[0].title).toContain("Mathematics");
    });

    it("searches subject titles", () => {
      const result = searchProgrammes(mockProgrammes, "english");

      expect(result).toHaveLength(1);
      expect(result[0].subjectSlug).toBe("english");
    });

    it("requires minimum 2 characters for search", () => {
      const result = searchProgrammes(mockProgrammes, "a");
      expect(result).toEqual(mockProgrammes); // No filtering with short search
    });

    it("returns empty array for no matches", () => {
      const result = searchProgrammes(mockProgrammes, "chemistry");
      expect(result).toEqual([]);
    });
  });

  describe("searchCurriculum", () => {
    it("performs comprehensive search across all content types", () => {
      const units = [
        createMockOakUnit({
          title: "Fractions",
          programmeSlug: "prog-math-ks2",
        }),
      ];

      const programmes = [
        createMockOakProgramme({
          _id: "prog-math-ks2",
          subjectSlug: "mathematics",
          units,
        }),
      ];

      const result = searchCurriculum(programmes, {
        subject: "mathematics",
        searchTerm: "fractions",
      });

      expect(result.programmes).toHaveLength(0); // Programme title doesn't match 'fractions'
      expect(result.units).toHaveLength(1); // Unit title matches 'fractions'
      expect(result.counts.units).toBe(1);
    });
  });

  describe("formatSearchResultSummary", () => {
    it("formats single result type correctly", () => {
      const summary = formatSearchResultSummary(
        { programmes: 1, units: 0, lessons: 0 },
        "mathematics",
      );
      expect(summary).toBe('Found 1 programme for "mathematics"');
    });

    it("formats multiple result types correctly", () => {
      const summary = formatSearchResultSummary(
        { programmes: 2, units: 5, lessons: 20 },
        "algebra",
      );
      expect(summary).toBe(
        'Found 2 programmes, 5 units, 20 lessons for "algebra"',
      );
    });

    it("handles no results gracefully", () => {
      const summary = formatSearchResultSummary(
        { programmes: 0, units: 0, lessons: 0 },
        "nonexistent",
      );
      expect(summary).toBe('No results found for "nonexistent"');
    });

    it("handles singular vs plural correctly", () => {
      const summary = formatSearchResultSummary({
        programmes: 1,
        units: 1,
        lessons: 1,
      });
      expect(summary).toBe("Showing 1 programme, 1 unit, 1 lesson");
    });
  });
});
```

### Refactored Component

```typescript
// components/TeacherComponents/CurriculumBrowser/CurriculumBrowser.tsx (After)
import React, { useMemo } from 'react';
import { searchCurriculum, formatSearchResultSummary } from '@/utils/curriculum/curriculumFiltering';
import type { OakProgramme } from '@/common-lib/curriculum-api-2023/types';

interface CurriculumBrowserProps {
  programmes: OakProgramme[];
  searchTerm: string;
  selectedSubject?: string;
  selectedKeyStage?: string;
  selectedYear?: string;
}

export const CurriculumBrowser: React.FC<CurriculumBrowserProps> = ({
  programmes,
  searchTerm,
  selectedSubject,
  selectedKeyStage,
  selectedYear
}) => {
  const searchResults = useMemo(() => {
    return searchCurriculum(programmes, {
      subject: selectedSubject,
      keyStage: selectedKeyStage,
      year: selectedYear,
      searchTerm
    });
  }, [programmes, searchTerm, selectedSubject, selectedKeyStage, selectedYear]);

  const resultSummary = formatSearchResultSummary(
    searchResults.counts,
    searchTerm
  );

  return (
    <div>
      <div role="status" aria-live="polite">
        {resultSummary}
      </div>
      {/* Render filtered results */}
    </div>
  );
};
```

## Benefits of Pure Function Extraction

### For Testing

- **Isolated Logic**: Each function tests specific business rules
- **No Side Effects**: Functions are predictable and reliable
- **Edge Case Coverage**: Easy to test boundary conditions
- **Fast Execution**: Pure functions run quickly in test suites

### For Code Quality

- **Single Responsibility**: Each function has one clear purpose
- **Reusability**: Functions can be used across components
- **Maintainability**: Changes are localized and predictable
- **Documentation**: Function names and types serve as documentation

### For Educational Domain

- **Domain Clarity**: Business rules are explicit and visible
- **Curriculum Logic**: Educational concepts are properly modeled
- **Teacher/Student Workflows**: User needs are clearly expressed
- **Accessibility Support**: Filtering and formatting support inclusive design

### Recursive Awareness Insights

Each extraction reveals:

- **Hidden Assumptions**: What we assumed about curriculum structure
- **Educational Concepts**: How we think about learning progression
- **User Needs**: What teachers and students actually require
- **Quality Measures**: How we define "available," "complete," or "relevant"

## Quick Reference: Extraction Checklist

1. **Identify Mixed Concerns**: Logic + side effects in same function
2. **Extract Business Rules**: Move domain logic to pure functions
3. **Add Input Validation**: Handle edge cases explicitly
4. **Write Comprehensive Tests**: Cover normal and edge cases
5. **Update Components**: Use extracted functions
6. **Document Assumptions**: Make educational concepts explicit

---

_Pure function extraction transforms Oak's codebase into a collection of testable, reusable educational domain logic that serves teachers and students through clearer, more reliable software._
