import JSZip from "jszip";

import {
  generateNationalCurriculumInsightsDocx,
  nationalCurriculumInsightsDownloadFilename,
} from "./docx";

import previewSnapshot from "@/app/(core)/teachers/national-curriculum-insights/[[...segments]]/nationalCurriculumInsightsPreviewSnapshot.json";
import { nationalCurriculumInsightsSubjectSchema } from "@/common-lib/cms-types/nationalCurriculumInsights";
import { zipFromFiles } from "@/utils/curriculum/zip";

const science = previewSnapshot.subjects
  .map((subject) => nationalCurriculumInsightsSubjectSchema.parse(subject))
  .find(({ slug }) => slug === "science");

if (!science) {
  throw new Error("Expected the Science preview fixture");
}

describe("National Curriculum Insights documents", () => {
  it("includes a phase page and all of its key-stage pages in one document", async () => {
    const buffer = await generateNationalCurriculumInsightsDocx({
      phase: "primary",
      subject: science,
    });
    const zip = await JSZip.loadAsync(buffer);
    const documentXml = await zip.file("word/document.xml")!.async("string");

    expect(documentXml).toContain("Science");
    expect(documentXml).toContain("Primary");
    expect(documentXml).toContain("Key stage 1");
    expect(documentXml).toContain("Key stage 2");
    expect(documentXml).not.toContain("Curriculum download form");
  });

  it("packages separately generated subject documents into a zip", async () => {
    const primary = await generateNationalCurriculumInsightsDocx({
      phase: "primary",
      subject: science,
    });
    const secondary = await generateNationalCurriculumInsightsDocx({
      phase: "secondary",
      subject: science,
    });
    const bundle = await zipFromFiles([
      { filename: "Science - Primary.docx", buffer: primary },
      { filename: "Science - Secondary.docx", buffer: secondary },
    ]);
    const zip = await JSZip.loadAsync(bundle);

    expect(Object.keys(zip.files)).toEqual([
      "Science - Primary.docx",
      "Science - Secondary.docx",
    ]);
  });

  it("uses a human-readable subject, phase and date filename", () => {
    expect(
      nationalCurriculumInsightsDownloadFilename({
        phase: "primary",
        subjectTitle: "Science",
      }),
    ).toMatch(
      /^National curriculum insights - Science - Primary - \d{2}-\d{2}-\d{4}\.docx$/,
    );
  });
});
