import { GetStaticPropsContext, PreviewData } from "next";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import LessonMediaCanonicalPage, {
  getStaticProps,
  URLParams,
  CanonicalLessonMediaClipsPageProps,
} from "@/pages/teachers/lessons/[lessonSlug]/media";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import OakError from "@/errors/OakError";

const render = renderWithProviders();

jest.mock("posthog-js/react", () => ({
  useFeatureFlagEnabled: () => true,
}));

const fixtureData = {
  lessonSlug: "running-as-a-team",
  lessonTitle: "Running as a team",
  pathways: [
    {
      programmeSlug: "physical-education-ks4",
      lessonSlug: "running-and-jumping",
      lessonTitle: "Running and jumping",
      keyStageSlug: "ks4",
      keyStageTitle: "Key stage 4",
      unitSlug: "running-and-jumping",
      unitTitle: "Running and jumping",
      subjectSlug: "physical-education",
      subjectTitle: "Physical Education",
    },
  ],
};

describe("LessonMediaCanonicalPage", () => {
  it("Renders breadcrumbs", async () => {
    const result = render(
      <LessonMediaCanonicalPage curriculumData={fixtureData} />,
    );

    expect(result.queryByText("Extra video and audio")).toBeInTheDocument();
  });

  describe("getStaticProps", () => {
    it("Should fetch the correct data", async () => {
      const propsResult = (await getStaticProps({
        params: {
          lessonSlug: "running-as-a-team",
        },
        query: {},
      } as GetStaticPropsContext<URLParams, PreviewData>)) as {
        props: CanonicalLessonMediaClipsPageProps;
      };

      expect(propsResult.props.curriculumData.lessonSlug).toEqual(
        "running-as-a-team",
      );
    });
    it("should throw error if no context params", async () => {
      await expect(
        getStaticProps({} as GetStaticPropsContext<URLParams, PreviewData>),
      ).rejects.toThrowError("No context.params");
    });

    it("should throw an error if API is not found", async () => {
      (curriculumApi2023.lessonShare as jest.Mock).mockRejectedValueOnce(
        new OakError({ code: "curriculum-api/not-found" }),
      );

      await expect(
        getStaticProps({} as GetStaticPropsContext<URLParams, PreviewData>),
      ).rejects.toThrowError();
    });
  });
});
