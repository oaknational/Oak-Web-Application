import handler, { curriculumDownloadQueryProps } from "../../../../pages/api/curriculum-downloads/index";
import { createNextApiMocks } from "../../../__helpers__/createNextApiMocks";

import curriculumApi2023 from "@/node-lib/curriculum-api-2023";

const fetch = jest.spyOn(global, "fetch") as jest.Mock;

const createReqRes = (slugs: curriculumDownloadQueryProps) => {
  const { req, res } = createNextApiMocks({
    query: slugs,
  });

  return { req, res };
};

jest.mock("../../../../pages-helpers/curriculum/docx/getMvRefreshTime", () => ({
  __esModule: true,
  getMvRefreshTime: async () => 1721260802871,
}));

jest.mock("../../../../node-lib/curriculum-api-2023", () => ({
  __esModule: true,
  default: {
    curriculumUnitsIncludeNew: async (
      opts: Parameters<
        (typeof curriculumApi2023)["curriculumUnitsIncludeNew"]
      >[0],
    ) => {
      if (opts.subjectSlug === "english") {
        return import("./fixtures/curriculumUnitsIncludeNew.json");
      }
      throw new Error("Missing");
    },
    curriculumOverview: async () =>
      import("./fixtures/curriculumOverview.json"),
    subjectPhaseOptionsIncludeNew: async () =>
      (await import("./fixtures/subjectPhaseOptionsIncludeNew.json")).subjects,
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
    const { req, res } = createReqRes({
      mvRefreshTime: "1721260802872",
      subjectSlug: "english",
      phaseSlug: "secondary",
      state: "published",
      examboardSlug: "aqa",
    });
    await handler(req, res);

    expect(res._getStatusCode()).toBe(307);
  });

  it("error is invalid", async () => {
    const { req, res } = createReqRes({
      mvRefreshTime: "1721260802871",
      subjectSlug: "INVALID",
      phaseSlug: "INVALID",
      state: "published",
      examboardSlug: "aqa",
    });
    await handler(req, res);

    expect(res._getStatusCode()).toBe(404);
  });

  it("return 200 if correct cache slug", async () => {
    const { req, res } = createReqRes({
      mvRefreshTime: "1721260802871",
      subjectSlug: "english",
      phaseSlug: "secondary",
      state: "published",
      examboardSlug: "aqa",
    });
    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
  });
});
