import {
  getLessonResources,
  getSideNavLinksFromResources,
  LessonResource,
} from "./getLessonResources";

import teachersLessonOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/teachersLessonOverview.fixture";
import lessonMediaClipsFixtures from "@/node-lib/curriculum-api-2023/fixtures/lessonMediaClips.fixture";
import { defaultCopyrightRequirements } from "@/__tests__/__helpers__/mockCopyrightRequirements";
import { AnalyticsBrowseData } from "@/components/TeacherComponents/types/lesson.types";

const mockBrowsePathwayData: AnalyticsBrowseData = {
  unitSlug: "cells",
  unitName: "Cells",
  lessonSlug: "lesson-3-structure-of-cells",
  lessonName: "Structure of cells",
  keyStageSlug: "ks3",
  keyStageTitle: "Key stage 3",
  subjectSlug: "biology",
  subjectTitle: "Biology",
  yearGroupName: "Year 7",
  yearGroupSlug: "year-7",
  phase: "secondary",
  tierName: null,
  pathway: null,
  examBoard: null,
  releaseGroup: "2024",
  lessonReleaseCohort: "2023-2026",
  lessonReleaseDate: "2024-09-29T14:00:00.000Z",
};

const mockTrackMediaClipsButtonClicked = jest.fn();

const defaultTestProps = () => ({
  browsePathwayData: mockBrowsePathwayData,
  data: teachersLessonOverviewFixture(),
  copyRightState: defaultCopyrightRequirements,
  isMathJaxLesson: false,
  trackMediaClipsButtonClicked: mockTrackMediaClipsButtonClicked,
});

