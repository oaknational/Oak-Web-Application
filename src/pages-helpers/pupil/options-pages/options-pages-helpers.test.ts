import { syntheticProgrammesByYearFixture } from "@oaknational/oak-curriculum-schema";

import {
  getPupilOptionData,
  getYearSlug,
  isExamboardSlug,
} from "./options-pages-helpers";

import * as curriculumApi2023 from "@/node-lib/curriculum-api-2023/__mocks__/index";
import { programmeFieldsFixture } from "@/node-lib/curriculum-api-2023/fixtures/programmeFields.fixture";
import { PupilProgrammeListingData } from "@/node-lib/curriculum-api-2023/queries/pupilProgrammeListing/pupilProgrammeListing.schema";
import OakError from "@/errors/OakError";
import { subjectBrowseDataFixture } from "@/node-lib/curriculum-api-2023/fixtures/subjectBrowseData.fixture";
import { PupilViewsProgrammeListingProps } from "@/components/PupilViews/PupilProgrammeListing/PupilProgrammeListing.view";

describe("options-pages-helpers", () => {
  describe("getYearSlug", () => {
    it("should throw an error if the yearSlug is not the same for all programmes", () => {
      const programmes: PupilProgrammeListingData[] = [
        {
          programmeFields: programmeFieldsFixture({
            overrides: { yearSlug: "year-10" },
          }),
          programmeSlug: "physics-test-slug",
          yearSlug: "year-10",
        },
        {
          programmeFields: programmeFieldsFixture({
            overrides: { yearSlug: "year-11" },
          }),
          programmeSlug: "maths-test-slug",
          yearSlug: "year-11",
        },
      ];
      // Test implementation
      expect(() => getYearSlug({ programmes: programmes })).toThrow(
        "The params provided are incorrect",
      );
    });
  });
  describe("isExamboardSlug", () => {
    it("should return true if the examboardSlug is a valid examboard slug", () => {
      expect(isExamboardSlug("aqa")).toBe(true);
    });
    it("should return false if the examboardSlug is not a valid examboard slug", () => {
      expect(isExamboardSlug("invalid-examboard")).toBe(false);
    });
  });
  describe("isExamboardSlug", () => {
    it("should return true if the examboardSlug is a valid examboard slug", () => {
      expect(isExamboardSlug("aqa")).toBe(true);
    });
    it("should return false if the examboardSlug is not a valid examboard slug", () => {
      expect(isExamboardSlug("invalid-examboard")).toBe(false);
    });
  });
  describe("getPupilOptionData", () => {
    it("should throw an error if the params are incorrect", async () => {
      expect.assertions(2);
      try {
        await getPupilOptionData({ params: undefined });
      } catch (error) {
        expect(error).toBeInstanceOf(OakError);
        expect(error).toMatchObject({
          errorInfo: { code: "curriculum-api/params-incorrect" },
        });
      }
    });
    it("should throw an error if the params are incorrect", async () => {
      expect.assertions(2);
      try {
        // @ts-expect-error - Testing incorrect params
        await getPupilOptionData({ params: {} });
      } catch (error) {
        expect(error).toBeInstanceOf(OakError);
        expect(error).toMatchObject({
          errorInfo: { code: "curriculum-api/params-incorrect" },
        });
      }
    });
    it("should return not found if no programmes exist", async () => {
      (
        curriculumApi2023.default.pupilProgrammeListingQuery as jest.Mock
      ).mockResolvedValueOnce([]);

      const result = await getPupilOptionData({
        params: { programmeSlug: "slug" },
      });
      expect(result).toEqual({ notFound: true });
    });
    it("should return redirect if only one programme exists", async () => {
      (
        curriculumApi2023.default.pupilProgrammeListingQuery as jest.Mock
      ).mockResolvedValueOnce([syntheticProgrammesByYearFixture()]);

      const result = await getPupilOptionData({
        params: { programmeSlug: "maths-primary-year-1" },
      });
      expect(result).toEqual({
        redirect: {
          destination: "/pupils/programmes/maths-primary-year-1/units",
          permanent: false,
        },
      });
    });
    it("should work for valid examboard_slug params", async () => {
      (
        curriculumApi2023.default.pupilProgrammeListingQuery as jest.Mock
      ).mockResolvedValueOnce([
        subjectBrowseDataFixture({}),
        subjectBrowseDataFixture({}),
      ]);

      const result = await getPupilOptionData({
        params: { programmeSlug: "maths-primary-year-1", examboardSlug: "aqa" },
      });
      let props: PupilViewsProgrammeListingProps | undefined;
      if ("props" in result) {
        props = result.props;
      }

      expect(props).not.toBeNull();
      expect(props?.programmes).toHaveLength(2);
      expect(props?.baseSlug).toEqual("maths-primary-year-1");
      expect(props?.yearSlug).toEqual("year-1");
    });
    it("should throw an error if the examboard_slug params are incorrect", async () => {
      expect.assertions(2);
      try {
        await getPupilOptionData({
          params: {
            programmeSlug: "maths-primary-year-1",
            examboardSlug: "NoEXAM",
          },
        });
      } catch (error) {
        expect(error).toBeInstanceOf(OakError);
        expect(error).toMatchObject({
          errorInfo: { code: "curriculum-api/params-incorrect" },
        });
      }
    });
  });
});
