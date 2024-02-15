import assert from "assert";

import {
  getStaticPaths,
  getStaticProps,
} from "@/pages/pupils/programmes/[programmeSlug]/units/[unitSlug]/lessons/[lessonSlug]";
import * as curriculumApi2023 from "@/node-lib/curriculum-api-2023/__mocks__/index";
import * as getDownloadResourcesExistence from "@/components/SharedComponents/helpers/downloadAndShareHelpers/getDownloadResourcesExistence";

jest.mock("@/utils/handleTranscript");
jest.mock(
  "@/components/SharedComponents/helpers/downloadAndShareHelpers/getDownloadResourcesExistence",
);

describe("pages/pupils/programmes/[programmeSlug]/units/[unitSlug]/lessons/[lessonSlug]/index", () => {
  describe("getStaticPaths", () => {
    it("Should not generate pages at build time", async () => {
      const res = await getStaticPaths();
      expect(res).toEqual({
        fallback: "blocking",
        paths: [],
      });
    });
  });

  describe("getStaticProps", () => {
    let getDownloadResourcesExistenceSpy: jest.SpyInstance;

    beforeEach(() => {
      getDownloadResourcesExistenceSpy = jest
        .spyOn(getDownloadResourcesExistence, "default")
        .mockResolvedValue({ resources: [] });
    });

    afterEach(() => {
      getDownloadResourcesExistenceSpy.mockRestore();
    });

    it("Should call API:pupilLessonOverview on 'pupil'", async () => {
      await getStaticProps({
        params: {
          programmeSlug: "ks123",
          unitSlug: "unitSlug",
          lessonSlug: "lessonSlug",
        },
      });

      expect(
        curriculumApi2023.default.pupilLessonOverview,
      ).toHaveBeenCalledWith({
        programmeSlug: "ks123",
        unitSlug: "unitSlug",
        lessonSlug: "lessonSlug",
      });
    });
    it("Should call both API::pupilLessonOverview on 'teachers-2023'", async () => {
      await getStaticProps({
        params: {
          programmeSlug: "ks123",
          unitSlug: "unitSlug",
          lessonSlug: "lessonSlug",
        },
      });

      expect(
        curriculumApi2023.default.pupilLessonOverview,
      ).toHaveBeenCalledWith({
        programmeSlug: "ks123",
        unitSlug: "unitSlug",
        lessonSlug: "lessonSlug",
      });
    });

    it("tests for the presence of a worksheet", async () => {
      await getStaticProps({
        params: {
          programmeSlug: "ks123",
          unitSlug: "unitSlug",
          lessonSlug: "lessonSlug",
        },
      });

      expect(getDownloadResourcesExistence.default).toHaveBeenCalledWith(
        "lessonSlug",
        "worksheet-pdf",
        false,
      );
    });

    it("sets `hasWorksheet` to `true` when a worksheet exists", async () => {
      getDownloadResourcesExistenceSpy.mockResolvedValue({
        resources: [["worksheet-pdf", { exists: true }]],
      });

      const res = await getStaticProps({
        params: {
          programmeSlug: "ks123",
          unitSlug: "unitSlug",
          lessonSlug: "lessonSlug",
        },
      });

      assert("props" in res);
      expect(res.props.hasWorksheet).toBe(true);
    });

    it("sets `hasWorksheet` to `false` when a worksheet does not exist", async () => {
      getDownloadResourcesExistenceSpy.mockResolvedValue({
        resources: [["worksheet-pdf", { exists: false }]],
      });

      const res = await getStaticProps({
        params: {
          programmeSlug: "ks123",
          unitSlug: "unitSlug",
          lessonSlug: "lessonSlug",
        },
      });

      assert("props" in res);
      expect(res.props.hasWorksheet).toBe(false);
    });

    it("does not blow up if the `getDownloadResourcesExistence` check fails", async () => {
      getDownloadResourcesExistenceSpy.mockRejectedValue(new Error("oh no!"));

      const res = await getStaticProps({
        params: {
          programmeSlug: "ks123",
          unitSlug: "unitSlug",
          lessonSlug: "lessonSlug",
        },
      });

      assert("props" in res);
      expect(res.props.hasWorksheet).toBe(false);
    });
  });
});