describe("getLessonResources", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("resource filtering", () => {
    it("only returns resources that have data", () => {
      const props = defaultTestProps();
      const resources = getLessonResources(props);

      // With default fixture, we should have: lesson-details, starter-quiz, exit-quiz
      // (no presentation, worksheet, video, media clips, additional material, lesson guide)
      const resourceTypes = resources.map((r) => r.resourceType);

      expect(resourceTypes).toContain("lesson-details");
      expect(resourceTypes).toContain("starter-quiz");
      expect(resourceTypes).toContain("exit-quiz");
      expect(resourceTypes).not.toContain("slide-deck");
      expect(resourceTypes).not.toContain("worksheet");
      expect(resourceTypes).not.toContain("video");
      expect(resourceTypes).not.toContain("media-clips");
      expect(resourceTypes).not.toContain("additional-material");
      expect(resourceTypes).not.toContain("lesson-guide");
    });

    it("includes presentation when presentationUrl is provided", () => {
      const props = defaultTestProps();
      props.data = teachersLessonOverviewFixture({
        presentationUrl: "https://example.com/slides.pdf",
      });

      const resources = getLessonResources(props);
      const resourceTypes = resources.map((r) => r.resourceType);

      expect(resourceTypes).toContain("slide-deck");
    });

    it("includes worksheet when worksheetUrl is provided", () => {
      const props = defaultTestProps();
      props.data = teachersLessonOverviewFixture({
        worksheetUrl: "https://example.com/worksheet.pdf",
      });

      const resources = getLessonResources(props);
      const resourceTypes = resources.map((r) => r.resourceType);

      expect(resourceTypes).toContain("worksheet");
    });

    it("includes video when videoMuxPlaybackId is provided", () => {
      const props = defaultTestProps();
      props.data = teachersLessonOverviewFixture({
        videoMuxPlaybackId: "test-playback-id",
      });

      const resources = getLessonResources(props);
      const resourceTypes = resources.map((r) => r.resourceType);

      expect(resourceTypes).toContain("video");
    });

    it("includes media clips when hasMediaClips is true", () => {
      const props = defaultTestProps();
      props.data = teachersLessonOverviewFixture({
        hasMediaClips: true,
        lessonMediaClips: lessonMediaClipsFixtures().mediaClips,
      });

      const resources = getLessonResources(props);
      const resourceTypes = resources.map((r) => r.resourceType);

      expect(resourceTypes).toContain("media-clips");
    });

    it("includes additional material when additionalMaterialUrl is provided", () => {
      const props = defaultTestProps();
      props.data = teachersLessonOverviewFixture({
        additionalMaterialUrl: "https://example.com/additional.pdf",
      });

      const resources = getLessonResources(props);
      const resourceTypes = resources.map((r) => r.resourceType);

      expect(resourceTypes).toContain("additional-material");
    });

    it("includes lesson guide when lessonGuideUrl is provided", () => {
      const props = defaultTestProps();
      props.data = teachersLessonOverviewFixture({
        lessonGuideUrl: "https://example.com/guide.pdf",
      });

      const resources = getLessonResources(props);
      const resourceTypes = resources.map((r) => r.resourceType);

      expect(resourceTypes).toContain("lesson-guide");
    });

    it("excludes starter quiz when starterQuiz is null", () => {
      const props = defaultTestProps();
      props.data = teachersLessonOverviewFixture({
        starterQuiz: null,
      });

      const resources = getLessonResources(props);
      const resourceTypes = resources.map((r) => r.resourceType);

      expect(resourceTypes).not.toContain("starter-quiz");
    });

    it("excludes exit quiz when exitQuiz is null", () => {
      const props = defaultTestProps();
      props.data = teachersLessonOverviewFixture({
        exitQuiz: null,
      });

      const resources = getLessonResources(props);
      const resourceTypes = resources.map((r) => r.resourceType);

      expect(resourceTypes).not.toContain("exit-quiz");
    });
  });

  describe("resource ordering", () => {
    it("returns resources in correct order", () => {
      const props = defaultTestProps();
      props.data = teachersLessonOverviewFixture({
        lessonGuideUrl: "https://example.com/guide.pdf",
        presentationUrl: "https://example.com/slides.pdf",
        hasMediaClips: true,
        lessonMediaClips: lessonMediaClipsFixtures().mediaClips,
        videoMuxPlaybackId: "test-playback-id",
        worksheetUrl: "https://example.com/worksheet.pdf",
        additionalMaterialUrl: "https://example.com/additional.pdf",
      });

      const resources = getLessonResources(props);
      const resourceTypes = resources.map((r) => r.resourceType);

      // Expected order: lesson-guide, slide-deck, media-clips, lesson-details, video, worksheet, starter-quiz, exit-quiz, additional-material
      expect(resourceTypes).toEqual([
        "lesson-guide",
        "slide-deck",
        "media-clips",
        "lesson-details",
        "video",
        "worksheet",
        "starter-quiz",
        "exit-quiz",
        "additional-material",
      ]);
    });
  });

  describe("downloadable resources", () => {
    it("marks resource as downloadable when download exists", () => {
      const props = defaultTestProps();
      props.data = teachersLessonOverviewFixture({
        presentationUrl: "https://example.com/slides.pdf",
      });
      props.data.downloads = [{ exists: true, type: "presentation" }];

      const resources = getLessonResources(props);
      const slideDeck = resources.find((r) => r.resourceType === "slide-deck");

      expect(slideDeck?.downloadable).toBe(true);
      expect(slideDeck?.downloadTitle).toBe("lesson slides (PPTX)");
    });

    it("marks resource as downloadable when both download types exist", () => {
      const props = defaultTestProps();
      props.data = teachersLessonOverviewFixture({
        worksheetUrl: "https://example.com/worksheet.pdf",
      });
      props.data.downloads = [
        { exists: true, type: "worksheet-pdf" },
        { exists: true, type: "worksheet-pptx" },
      ];

      const resources = getLessonResources(props);
      const worksheet = resources.find((r) => r.resourceType === "worksheet");

      expect(worksheet?.downloadable).toBe(true);
      expect(worksheet?.downloadTitle).toBe("worksheet (PPTX/PDF)");
    });

    it("marks resource as downloadable when one download type exists", () => {
      const props = defaultTestProps();
      props.data.downloads = [
        { exists: true, type: "intro-quiz-answers" },
        { exists: false, type: "intro-quiz-questions" },
      ];

      const resources = getLessonResources(props);
      const starterQuiz = resources.find(
        (r) => r.resourceType === "starter-quiz",
      );

      expect(starterQuiz?.downloadable).toBe(true);
      expect(starterQuiz?.downloadTitle).toBe("starter quiz questions (PDF)");
    });

    it("marks resource as not downloadable when download does not exist", () => {
      const props = defaultTestProps();
      props.data = teachersLessonOverviewFixture({
        presentationUrl: "https://example.com/slides.pdf",
      });
      props.data.downloads = [{ exists: false, type: "presentation" }];

      const resources = getLessonResources(props);
      const slideDeck = resources.find((r) => r.resourceType === "slide-deck");

      expect(slideDeck?.downloadable).toBe(false);
    });

    it("video resource is never downloadable", () => {
      const props = defaultTestProps();
      props.data = teachersLessonOverviewFixture({
        videoMuxPlaybackId: "test-playback-id",
      });

      const resources = getLessonResources(props);
      const video = resources.find((r) => r.resourceType === "video");

      expect(video?.downloadable).toBe(false);
    });

    it("media-clips resource is never downloadable", () => {
      const props = defaultTestProps();
      props.data = teachersLessonOverviewFixture({
        hasMediaClips: true,
        lessonMediaClips: lessonMediaClipsFixtures().mediaClips,
      });

      const resources = getLessonResources(props);
      const mediaClips = resources.find(
        (r) => r.resourceType === "media-clips",
      );

      expect(mediaClips?.downloadable).toBe(false);
    });

    it("lesson-details resource is never downloadable", () => {
      const props = defaultTestProps();
      const resources = getLessonResources(props);
      const lessonDetails = resources.find(
        (r) => r.resourceType === "lesson-details",
      );

      expect(lessonDetails?.downloadable).toBe(false);
    });
  });

  describe("resource titles", () => {
    it("uses correct display titles for resources", () => {
      const props = defaultTestProps();
      props.data = teachersLessonOverviewFixture({
        lessonGuideUrl: "https://example.com/guide.pdf",
        presentationUrl: "https://example.com/slides.pdf",
        videoMuxPlaybackId: "test-playback-id",
        worksheetUrl: "https://example.com/worksheet.pdf",
        additionalMaterialUrl: "https://example.com/additional.pdf",
      });

      const resources = getLessonResources(props);

      expect(
        resources.find((r) => r.resourceType === "lesson-guide")?.title,
      ).toBe("Lesson guide");
      expect(
        resources.find((r) => r.resourceType === "slide-deck")?.title,
      ).toBe("Lesson slides");
      expect(
        resources.find((r) => r.resourceType === "lesson-details")?.title,
      ).toBe("Lesson details");
      expect(resources.find((r) => r.resourceType === "video")?.title).toBe(
        "Lesson video",
      );
      expect(resources.find((r) => r.resourceType === "worksheet")?.title).toBe(
        "Worksheet",
      );
      expect(
        resources.find((r) => r.resourceType === "starter-quiz")?.title,
      ).toBe("Prior knowledge starter quiz");
      expect(resources.find((r) => r.resourceType === "exit-quiz")?.title).toBe(
        "Assessment exit quiz",
      );
      expect(
        resources.find((r) => r.resourceType === "additional-material")?.title,
      ).toBe("Additional material");
    });

    it("uses subject-specific media clip label for PE", () => {
      const props = defaultTestProps();
      props.data = teachersLessonOverviewFixture({
        hasMediaClips: true,
        lessonMediaClips: lessonMediaClipsFixtures().mediaClips,
        subjectSlug: "physical-education",
      });

      const resources = getLessonResources(props);
      const mediaClips = resources.find(
        (r) => r.resourceType === "media-clips",
      );

      expect(mediaClips?.title).toBe("Demonstration videos");
    });

    it("uses subject-specific media clip label for MFL subjects", () => {
      const props = defaultTestProps();
      props.data = teachersLessonOverviewFixture({
        hasMediaClips: true,
        lessonMediaClips: lessonMediaClipsFixtures().mediaClips,
        subjectSlug: "spanish",
      });

      const resources = getLessonResources(props);
      const mediaClips = resources.find(
        (r) => r.resourceType === "media-clips",
      );

      expect(mediaClips?.title).toBe("Audio clips");
    });

    it("uses default media clip label for other subjects", () => {
      const props = defaultTestProps();
      props.data = teachersLessonOverviewFixture({
        hasMediaClips: true,
        lessonMediaClips: lessonMediaClipsFixtures().mediaClips,
        subjectSlug: "biology",
      });

      const resources = getLessonResources(props);
      const mediaClips = resources.find(
        (r) => r.resourceType === "media-clips",
      );

      expect(mediaClips?.title).toBe("Video & audio clips");
    });
  });

  describe("tracking titles", () => {
    it("assigns correct tracking titles to downloadable resources", () => {
      const props = defaultTestProps();
      props.data = teachersLessonOverviewFixture({
        lessonGuideUrl: "https://example.com/guide.pdf",
        presentationUrl: "https://example.com/slides.pdf",
        worksheetUrl: "https://example.com/worksheet.pdf",
        additionalMaterialUrl: "https://example.com/additional.pdf",
      });

      const resources = getLessonResources(props);

      expect(
        resources.find((r) => r.resourceType === "lesson-guide")?.trackingTitle,
      ).toBe("lesson guide");
      expect(
        resources.find((r) => r.resourceType === "slide-deck")?.trackingTitle,
      ).toBe("slide deck");
      expect(
        resources.find((r) => r.resourceType === "worksheet")?.trackingTitle,
      ).toBe("worksheet");
      expect(
        resources.find((r) => r.resourceType === "starter-quiz")?.trackingTitle,
      ).toBe("starter quiz");
      expect(
        resources.find((r) => r.resourceType === "exit-quiz")?.trackingTitle,
      ).toBe("exit quiz");
      expect(
        resources.find((r) => r.resourceType === "additional-material")
          ?.trackingTitle,
      ).toBe("additional material");
    });
  });

  describe("quiz anchor IDs", () => {
    it('assigns "quiz" anchorId to first quiz when both quizzes exist', () => {
      const props = defaultTestProps();
      // Default fixture has both quizzes

      const resources = getLessonResources(props);
      const starterQuiz = resources.find(
        (r) => r.resourceType === "starter-quiz",
      );
      const exitQuiz = resources.find((r) => r.resourceType === "exit-quiz");

      expect(starterQuiz?.anchorId).toBe("quiz");
      expect(exitQuiz?.anchorId).toBe("exit-quiz");
    });

    it('assigns "starter-quiz" anchorId when only starter quiz exists', () => {
      const props = defaultTestProps();
      props.data = teachersLessonOverviewFixture({
        exitQuiz: null,
      });

      const resources = getLessonResources(props);
      const starterQuiz = resources.find(
        (r) => r.resourceType === "starter-quiz",
      );

      expect(starterQuiz?.anchorId).toBe("starter-quiz");
    });

    it('assigns "exit-quiz" anchorId when only exit quiz exists', () => {
      const props = defaultTestProps();
      props.data = teachersLessonOverviewFixture({
        starterQuiz: null,
      });

      const resources = getLessonResources(props);
      const exitQuiz = resources.find((r) => r.resourceType === "exit-quiz");

      expect(exitQuiz?.anchorId).toBe("exit-quiz");
    });
  });

  describe("skip link URLs", () => {
    it("generates skip link URL to next resource for skippable content", () => {
      const props = defaultTestProps();
      props.data = teachersLessonOverviewFixture({
        presentationUrl: "https://example.com/slides.pdf",
        videoMuxPlaybackId: "test-playback-id",
      });

      const resources = getLessonResources(props);
      const slideDeck = resources.find((r) => r.resourceType === "slide-deck");
      const video = resources.find((r) => r.resourceType === "video");

      // slide-deck should skip to next resource (lesson-details)
      expect(slideDeck?.skipLinkUrl).toBe(
        "lesson-3-structure-of-cells#lesson-details",
      );

      // video should skip to next resource (starter-quiz, which has anchorId "quiz")
      expect(video?.skipLinkUrl).toBe("lesson-3-structure-of-cells#quiz");
    });

    it("generates skip link URL to footer for last skippable resource", () => {
      const props = defaultTestProps();
      props.data = teachersLessonOverviewFixture({
        additionalMaterialUrl: "https://example.com/additional.pdf",
      });

      const resources = getLessonResources(props);
      const additionalMaterial = resources.find(
        (r) => r.resourceType === "additional-material",
      );

      // additional-material is last and skippable, should link to footer
      expect(additionalMaterial?.skipLinkUrl).toBe(
        "lesson-3-structure-of-cells#site-footer",
      );
    });

    it("does not generate skip link URL for non-skippable resources", () => {
      const props = defaultTestProps();

      const resources = getLessonResources(props);
      const lessonDetails = resources.find(
        (r) => r.resourceType === "lesson-details",
      );
      const starterQuiz = resources.find(
        (r) => r.resourceType === "starter-quiz",
      );
      const exitQuiz = resources.find((r) => r.resourceType === "exit-quiz");

      expect(lessonDetails?.skipLinkUrl).toBeUndefined();
      expect(starterQuiz?.skipLinkUrl).toBeUndefined();
      expect(exitQuiz?.skipLinkUrl).toBeUndefined();
    });
  });

  describe("resource components", () => {
    it("each resource has a defined component", () => {
      const props = defaultTestProps();
      props.data = teachersLessonOverviewFixture({
        lessonGuideUrl: "https://example.com/guide.pdf",
        presentationUrl: "https://example.com/slides.pdf",
        hasMediaClips: true,
        lessonMediaClips: lessonMediaClipsFixtures().mediaClips,
        videoMuxPlaybackId: "test-playback-id",
        worksheetUrl: "https://example.com/worksheet.pdf",
        additionalMaterialUrl: "https://example.com/additional.pdf",
      });

      const resources = getLessonResources(props);

      resources.forEach((resource) => {
        expect(resource.component).toBeDefined();
      });
    });
  });
});

