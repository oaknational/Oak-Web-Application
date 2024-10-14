import { createRequest, createResponse } from "node-mocks-http";
import { NextApiRequest, NextApiResponse } from "next";

import handler from "./";

import { logErrorMessage } from "@/utils/curriculum/unit";

const getMvRefreshTimeMock = jest.fn();
jest.mock("@/pages-helpers/curriculum/docx/getMvRefreshTime", () => ({
  __esModule: true,
  getMvRefreshTime() {
    return getMvRefreshTimeMock() ?? Date.now().toString();
  },
  default: {},
}));

const curriculumUnitsMock = jest.fn();
const curriculumOverviewMock = jest.fn();
const curriculumOverviewPageMock = jest.fn();
jest.mock("@/node-lib/curriculum-api-2023", () => ({
  __esModule: true,
  default: {
    curriculumUnits: () => curriculumUnitsMock(),
    curriculumOverview: () => curriculumOverviewMock(),
    curriculumOverviewPageMock: () => curriculumOverviewPageMock(),
  },
}));

jest.mock("@/utils/curriculum/unit", () => ({
  __esModule: true,
  logErrorMessage: jest.fn(),
}));

describe("/api/curriculum-downloads", () => {
  beforeEach(() => {
    jest.spyOn(global.console, "log").mockImplementation(() => {});
  });

  test("404 if new", async () => {
    const req = createRequest<NextApiRequest>({
      method: "GET",
      query: {
        mvRefreshTime: Date.now().toString(),
        subjectSlug: "test",
        phaseSlug: "test",
        state: "new",
        examboardSlug: "test",
        tierSlug: "test",
        childSubjectSlug: "test",
      },
    });
    const res = createResponse<NextApiResponse>();

    await handler(req, res);

    expect(res.statusCode).toBe(404);
  });

  test("redirect if mvRefreshTime does not match", async () => {
    const mockMvRefreshTime = Date.now() - 1000;
    getMvRefreshTimeMock.mockReturnValue(mockMvRefreshTime);
    const req = createRequest<NextApiRequest>({
      method: "GET",
      query: {
        mvRefreshTime: Date.now().toString(),
        subjectSlug: "test",
        phaseSlug: "test",
        state: "published",
        examboardSlug: "test",
        tierSlug: "test",
        childSubjectSlug: "test",
      },
    });
    const res = createResponse<NextApiResponse>();

    await handler(req, res);

    expect(res.statusCode).toBe(307);
    expect(res._getRedirectUrl()).toEqual(
      `/api/curriculum-downloads/?subjectSlug=test&phaseSlug=test&state=published&examboardSlug=test&tierSlug=test&childSubjectSlug=test&mvRefreshTime=${mockMvRefreshTime}`,
    );
  });

  describe("missing data", () => {
    test("curriculumUnits missing", async () => {
      curriculumUnitsMock.mockRejectedValue(new Error("not found"));
      const mockMvRefreshTime = Date.now() - 1000;
      getMvRefreshTimeMock.mockReturnValue(mockMvRefreshTime);

      const req = createRequest<NextApiRequest>({
        method: "GET",
        query: {
          mvRefreshTime: mockMvRefreshTime.toString(),
          subjectSlug: "test",
          phaseSlug: "test",
          state: "published",
          examboardSlug: "test",
          tierSlug: "test",
          childSubjectSlug: "test",
        },
      });
      const res = createResponse<NextApiResponse>();

      await handler(req, res);

      expect(res.statusCode).toBe(404);
      expect(logErrorMessage).toHaveBeenCalledWith(new Error("not found"));
    });

    test("curriculumOverview missing", async () => {
      curriculumUnitsMock.mockRejectedValue(new Error("not found"));
      const mockMvRefreshTime = Date.now() - 1000;
      getMvRefreshTimeMock.mockReturnValue(mockMvRefreshTime);

      const req = createRequest<NextApiRequest>({
        method: "GET",
        query: {
          mvRefreshTime: mockMvRefreshTime.toString(),
          subjectSlug: "test",
          phaseSlug: "test",
          state: "published",
          examboardSlug: "test",
          tierSlug: "test",
          childSubjectSlug: "test",
        },
      });
      const res = createResponse<NextApiResponse>();

      await handler(req, res);

      expect(res.statusCode).toBe(404);
      expect(logErrorMessage).toHaveBeenCalledWith(new Error("not found"));
    });

    test("curriculumOverviewPage missing", async () => {
      curriculumOverviewPageMock.mockRejectedValue(new Error("not found"));
      const mockMvRefreshTime = Date.now() - 1000;
      getMvRefreshTimeMock.mockReturnValue(mockMvRefreshTime);

      const req = createRequest<NextApiRequest>({
        method: "GET",
        query: {
          mvRefreshTime: mockMvRefreshTime.toString(),
          subjectSlug: "test",
          phaseSlug: "test",
          state: "published",
          examboardSlug: "test",
          tierSlug: "test",
          childSubjectSlug: "test",
        },
      });
      const res = createResponse<NextApiResponse>();

      await handler(req, res);

      expect(res.statusCode).toBe(404);
      expect(logErrorMessage).toHaveBeenCalledWith(new Error("not found"));
    });
  });
});
