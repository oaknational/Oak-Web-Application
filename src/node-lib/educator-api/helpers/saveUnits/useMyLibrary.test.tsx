import { act } from "@testing-library/react";

import { UserlistContentApiResponse } from "../../queries/getUserListContent/getUserListContent.types";

import { useMyLibrary } from "./useMyLibrary";

import { mockLoggedIn } from "@/__tests__/__helpers__/mockUser";
import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";
import { KeyStageTitleValueType } from "@/browser-lib/avo/Avo";
import { renderHookWithProviders } from "@/__tests__/__helpers__/renderWithProviders";

const mockSetOakToastProps = jest.fn();

jest.mock("@/context/OakToast/useOakToastContext", () => ({
  useOakToastContext: jest.fn(() => ({
    setCurrentToastProps: (props: unknown) => mockSetOakToastProps(props),
  })),
}));

const mockDecrementSavedUnitsCount = jest.fn();
const mockIncrementSavedUnitsCount = jest.fn();

jest.mock("@/context/SaveCount/useSaveCountContext", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    incrementSavedUnitsCount: () => mockIncrementSavedUnitsCount(),
    decrementSavedUnitsCount: () => mockDecrementSavedUnitsCount(),
  })),
}));

const mockUseGetEducatorData = jest.fn();

jest.mock("@/node-lib/educator-api/helpers/useGetEducatorData", () => ({
  useGetEducatorData: () => mockUseGetEducatorData(),
}));

const fetch = jest.spyOn(global, "fetch") as jest.Mock;

const mockSaveContent = jest.fn();
const mockUnsaveContent = jest.fn();
jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      contentSaved: (...args: unknown[]) => mockSaveContent(...args),
      contentUnsaved: (...args: unknown[]) => mockUnsaveContent(...args),
    },
  }),
}));

const renderHook = renderHookWithProviders();

const mockProgrammeData: UserlistContentApiResponse = {
  programme1: {
    programmeSlug: "programme1",
    units: [
      {
        unitSlug: "unit1",
        unitTitle: "Unit 1",
        optionalityTitle: null,
        savedAt: "2023-10-01T00:00:00Z",
        unitOrder: 1,
        yearOrder: 1,
        year: "1",
        lessons: [
          {
            slug: "lesson1",
            title: "Lesson 1",
            state: "published",
            order: 1,
          },
        ],
      },
    ],
    keystage: "KS1",
    subject: "Maths",
    examboard: null,
    tier: null,
    subjectSlug: "maths",
    keystageSlug: "ks1",
    subjectCategory: null,
  },
};

const mockProgrammeDataWithSubjectCategories: UserlistContentApiResponse = {
  "programme1-Literacy": {
    programmeSlug: "programme1",
    units: [
      {
        unitSlug: "unit1",
        unitTitle: "Unit 1",
        optionalityTitle: null,
        savedAt: "2023-10-01T00:00:00Z",
        unitOrder: 1,
        yearOrder: 1,
        year: "1",
        lessons: [
          {
            slug: "lesson1",
            title: "Lesson 1",
            state: "published",
            order: 1,
          },
        ],
      },
    ],
    keystage: "KS1",
    subject: "English",
    examboard: null,
    tier: null,
    subjectSlug: "english",
    keystageSlug: "ks1",
    subjectCategory: "Literacy",
  },
  programme2: {
    programmeSlug: "programme2",
    units: [
      {
        unitSlug: "bio-unit1",
        unitTitle: "Bio Unit 1",
        optionalityTitle: null,
        savedAt: "2023-10-01T00:00:00Z",
        unitOrder: 1,
        yearOrder: 1,
        year: "1",
        lessons: [
          {
            slug: "bio-lesson-1",
            title: "Bio Lesson 1",
            state: "published",
            order: 1,
          },
        ],
      },
    ],
    keystage: "KS1",
    subject: "Biology",
    examboard: null,
    tier: null,
    subjectSlug: "biology",
    keystageSlug: "ks1",
    subjectCategory: null,
  },
};

const mockProgrammeDataWithPathways: UserlistContentApiResponse = {
  programme1: {
    programmeSlug: "programme1",
    units: [
      {
        unitSlug: "unit1",
        unitTitle: "Unit 1",
        optionalityTitle: null,
        savedAt: "2023-10-01T00:00:00Z",
        unitOrder: 1,
        yearOrder: 1,
        year: "1",
        lessons: [
          {
            slug: "lesson1",
            title: "Lesson 1",
            state: "published",
            order: 1,
          },
        ],
      },
    ],
    keystage: "KS4",
    subject: "Maths",
    examboard: null,
    tier: null,
    pathway: "Core",
    subjectSlug: "maths",
    keystageSlug: "ks4",
    subjectCategory: null,
  },
};

const mockTrackingData = {
  savedFrom: "my-library-save-button" as const,
  keyStageTitle: "Key stage 1" as KeyStageTitleValueType,
  keyStageSlug: "ks1",
  subjectTitle: "Maths",
  subjectSlug: "maths",
};

