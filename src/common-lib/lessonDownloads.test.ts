import {
  buildLessonDownloads,
  buildLessonOverviewDownloads,
  getLessonDownloadMetadata,
  getLessonDownloadTitle,
  getLessonDownloadTypes,
  LessonDownloadContent,
  lessonDownloadFormats,
  lessonDownloadResources,
  lessonDownloadTypeSchema,
} from "./lessonDownloads";

import { lessonDownloadsListSchema } from "@/node-lib/curriculum-api-2023/shared.schema";
import { lessonOverviewDownloads } from "@/node-lib/curriculum-api-2023/queries/lessonOverview/lessonOverview.schema";
import { teachersLessonOverviewDownloads } from "@/node-lib/curriculum-api-2023/queries/teachersLessonOverview/teachersLessonOverview.schema";
import { combinedPreselectedTypeMap } from "@/components/TeacherComponents/helpers/downloadAndShareHelpers/combinedPreselectedTypeMap";
import { getGroupName } from "@/components/TeacherComponents/helpers/downloadAndShareHelpers/groupResources";
import { isResourceTypeSubjectToCopyright } from "@/components/TeacherComponents/helpers/downloadAndShareHelpers/downloadsLegacyCopyright";
import { getAccordionText } from "@/components/TeacherComponents/DownloadPageWithAccordion/getAccordionText";

const allContent: LessonDownloadContent = {
  hasSlideDeckAssetObject: true,
  hasStarterQuiz: true,
  hasExitQuiz: true,
  hasWorksheetAssetObject: true,
  hasWorksheetAnswersAssetObject: true,
  hasWorksheetGoogleDriveDownloadableVersion: true,
  hasSupplementaryAssetObject: true,
  hasLessonGuideObject: true,
  isLegacy: false,
};

describe("lesson download registry", () => {
  it("uses unique type IDs", () => {
    const types = lessonDownloadFormats.map(({ type }) => type);
    expect(new Set(types).size).toBe(types.length);
  });

  it.each(lessonDownloadFormats)(
    "wires $type through schemas and UI metadata",
    ({ resource, ...format }) => {
      const downloads = [{ ...format, exists: true }];
      expect(lessonDownloadTypeSchema.parse(format.type)).toBe(format.type);
      expect(lessonDownloadsListSchema.safeParse(downloads).success).toBe(true);
      expect(lessonOverviewDownloads.safeParse(downloads).success).toBe(true);
      expect(teachersLessonOverviewDownloads.safeParse(downloads).success).toBe(
        true,
      );
      expect(getLessonDownloadMetadata(format.type).icon).toBe(resource.icon);
      expect(getGroupName(format.type)).toBe(resource.group);
      expect(isResourceTypeSubjectToCopyright(format.type)).toBe(
        resource.subjectToCopyright,
      );
      expect(getAccordionText({ lessonDownloads: downloads })).toBe(
        resource.accordionLabel
          ? resource.accordionLabel.charAt(0).toUpperCase() +
              resource.accordionLabel.slice(1)
          : "",
      );
      if (resource.availability) {
        expect(buildLessonDownloads(allContent)).toContainEqual({
          ...format,
          exists: true,
        });
      } else {
        expect(buildLessonDownloads(allContent)).not.toContainEqual({
          ...format,
          exists: true,
        });
      }
    },
  );

  it.each([
    ["lesson guide", "lesson-guide"],
    ["slide deck", "slide-deck"],
    ["starter quiz", "starter-quiz"],
    ["exit quiz", "exit-quiz"],
    ["worksheet", "worksheet"],
    ["additional material", "additional-material"],
    ["additional files", "additional-files"],
  ] as const)("preselects every format for %s", (preselection, family) => {
    expect(combinedPreselectedTypeMap[preselection].downloadType).toEqual(
      getLessonDownloadTypes(family),
    );
    expect(getLessonDownloadTypes(family)).toEqual(
      lessonDownloadResources[family].formats.map(({ type }) => type),
    );
  });

  it("preserves quiz and video sharing selections", () => {
    expect(combinedPreselectedTypeMap["starter quiz"].shareType).toEqual([
      "starter-quiz",
    ]);
    expect(combinedPreselectedTypeMap["exit quiz"].shareType).toEqual([
      "exit-quiz",
    ]);
    expect(combinedPreselectedTypeMap.video).toEqual({ shareType: ["video"] });
    expect(combinedPreselectedTypeMap.all).toEqual({
      downloadType: "all",
      shareType: "all",
    });
  });

  it("preserves download titles and deduplicates quiz extensions", () => {
    expect(getLessonDownloadTitle("lesson-guide")).toBe(
      "lesson guide (PDF/DOCX)",
    );
    expect(getLessonDownloadTitle("slide-deck")).toBe("lesson slides (PPTX)");
    expect(getLessonDownloadTitle("starter-quiz")).toBe(
      "starter quiz questions (PDF)",
    );
    expect(getLessonDownloadTitle("exit-quiz")).toBe(
      "exit quiz questions (PDF)",
    );
    expect(getLessonDownloadTitle("worksheet")).toBe("worksheet (PPTX/PDF)");
    expect(getLessonDownloadTitle("additional-material")).toBe(
      "additional material (PDF)",
    );
    expect(getLessonDownloadTitle("curriculum")).toBeUndefined();
  });

  it("rejects unregistered download types", () => {
    expect(lessonDownloadTypeSchema.safeParse("not-a-resource").success).toBe(
      false,
    );
  });

  it("deduplicates guide descriptions when both formats are present", () => {
    expect(
      getAccordionText({
        lessonDownloads: buildLessonDownloads(allContent).filter(({ type }) =>
          getLessonDownloadTypes("lesson-guide").includes(type),
        ),
      }),
    ).toBe("Lesson guide");
  });

  it("keeps guide formats first on downloads and last on overviews", () => {
    const downloads = buildLessonDownloads(allContent);
    const guides = getLessonDownloadTypes("lesson-guide");
    const overview = buildLessonOverviewDownloads(allContent);
    expect(downloads.slice(0, guides.length).map(({ type }) => type)).toEqual(
      guides,
    );
    expect(overview.slice(-guides.length).map(({ type }) => type)).toEqual(
      guides,
    );
    expect(overview).toEqual(
      [
        ...downloads.filter(({ type }) => !guides.includes(type)),
        ...downloads.filter(({ type }) => guides.includes(type)),
      ].map(({ type, exists }) => ({ type, exists })),
    );
    expect(overview).toContainEqual({
      type: "exit-quiz-answers",
      exists: true,
    });
  });

  it.each([
    [true, false, false, true, true],
    [true, true, true, false, false],
    [false, true, false, false, true],
    [false, false, true, false, true],
    [false, false, false, true, false],
  ])(
    "preserves worksheet availability for legacy=%s, asset=%s, answers=%s, drive=%s",
    (isLegacy, asset, answers, drive, expected) => {
      const downloads = buildLessonDownloads({
        ...allContent,
        isLegacy,
        hasWorksheetAssetObject: asset,
        hasWorksheetAnswersAssetObject: answers,
        hasWorksheetGoogleDriveDownloadableVersion: drive,
      });
      expect(
        downloads
          .filter(({ type }) =>
            getLessonDownloadTypes("worksheet").includes(type),
          )
          .map(({ exists }) => exists),
      ).toEqual([expected, expected]);
    },
  );
});
