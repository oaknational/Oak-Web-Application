import { getLessonData } from "./getLessonData";

import curriculumApi2023 from "@/node-lib/curriculum-api-2023";

jest.mock("@/node-lib/curriculum-api-2023");

const mockPupilLessonQuery = curriculumApi2023.pupilLessonQuery as jest.Mock;

describe("getLessonData", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns undefined when lessonSlug is not provided", async () => {
    const result = await getLessonData();
    expect(result).toBeUndefined();
    expect(mockPupilLessonQuery).not.toHaveBeenCalled();
  });

  it("returns undefined when lessonSlug is an empty string", async () => {
    const result = await getLessonData("");
    expect(result).toBeUndefined();
    expect(mockPupilLessonQuery).not.toHaveBeenCalled();
  });

  it("calls pupilLessonQuery with the provided lessonSlug", async () => {
    mockPupilLessonQuery.mockResolvedValueOnce({
      browseData: { someData: true },
      content: { someContent: true },
    });

    await getLessonData("lesson-slug-1");

    expect(mockPupilLessonQuery).toHaveBeenCalledWith({
      lessonSlug: "lesson-slug-1",
    });
  });

  it("returns browseData and content from the API response", async () => {
    const browseData = { someData: true };
    const content = { someContent: true };
    mockPupilLessonQuery.mockResolvedValueOnce({ browseData, content });

    const result = await getLessonData("lesson-slug-1");

    expect(result).toEqual({ browseData, content });
  });
});
