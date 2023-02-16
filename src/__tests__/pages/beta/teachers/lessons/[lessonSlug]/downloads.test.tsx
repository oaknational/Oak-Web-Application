import { screen } from "@testing-library/react";
import { GetServerSidePropsContext, PreviewData } from "next";
import userEvent from "@testing-library/user-event";
import { computeAccessibleDescription } from "dom-accessibility-api";

import waitForNextTick from "../../../../../__helpers__/waitForNextTick";
import renderWithSeo from "../../../../../__helpers__/renderWithSeo";
import { mockSeoResult } from "../../../../../__helpers__/cms";
import renderWithProviders from "../../../../../__helpers__/renderWithProviders";
import LessonDownloadsPage, {
  getServerSideProps,
  LessonDownloadsPageProps,
  URLParams,
} from "../../../../../../pages/beta/teachers/key-stages/[keyStageSlug]/subjects/[subjectSlug]/units/[unitSlug]/lessons/[lessonSlug]/downloads";
import teachersKeyStageSubjectUnitsLessonsDownloadsFixtures from "../../../../../../node-lib/curriculum-api/fixtures/teachersKeyStageSubjectUnitsLessonsDownloads.fixture";

const props = {
  curriculumData: teachersKeyStageSubjectUnitsLessonsDownloadsFixtures(),
};

