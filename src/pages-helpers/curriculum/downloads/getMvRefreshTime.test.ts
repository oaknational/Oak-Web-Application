import { connection } from "next/server";
import { cacheLife, cacheTag } from "next/cache";

import { getMvRefreshTime } from "./getMvRefreshTime";

import * as curriculumApi2023 from "@/node-lib/curriculum-api-2023/__mocks__/curriculumApi2023Mock";
const mockErrorReporter = jest.fn();
jest.mock("@/common-lib/error-reporter", () =>
  jest.fn(() => mockErrorReporter),
);
jest.mock("next/server", () => ({
  connection: jest.fn(),
}));

describe("getMvRefreshTime", () => {
  it("should query the api", async () => {
    await getMvRefreshTime({ withCache: false });
    expect(curriculumApi2023.default.refreshedMVTime).toHaveBeenCalled();
  });

  it("uses the cached query and returns the latest refresh time", async () => {
    jest
      .mocked(curriculumApi2023.default.refreshedMVTime)
      .mockResolvedValueOnce({
        data: [
          {
            last_refresh_finish: "2024-07-08T00:00:03.01694+00:00",
            materializedview_name: "mv_curriculum_sequence_b_0_0_4",
          },
        ],
      });

    const mvTime = await getMvRefreshTime({ withCache: true });

    expect(mvTime).toBe(1720396803016);
    expect(curriculumApi2023.default.refreshedMVTime).toHaveBeenCalledWith({
      viewName: "mv_curriculum_sequence_b%",
    });
    expect(cacheLife).toHaveBeenCalledWith("curriculum");
    expect(cacheTag).toHaveBeenCalledWith("curriculum-api");
  });

  it("should record error when query returns no records", async () => {
    (
      curriculumApi2023.default.refreshedMVTime as jest.Mock
    ).mockResolvedValueOnce([]);
    await getMvRefreshTime({ withCache: false });
    expect(connection).toHaveBeenCalled();
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
    const mvTime = await getMvRefreshTime({ withCache: false });
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
    const mvTime = await getMvRefreshTime({ withCache: false });
    expect(mvTime).toEqual(1720310404016);
  });
});
