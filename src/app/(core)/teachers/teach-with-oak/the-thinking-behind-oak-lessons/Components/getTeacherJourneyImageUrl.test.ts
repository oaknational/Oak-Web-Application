import { getTeacherJourneyImageUrl } from "./getTeacherJourneyImageUrl";

import { getCloudinaryImageUrl } from "@/utils/getCloudinaryImageUrl";

jest.mock("@/utils/getCloudinaryImageUrl", () => ({
  getCloudinaryImageUrl: jest.fn((path: string) => `https://cdn/${path}`),
}));

describe("getTeacherJourneyImageUrl", () => {
  it("prefixes the image name with the teacher journey directory", () => {
    expect(getTeacherJourneyImageUrl("Chunked_Image_apmwpq")).toBe(
      "https://cdn/v1788962879/teacher-journey/Chunked_Image_apmwpq",
    );
    expect(getCloudinaryImageUrl).toHaveBeenCalledWith(
      "v1788962879/teacher-journey/Chunked_Image_apmwpq",
    );
  });
});
