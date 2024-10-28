import handler from "../../../../pages/api/curriculum-downloads/index";
import { createNextApiMocks } from "../../../__helpers__/createNextApiMocks";

import {
  curriculumOverviewEnglishSecondary,
  curriculumUnitsEnglishSecondary,
  subjectPhaseOptions,
} from "@/utils/curriculum/fixtures";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";

const fetch = jest.spyOn(global, "fetch") as jest.Mock;

const LAST_REFRESH = new Date();
const LAST_REFRESH_AS_TIME = new Date().getTime();

const curriculumUnitsMock = jest.fn<
  ReturnType<typeof curriculumApi2023.curriculumUnits>,
  []
>(async () => {
  throw new Error("missing");
});
const curriculumOverviewMock = jest.fn<
  ReturnType<typeof curriculumApi2023.curriculumOverview>,
  []
>(async () => curriculumOverviewEnglishSecondary.curriculumOverview[0]!);
const refreshedMVTimeMock = jest.fn<
  ReturnType<typeof curriculumApi2023.refreshedMVTime>,
  []
>(async () => {
  return {
    data: [
      {
        last_refresh_finish: LAST_REFRESH.toISOString(),
        materializedview_name: "mv_curriculum_units_including_new_0_0_16",
      },
    ],
  };
});

const subjectPhaseOptionsMock = jest.fn(
  async () => subjectPhaseOptions.options,
);

jest.mock("../../../../node-lib/curriculum-api-2023", () => ({
  __esModule: true,
  default: {
    curriculumUnits: () => curriculumUnitsMock(),
    curriculumOverview: () => curriculumOverviewMock(),
    refreshedMVTime: () => refreshedMVTimeMock(),
    subjectPhaseOptions: () => subjectPhaseOptionsMock(),
  },
}));

jest.mock("../../../../node-lib/cms", () => ({
  __esModule: true,
  default: {
    curriculumOverviewPage: async () => null,
  },
}));

describe("/api/preview/[[...path]]", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();

    fetch.mockResolvedValue(new Response("", { status: 200 }));
  });

  it("redirect if old cache slug", async () => {
    const { req, res } = createNextApiMocks({
      query: {
        mvRefreshTime: (LAST_REFRESH.getTime() - 1000).toString(),
        subjectSlug: "english",
        phaseSlug: "secondary",
        state: "published",
        ks4OptionSlug: "aqa",
      },
    });
    await handler(req, res);

    expect(res._getStatusCode()).toBe(307);
  });

  describe("missing", () => {
    it("error is invalid", async () => {
      const { req, res } = createNextApiMocks({
        query: {
          mvRefreshTime: LAST_REFRESH_AS_TIME.toString(),
          subjectSlug: "INVALID",
          phaseSlug: "INVALID",
          state: "published",
          ks4OptionSlug: "aqa",
        },
      });
      await handler(req, res);

      expect(res._getStatusCode()).toBe(404);
    });
  });

  it("return 200 if correct cache slug", async () => {
    curriculumUnitsMock.mockResolvedValue(curriculumUnitsEnglishSecondary);
    const { req, res } = createNextApiMocks({
      query: {
        mvRefreshTime: LAST_REFRESH_AS_TIME.toString(),
        subjectSlug: "english",
        phaseSlug: "secondary",
        state: "published",
        ks4OptionSlug: "aqa",
      },
    });
    await handler(req, res);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(res._getStatusCode()).toBe(200);
  });

  it("return 200 if correct cache slug", async () => {
    curriculumUnitsMock.mockResolvedValue(curriculumUnitsEnglishSecondary);
    const { req, res } = createNextApiMocks({
      query: {
        mvRefreshTime: LAST_REFRESH_AS_TIME.toString(),
        subjectSlug: "english",
        phaseSlug: "secondary",
        state: "published",
        ks4OptionSlug: "wjec",
      },
    });
    await handler(req, res);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(res._getStatusCode()).toBe(200);
  });

  it("returns 404 if units is not present", async () => {
    curriculumUnitsMock.mockRejectedValue(new Error("Missing"));
    const { req, res } = createNextApiMocks({
      query: {
        mvRefreshTime: LAST_REFRESH_AS_TIME.toString(),
        subjectSlug: "english",
        phaseSlug: "secondary",
        state: "published",
        ks4OptionSlug: "aqa",
      },
    });
    await handler(req, res);

    expect(res._getStatusCode()).toBe(404);
  });

  it("returns 200 if examboard not present", async () => {
    curriculumUnitsMock.mockRejectedValue(new Error("Missing"));
    const { req, res } = createNextApiMocks({
      query: {
        mvRefreshTime: LAST_REFRESH_AS_TIME.toString(),
        subjectSlug: "english",
        phaseSlug: "primary",
        state: "published",
      },
    });
    await handler(req, res);

    expect(res._getStatusCode()).toBe(404);
  });

  it("returns 404 if state is new", async () => {
    const { req, res } = createNextApiMocks({
      query: {
        mvRefreshTime: LAST_REFRESH_AS_TIME.toString(),
        subjectSlug: "english",
        phaseSlug: "secondary",
        state: "new",
        ks4OptionSlug: "aqa",
      },
    });
    await handler(req, res);

    expect(res._getStatusCode()).toBe(404);
  });
});
