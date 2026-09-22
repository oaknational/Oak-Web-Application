import { renderHook } from "@testing-library/react";

import usePersistResourceFormDetails from "./usePersistResourceFormDetails";

const mockSetEmailInLocalStorage = jest.fn();
const mockSetSchoolInLocalStorage = jest.fn();
const mockSetTermsInLocalStorage = jest.fn();

jest.mock("./useLocalStorageForDownloads", () => () => ({
  setEmailInLocalStorage: mockSetEmailInLocalStorage,
  setSchoolInLocalStorage: mockSetSchoolInLocalStorage,
  setTermsInLocalStorage: mockSetTermsInLocalStorage,
}));

describe("usePersistResourceFormDetails", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("persists the supplied form details", () => {
    const { result } = renderHook(() => usePersistResourceFormDetails());

    result.current.persistResourceFormDetails({
      email: "test@test.com",
      school: "222-Sample school",
      schoolName: "Sample school",
      terms: true,
      resources: ["intro-quiz-questions"],
    });

    expect(mockSetEmailInLocalStorage).toHaveBeenCalledWith("test@test.com");
    expect(mockSetSchoolInLocalStorage).toHaveBeenCalledWith({
      schoolId: "222-Sample school",
      schoolName: "Sample school",
    });
    expect(mockSetTermsInLocalStorage).toHaveBeenCalledWith(true);
  });

  it.each(["homeschool", "notListed"])(
    "uses %s as its school name",
    (school) => {
      const { result } = renderHook(() => usePersistResourceFormDetails());

      result.current.persistResourceFormDetails({
        school,
        terms: true,
        resources: ["intro-quiz-questions"],
      });

      expect(mockSetSchoolInLocalStorage).toHaveBeenCalledWith({
        schoolId: school,
        schoolName: school,
      });
    },
  );
});
