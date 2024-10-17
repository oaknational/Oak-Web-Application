import handler from "../../../../pages/api/curriculum-downloads/index";
import { createNextApiMocks } from "../../../__helpers__/createNextApiMocks";

import curriculumUnitsTabFixture from "./fixtures/curriculumUnitsIncludeNew.json";

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
>(async () => import("./fixtures/curriculumOverview.json"));
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
const subjectPhaseOptionsIncludeNewMock = jest.fn(
  async () =>
    (await import("./fixtures/subjectPhaseOptionsIncludeNew.json")).subjects,
);

jest.mock("../../../../node-lib/curriculum-api-2023", () => ({
  __esModule: true,
  default: {
    curriculumUnits: () => curriculumUnitsMock(),
    curriculumOverview: () => curriculumOverviewMock(),
    refreshedMVTime: () => refreshedMVTimeMock(),
    subjectPhaseOptionsIncludeNew: () => subjectPhaseOptionsIncludeNewMock(),
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
        examboardSlug: "aqa",
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
          examboardSlug: "aqa",
        },
      });
      await handler(req, res);

      expect(res._getStatusCode()).toBe(404);
    });
  });

  it("return 200 if correct cache slug", async () => {
    curriculumUnitsMock.mockResolvedValue(curriculumUnitsTabFixture);
    const { req, res } = createNextApiMocks({
      query: {
        mvRefreshTime: LAST_REFRESH_AS_TIME.toString(),
        subjectSlug: "english",
        phaseSlug: "secondary",
        state: "published",
        examboardSlug: "aqa",
      },
    });
    await handler(req, res);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(res._getStatusCode()).toBe(200);
  });

  it("returns 404 if either units, overview, or subjectPhaseOptions is not present", async () => {
    // @ts-expect-error undefined to ensure test is failing properly
    curriculumUnitsMock.mockResolvedValue(undefined);
    const { req, res } = createNextApiMocks({
      query: {
        mvRefreshTime: LAST_REFRESH_AS_TIME.toString(),
        subjectSlug: "english",
        phaseSlug: "secondary",
        state: "published",
        examboardSlug: "aqa",
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
        examboardSlug: "aqa",
      },
    });
    await handler(req, res);

    expect(res._getStatusCode()).toBe(404);
  });
});
