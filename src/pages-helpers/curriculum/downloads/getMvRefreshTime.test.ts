import { getMvRefreshTime } from "./getMvRefreshTime";

import * as curriculumApi2023 from "@/node-lib/curriculum-api-2023/__mocks__/index";
const mockErrorReporter = jest.fn();
jest.mock("@/common-lib/error-reporter", () =>
  jest.fn(() => mockErrorReporter),
);

describe("getMvRefreshTime", () => {
  it("should query the api", async () => {
    await getMvRefreshTime();
    expect(curriculumApi2023.default.refreshedMVTime).toHaveBeenCalled();
  });

  it("should record error when query returns no records", async () => {
    (
      curriculumApi2023.default.refreshedMVTime as jest.Mock
    ).mockResolvedValueOnce([]);
    await getMvRefreshTime();
    expect(mockErrorReporter).toHaveBeenCalledWith(
      "Could not find MV refresh time for curriculum downloads cache",
    );
  });

  it("should return number relating to latest refresh time - test A", async () => {
    (
      curriculumApi2023.default.refreshedMVTime as jest.Mock
    ).mockResolvedValueOnce({
      data: [
        {
          last_refresh_finish: "2024-07-08T00:00:03.01694+00:00",
          materializedview_name: "mv_curriculum_sequence_b_0_0_4",
        },
      ],
    });
    const mvTime = await getMvRefreshTime();
    expect(mvTime).toEqual(1720396803016);
  });

  it("should return number relating to latest refresh time  - test B", async () => {
    (
      curriculumApi2023.default.refreshedMVTime as jest.Mock
    ).mockResolvedValueOnce({
      data: [
        {
          last_refresh_finish: "2024-07-07T00:00:03.01694+00:00",
          materializedview_name: "mv_curriculum_sequence_b_0_0_4",
        },
        {
          last_refresh_finish: "2024-07-07T00:00:04.01694+00:00",
          materializedview_name: "mv_curriculum_sequence_b_0_0_4",
        },
      ],
    });
    const mvTime = await getMvRefreshTime();
    expect(mvTime).toEqual(1720310404016);
  });
});
