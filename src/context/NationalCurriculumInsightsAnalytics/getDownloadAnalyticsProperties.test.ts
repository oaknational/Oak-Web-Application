import { getDownloadAnalyticsProperties } from "./getDownloadAnalyticsProperties";

it("describes a mixed-phase ZIP using unique selections without sending the email", () => {
  expect(
    getDownloadAnalyticsProperties({
      selectedValues: [
        "science:primary",
        "science:secondary",
        "science:primary",
        "english:primary",
      ],
      email: "teacher@example.com",
      schoolOption: "Not listed",
      downloadAttemptId: "attempt-1",
    }),
  ).toEqual({
    downloadAttemptId: "attempt-1",
    selectedDownloadKeys: [
      "science:primary",
      "science:secondary",
      "english:primary",
    ],
    selectedSubjectSlugs: ["science", "english"],
    selectedPhases: ["primary", "secondary"],
    documentCount: 3,
    fileFormat: "zip",
    emailSupplied: true,
    schoolOption: "Not listed",
  });
});

it("describes a single DOCX and treats whitespace email as absent", () => {
  expect(
    getDownloadAnalyticsProperties({
      selectedValues: ["science:primary"],
      email: "   ",
      schoolOption: "Homeschool",
      downloadAttemptId: "attempt-2",
    }),
  ).toEqual({
    downloadAttemptId: "attempt-2",
    selectedDownloadKeys: ["science:primary"],
    selectedSubjectSlugs: ["science"],
    selectedPhases: ["primary"],
    documentCount: 1,
    fileFormat: "docx",
    emailSupplied: false,
    schoolOption: "Homeschool",
  });
});