describe("pages/beta/teachers/lessons/[lessonSlug]/downloads", () => {
  it("Renders title from the props with added 'Downloads' text in front of it", async () => {
    renderWithProviders(<LessonDownloadsPage {...props} />);

    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      "Downloads: Islamic Geometry"
    );
  });

  describe("download form", () => {
    it("Renders download form with correct elements", () => {
      renderWithProviders(<LessonDownloadsPage {...props} />);

      expect(screen.getAllByRole("heading", { level: 2 })[0]).toHaveTextContent(
        "Your details"
      );
      expect(screen.getByTestId("email-heading")).toHaveTextContent(
        "For regular updates from Oak (optional)"
      );
      expect(
        screen.getByPlaceholderText("Enter email address here")
      ).toBeInTheDocument();

      // Privacy policy link
      const privacyPolicyLink = screen.getByRole("link", {
        name: "privacy policy",
      });
      expect(privacyPolicyLink).toBeInTheDocument();
      expect(privacyPolicyLink).toHaveAttribute(
        "href",
        "/legal/privacy-policy"
      );

      // Terms and conditions checkbox
      expect(
        screen.getByLabelText("I accept terms and conditions (required)")
      ).toBeInTheDocument();

      // Terms and condtions link
      const tcsLink = screen.getByRole("link", {
        name: "terms & conditions",
      });
      expect(tcsLink).toBeInTheDocument();
      expect(tcsLink).toHaveAttribute("href", "/legal/terms-and-conditions");

      // Lesson resources to download
      const lessonResourcesToDownload = screen.getAllByTestId(
        "lessonResourcesToDownload"
      );
      expect(lessonResourcesToDownload.length).toEqual(2);
      const exitQuizQuestions = screen.getByLabelText("Exit quiz questions");

      expect(exitQuizQuestions).toBeInTheDocument();
      expect(exitQuizQuestions).toHaveAttribute(
        "name",
        "lessonResourcesToDownload"
      );
      expect(exitQuizQuestions).toHaveAttribute("value", "exit-quiz-questions");
    });

    it("should display error hint on blur email if not formatted correctly", async () => {
      const { getByPlaceholderText } = renderWithProviders(
        <LessonDownloadsPage {...props} />
      );

      const input = getByPlaceholderText("Enter email address here");
      const user = userEvent.setup();
      await user.click(input);
      await user.keyboard("not an email");
      await user.tab();

      // HACK: wait for next tick
      await waitForNextTick();

      const description = computeAccessibleDescription(input);
      expect(description).toBe("Email not valid");
    });

    it("should not display error hint on blur email if empty", async () => {
      const { getByPlaceholderText } = renderWithProviders(
        <LessonDownloadsPage {...props} />
      );

      const input = getByPlaceholderText("Enter email address here");
      const user = userEvent.setup();
      await user.click(input);
      await user.tab();

      // HACK: wait for next tick
      await waitForNextTick();

      const description = computeAccessibleDescription(input);
      expect(description).toBe("");
    });
  });

  describe("selected resources count", () => {
    it("should display correct count of selected and all downloadable resources if no resources are selected", () => {
      const { getByTestId } = renderWithProviders(
        <LessonDownloadsPage {...props} />
      );

      const selectedResourcesCount = getByTestId("selectedResourcesCount");
      expect(selectedResourcesCount).toHaveTextContent("0/2 files selected");
    });

    it("should display correct count of selected and all downloadable resources if some resources are selected", async () => {
      const { getByTestId, getByLabelText } = renderWithProviders(
        <LessonDownloadsPage {...props} />
      );

      const exitQuizQuestions = getByLabelText("Exit quiz questions");
      const user = userEvent.setup();
      await user.click(exitQuizQuestions);

      const selectedResourcesCount = getByTestId("selectedResourcesCount");
      expect(selectedResourcesCount).toHaveTextContent("1/2 files selected");
    });

    it("should select all resources if user clicks 'Select all'", async () => {
      const { getByTestId, getByText } = renderWithProviders(
        <LessonDownloadsPage {...props} />
      );

      const selectAllButton = getByText("Select all");
      const user = userEvent.setup();
      await user.click(selectAllButton);

      const selectedResourcesCount = getByTestId("selectedResourcesCount");
      expect(selectedResourcesCount).toHaveTextContent("2/2 files selected");

      const exitQuizQuestions = screen.getByLabelText("Exit quiz questions");
      const exitQuizAnswers = screen.getByLabelText("Exit quiz answers");

      expect(exitQuizQuestions).toBeChecked();
      expect(exitQuizAnswers).toBeChecked();
    });

    it("should deselect all resources if user clicks 'Deselect all'", async () => {
      const { getByTestId, getByText } = renderWithProviders(
        <LessonDownloadsPage {...props} />
      );

      const deselectAllButton = getByText("Deselect all");
      const user = userEvent.setup();
      await user.click(deselectAllButton);

      const selectedResourcesCount = getByTestId("selectedResourcesCount");
      expect(selectedResourcesCount).toHaveTextContent("0/2 files selected");

      const exitQuizQuestions = screen.getByLabelText("Exit quiz questions");
      const exitQuizAnswers = screen.getByLabelText("Exit quiz answers");
      expect(exitQuizQuestions).not.toBeChecked();
      expect(exitQuizAnswers).not.toBeChecked();
    });
  });

  describe("SEO", () => {
    it("renders the correct SEO details", async () => {
      const { seo } = renderWithSeo(<LessonDownloadsPage {...props} />);

      expect(seo).toEqual({
        ...mockSeoResult,
        ogSiteName: "NEXT_PUBLIC_SEO_APP_NAME",
        title: "Lesson downloads | NEXT_PUBLIC_SEO_APP_NAME",
        description: "Lesson downloads",
        ogTitle: "Lesson downloads | NEXT_PUBLIC_SEO_APP_NAME",
        ogDescription: "Lesson downloads",
        ogUrl: "NEXT_PUBLIC_SEO_APP_URL",
        canonical: "NEXT_PUBLIC_SEO_APP_URL",
      });
    });
  });
  describe("getServerSideProps", () => {
    it("Should fetch the correct data", async () => {
      const propsResult = (await getServerSideProps({
        params: {
          lessonSlug: "macbeth-lesson-1",
          keyStageSlug: "ks2",
          subjectSlug: "english",
          unitSlug: "shakespeare",
        },
        query: {},
      } as GetServerSidePropsContext<URLParams, PreviewData>)) as {
        props: LessonDownloadsPageProps;
      };

      expect(propsResult.props.curriculumData.slug).toEqual("macbeth-lesson-1");
    });
    it("should throw error", async () => {
      await expect(
        getServerSideProps(
          {} as GetServerSidePropsContext<URLParams, PreviewData>
        )
      ).rejects.toThrowError("No context.params");
    });
  });
});