describe("useMyLibrary", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetch.mockResolvedValue({ ok: true });
    setUseUserReturn(mockLoggedIn);
  });
  it("should return collection data with correct structure", async () => {
    mockUseGetEducatorData.mockImplementation(() => ({
      data: mockProgrammeData,
      error: null,
      isLoading: false,
    }));
    const { result } = renderHook(() => useMyLibrary());
    expect(result.current.collectionData).toEqual([
      {
        keystage: "KS1",
        keystageSlug: "ks1",
        programmeSlug: "programme1",
        programmeTitle: "Maths KS1",
        subject: "Maths",
        subjectSlug: "maths",
        subheading: "KS1",
        uniqueProgrammeKey: "programme1",
        units: [
          {
            unitSlug: "unit1",
            unitTitle: "Unit 1",
            optionalityTitle: null,
            savedAt: "2023-10-01T00:00:00Z",
            unitOrder: 1,
            yearOrder: 1,
            year: "1",
            lessons: [
              {
                slug: "lesson1",
                title: "Lesson 1",
                state: "published",
                order: 1,
              },
            ],
          },
        ],
        searchQuery: null,
      },
    ]);
  });
  it("should handle subjects with subject categories", async () => {
    mockUseGetEducatorData.mockImplementation(() => ({
      data: mockProgrammeDataWithSubjectCategories,
      error: null,
      isLoading: false,
    }));
    const { result } = renderHook(() => useMyLibrary());
    expect(result.current.collectionData).toEqual([
      {
        keystage: "KS1",
        keystageSlug: "ks1",
        programmeSlug: "programme2",
        programmeTitle: "Biology KS1",
        subject: "Biology",
        subjectSlug: "biology",
        subheading: "KS1",
        uniqueProgrammeKey: "programme2",
        units: [
          {
            unitSlug: "bio-unit1",
            unitTitle: "Bio Unit 1",
            optionalityTitle: null,
            savedAt: "2023-10-01T00:00:00Z",
            unitOrder: 1,
            yearOrder: 1,
            year: "1",
            lessons: [
              {
                slug: "bio-lesson-1",
                title: "Bio Lesson 1",
                state: "published",
                order: 1,
              },
            ],
          },
        ],
        searchQuery: null,
      },
      {
        keystage: "KS1",
        keystageSlug: "ks1",
        programmeSlug: "programme1",
        programmeTitle: "English: Literacy KS1",
        subject: "English",
        subjectSlug: "english",
        subheading: "Literacy KS1",
        uniqueProgrammeKey: "programme1-Literacy",
        units: [
          {
            unitSlug: "unit1",
            unitTitle: "Unit 1",
            optionalityTitle: null,
            savedAt: "2023-10-01T00:00:00Z",
            unitOrder: 1,
            yearOrder: 1,
            year: "1",
            lessons: [
              {
                slug: "lesson1",
                title: "Lesson 1",
                state: "published",
                order: 1,
              },
            ],
          },
        ],
        searchQuery: "literacy",
      },
    ]);
  });
  it("should handle programmes with pathways", async () => {
    mockUseGetEducatorData.mockImplementation(() => ({
      data: mockProgrammeDataWithPathways,
      error: null,
      isLoading: false,
    }));
    const { result } = renderHook(() => useMyLibrary());
    expect(result.current.collectionData).toEqual([
      {
        keystage: "KS4",
        keystageSlug: "ks4",
        programmeSlug: "programme1",
        programmeTitle: "Maths Core KS4",
        subject: "Maths",
        subjectSlug: "maths",
        subheading: "Core KS4",
        uniqueProgrammeKey: "programme1",
        units: [
          {
            unitSlug: "unit1",
            unitTitle: "Unit 1",
            optionalityTitle: null,
            savedAt: "2023-10-01T00:00:00Z",
            unitOrder: 1,
            yearOrder: 1,
            year: "1",
            lessons: [
              {
                slug: "lesson1",
                title: "Lesson 1",
                state: "published",
                order: 1,
              },
            ],
          },
        ],
        searchQuery: null,
      },
    ]);
  });
  it("should return correct response for isUnitSaved", async () => {
    mockUseGetEducatorData.mockImplementation(() => ({
      data: mockProgrammeData,
      error: null,
      isLoading: false,
    }));
    const { result } = renderHook(() => useMyLibrary());
    expect(result.current.isUnitSaved("unit1-programme1")).toBe(true);
    expect(result.current.isUnitSaved("unit2-programme1")).toBe(false);
  });
  it("should unsave and save a unit", async () => {
    mockUseGetEducatorData.mockImplementation(() => ({
      data: mockProgrammeData,
      error: null,
      isLoading: false,
    }));
    const { result } = renderHook(() => useMyLibrary());

    expect(result.current.isUnitSaved("unit1-programme1")).toBe(true);

    act(() =>
      result.current.onSaveToggle("unit1", "programme1", mockTrackingData),
    );
    expect(result.current.isUnitSaved("unit1-programme1")).toBe(false);

    act(() =>
      result.current.onSaveToggle("unit1", "programme1", mockTrackingData),
    );
    expect(result.current.isUnitSaved("unit1-programme1")).toBe(true);
  });
  it("should decrement and increment units count when toggling save on a unit", async () => {
    mockUseGetEducatorData.mockImplementation(() => ({
      data: mockProgrammeData,
      error: null,
      isLoading: false,
    }));
    const { result } = renderHook(() => useMyLibrary());

    act(() =>
      result.current.onSaveToggle("unit1", "programme1", mockTrackingData),
    );
    expect(mockDecrementSavedUnitsCount).toHaveBeenCalled();

    act(() =>
      result.current.onSaveToggle("unit1", "programme1", mockTrackingData),
    );
    expect(mockIncrementSavedUnitsCount).toHaveBeenCalled();
  });
  it("should update toast props when saving a unit", async () => {
    mockUseGetEducatorData.mockImplementation(() => ({
      data: mockProgrammeData,
      error: null,
      isLoading: false,
    }));
    const { result } = renderHook(() => useMyLibrary());

    act(() =>
      result.current.onSaveToggle("unit1", "programme1", mockTrackingData),
    );

    expect(mockSetOakToastProps).toHaveBeenCalled();
  });
});
