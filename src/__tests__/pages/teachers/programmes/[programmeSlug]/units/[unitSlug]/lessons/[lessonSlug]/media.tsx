import React from "react";
import { GetStaticPropsContext, PreviewData } from "next";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import LessonMediaPage, {
  LessonMediaClipsPageProps,
  getStaticProps,
  getStaticPaths,
  URLParams,
} from "@/pages/teachers/programmes/[programmeSlug]/units/[unitSlug]/lessons/[lessonSlug]/media";
import curriculumApi from "@/node-lib/curriculum-api-2023/__mocks__";
import lessonMediaFixture from "@/node-lib/curriculum-api-2023/fixtures/lessonMedia.fixture";

const render = renderWithProviders();

jest.mock("posthog-js/react", () => ({
  useFeatureFlagEnabled: () => true,
}));

describe("pages/teachers/lessons/[lessonSlug]/media", () => {
  it("Renders breadcrumbs", async () => {
    const result = render(
      <LessonMediaPage curriculumData={lessonMediaFixture()} />,
    );

    expect(result.queryByText("Extra video and audio")).toBeInTheDocument();
  });

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
    it("Should fetch the correct data", async () => {
      const propsResult = (await getStaticProps({
        params: {
          lessonSlug: "running-as-a-team",
          programmeSlug: "physical-education-ks4",
          unitSlug: "running-and-jumping",
        },
        query: {},
      } as GetStaticPropsContext<URLParams, PreviewData>)) as {
        props: LessonMediaClipsPageProps;
      };

      expect(propsResult.props.curriculumData.lessonSlug).toEqual(
        "running-as-a-team",
      );
    });
    it("Should call curriculum api with correct props", async () => {
      await getStaticProps({
        params: {
          lessonSlug: "running-as-a-team",
          programmeSlug: "physical-education-ks4",
          unitSlug: "running-and-jumping",
        },
      });
      expect(curriculumApi.lessonMediaClips).toHaveBeenCalledWith({
        lessonSlug: "running-as-a-team",
        programmeSlug: "physical-education-ks4",
        unitSlug: "running-and-jumping",
      });
    });
    it("should return notFound when a landing page is missing", async () => {
      (curriculumApi.lessonMediaClips as jest.Mock).mockResolvedValueOnce(
        undefined,
      );

      const context = {
        params: {
          lessonSlug: "running-as-a-team",
          programmeSlug: "physical-education-ks4",
          unitSlug: "running-and-jumping",
        },
      };
      const response = await getStaticProps(context);
      expect(response).toEqual({
        notFound: true,
      });
    });
    it("should throw error", async () => {
      await expect(
        getStaticProps({} as GetStaticPropsContext<URLParams, PreviewData>),
      ).rejects.toThrowError("No context.params");
    });
  });
});
