import { GetStaticPropsContext, PreviewData } from "next";

import TeacherPreviewLessonListingPage, {
  LessonListingPageProps,
  URLParams,
  getStaticProps,
} from "@/pages/teachers/beta/programmes/[programmeSlug]/units/[unitSlug]/lessons";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import lessonListingFixture from "@/node-lib/curriculum-api-2023/fixtures/lessonListing.fixture";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import OakError from "@/errors/OakError";

const render = renderWithProviders();

const lesson = lessonListingFixture({
  unitSlug: "test-unit-slug",
  unitTitle: "Test Unit",
  programmeSlug: "test-programme-slug",
});

describe("TeacherPreviewLessonPage", () => {
  it("Renders title from the props", async () => {
    const result = render(
      <TeacherPreviewLessonListingPage curriculumData={lesson} />,
    );

    expect(result.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Test Unit",
    );
  });
});

describe("getStaticProps", () => {
  it("should fetch the correct data", async () => {
    const propsResult = (await getStaticProps({
      params: {
        programmeSlug: "test-programme-slug",
        unitSlug: "test-unit-slug",
      },
      query: {},
    } as GetStaticPropsContext<URLParams, PreviewData>)) as {
      props: LessonListingPageProps;
    };

    expect(propsResult.props.curriculumData.unitSlug).toEqual(
      "adding-surds-a57d",
    );
  });

  it("should throw error if no context params", async () => {
    await expect(
      getStaticProps({} as GetStaticPropsContext<URLParams, PreviewData>),
    ).rejects.toThrowError("no context.params");
  });

  it("should throw an error if both API's are not found", async () => {
    (
      curriculumApi2023.teacherPreviewLessonListing as jest.Mock
    ).mockRejectedValueOnce(new OakError({ code: "curriculum-api/not-found" }));
    await expect(
      getStaticProps({} as GetStaticPropsContext<URLParams, PreviewData>),
    ).rejects.toThrowError();
  });
});