describe("getSideNavLinksFromResources", () => {
  const createMockResource = (
    resourceType: LessonResource["resourceType"],
    anchorId: LessonResource["anchorId"],
    title: string,
  ): LessonResource => ({
    resourceType,
    anchorId,
    title: title as LessonResource["title"],
    component: <div>{title}</div>,
    downloadable: false,
  });

  it("creates side nav links for non-quiz resources using resource type as anchorId", () => {
    const resources: LessonResource[] = [
      createMockResource("slide-deck", "slide-deck", "Lesson slides"),
      createMockResource("lesson-details", "lesson-details", "Lesson details"),
      createMockResource("video", "video", "Lesson video"),
    ];

    const links = getSideNavLinksFromResources(resources);

    expect(links).toEqual([
      { label: "Lesson slides", anchorId: "slide-deck" },
      { label: "Lesson details", anchorId: "lesson-details" },
      { label: "Lesson video", anchorId: "video" },
    ]);
  });

  it("groups both quizzes into single nav link when both exist", () => {
    const resources: LessonResource[] = [
      createMockResource("lesson-details", "lesson-details", "Lesson details"),
      createMockResource(
        "starter-quiz",
        "quiz",
        "Prior knowledge starter quiz",
      ),
      createMockResource("exit-quiz", "exit-quiz", "Assessment exit quiz"),
    ];

    const links = getSideNavLinksFromResources(resources);

    expect(links).toHaveLength(2);
    expect(links[0]).toEqual({
      label: "Lesson details",
      anchorId: "lesson-details",
    });
    expect(links[1]).toEqual({
      label: "Quizzes",
      anchorId: "quiz",
      subheading: "Prior knowledge starter quiz \nAssessment exit quiz",
    });
  });

  it("creates single quiz link with correct label when only starter quiz exists", () => {
    const resources: LessonResource[] = [
      createMockResource("lesson-details", "lesson-details", "Lesson details"),
      createMockResource(
        "starter-quiz",
        "starter-quiz",
        "Prior knowledge starter quiz",
      ),
    ];

    const links = getSideNavLinksFromResources(resources);

    expect(links).toHaveLength(2);
    expect(links[1]).toEqual({
      label: "Quizzes",
      anchorId: "starter-quiz",
      subheading: "Prior knowledge starter quiz",
    });
  });

  it("creates single quiz link with correct label when only exit quiz exists", () => {
    const resources: LessonResource[] = [
      createMockResource("lesson-details", "lesson-details", "Lesson details"),
      createMockResource("exit-quiz", "exit-quiz", "Assessment exit quiz"),
    ];

    const links = getSideNavLinksFromResources(resources);

    expect(links).toHaveLength(2);
    expect(links[1]).toEqual({
      label: "Quizzes",
      anchorId: "exit-quiz",
      subheading: "Assessment exit quiz",
    });
  });
});
