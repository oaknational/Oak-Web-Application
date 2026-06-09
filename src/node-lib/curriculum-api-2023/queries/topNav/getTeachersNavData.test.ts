import { getProgrammeCount, getTeachersNavData } from "./getTeachersNavData";
import { mockResponseData } from "./fixtures";
import { SubjectsNavItemProps } from "./topNav.schema";

import type { CurriculumPhaseOptions } from "@/node-lib/curriculum-api-2023/queries/curriculumPhaseOptions/curriculumPhaseOptions.query";

const curriculumPhaseOptionsSubjects: CurriculumPhaseOptions = [
  {
    title: "Art and design",
    slug: "art",
    phases: [
      { title: "Primary", slug: "primary" },
      { title: "Secondary", slug: "secondary" },
    ],
    ks4_options: [],
  },
  {
    title: "Financial education",
    slug: "financial-education",
    phases: [{ title: "Primary", slug: "primary" }],
    ks4_options: [],
  },
  {
    title: "Computing",
    slug: "computing",
    phases: [{ title: "Secondary", slug: "secondary" }],
    ks4_options: [
      { title: "AQA", slug: "aqa" },
      { title: "Edexcel", slug: "edexcel" },
    ],
  },
  {
    title: "Maths",
    slug: "maths",
    phases: [
      { title: "Primary", slug: "primary" },
      { title: "Secondary", slug: "secondary" },
    ],
    ks4_options: [],
  },
  {
    title: "Religious education",
    slug: "religious-education",
    phases: [{ title: "Secondary", slug: "secondary" }],
    ks4_options: [
      { title: "AQA", slug: "aqa" },
      { title: "Edexcel B", slug: "edexcelb" },
      { title: "Eduqas", slug: "eduqas" },
    ],
  },
];

const getNav = (phase: "primary" | "secondary") =>
  getTeachersNavData(mockResponseData, phase, curriculumPhaseOptionsSubjects);

describe("getTeachersNavData", () => {
  it("gets primary data", () => {
    const result = getNav("primary");
    expect(result.title).toBe("Primary");
    expect(result.children).toHaveLength(3);
  });
  it("gets secondary data", () => {
    const result = getNav("secondary");
    expect(result.title).toBe("Secondary");
    expect(result.children).toHaveLength(2);
  });
  it("correctly identifies non curriculum subjects", () => {
    const result = getNav("primary");
    const financialEducation = result.children?.[0]?.children?.find(
      (s) => s.slug === "financial-education",
    );
    if (financialEducation?.navItemProps.type !== "subjectNavItem") {
      throw new Error("Invalid nav item");
    }
    expect(financialEducation?.navItemProps.nonCurriculum).toBeTruthy();
  });
  it("includes EYFS in primary", () => {
    const result = getNav("primary");
    const eyfs = result.children?.find(
      (ks) => ks.slug === "early-years-foundation-stage",
    );
    expect(eyfs).toBeDefined();
  });
  it("removes duplicate subjects from keystages", () => {
    const result = getNav("primary");
    const subjects = result.children?.[0]?.children;

    expect(subjects).toHaveLength(2);
  });
  it("includes pathways for ks4 subjects", () => {
    const result = getNav("secondary");
    const computing = result.children?.[1]?.children?.filter(
      (s) => s.slug === "computing",
    );
    expect(computing).toHaveLength(2);
  });
  it("returns a valid programme slug for subjects with one programme per keystage", () => {
    const result = getNav("secondary");
    const multipleProgrammeSubject = result.children?.[1]?.children?.find(
      (s) =>
        s.navItemProps.type === "subjectNavItem" &&
        s.navItemProps.programmeCount === 1,
    );
    expect(
      (multipleProgrammeSubject?.navItemProps as SubjectsNavItemProps)
        .programmeSlug,
    ).not.toBeNull();
  });
  it("returns programme slug as null for subjects with multiple programmes at keystage", () => {
    const result = getNav("secondary");
    const multipleProgrammeSubject = result.children?.[1]?.children?.find(
      (s) =>
        s.navItemProps.type === "subjectNavItem" &&
        s.navItemProps.programmeCount > 1,
    );
    expect(
      (multipleProgrammeSubject?.navItemProps as SubjectsNavItemProps)
        .programmeSlug,
    ).toBeNull();
  });
  it("uses subect name overrides", () => {
    const result = getNav("secondary");
    const gcseComputing = result.children?.[1]?.children?.find(
      (s) =>
        s.slug === "computing" &&
        s.navItemProps.type === "subjectNavItem" &&
        s.navItemProps.programmeCount > 1,
    );

    expect(gcseComputing?.title).toEqual("Computer science (GCSE)");
  });
  it("handles subjects with only one pathway and examboards (RE)", () => {
    const result = getNav("secondary");
    const gcseRe = result.children?.[1]?.children?.filter(
      (s) => s.slug === "religious-education",
    );

    expect(gcseRe).toHaveLength(1); // No core option
    expect(gcseRe?.[0]?.title).toBe("Religious education (GCSE)"); // gcse in title
    expect(
      (gcseRe?.[0]?.navItemProps as SubjectsNavItemProps).programmeCount,
    ).toBe(3); // one programme per examboard
  });

  it("builds exam board hrefs from programme slugs", () => {
    const result = getNav("secondary");
    const gcseComputing = result.children?.[1]?.children?.find(
      (s) => s.slug === "computing" && s.title === "Computer science (GCSE)",
    );

    expect(gcseComputing?.children).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: "Edexcel",
          navItemProps: expect.objectContaining({
            href: "/teachers/programmes/computing-secondary-edexcel/units?keystages=ks4",
          }),
        }),
        expect.objectContaining({
          title: "AQA",
          navItemProps: expect.objectContaining({
            href: "/teachers/programmes/computing-secondary-aqa/units?keystages=ks4",
          }),
        }),
      ]),
    );
  });

  it("builds tier hrefs from programme slugs", () => {
    const result = getNav("secondary");
    const maths = result.children?.[1]?.children?.find(
      (s) => s.slug === "maths",
    );

    expect(maths?.children).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: "Higher",
          navItemProps: expect.objectContaining({
            href: "/teachers/programmes/maths-secondary/units?keystages=ks4&tiers=higher",
          }),
        }),
        expect.objectContaining({
          title: "Foundation",
          navItemProps: expect.objectContaining({
            href: "/teachers/programmes/maths-secondary/units?keystages=ks4&tiers=foundation",
          }),
        }),
      ]),
    );
  });
});

describe("getProgrammeCount", () => {
  it("gets the correct programme count for primary subjects", () => {
    const result = getProgrammeCount({
      data: mockResponseData,
      keystageSlug: "ks1",
      subjectSlug: "art",
      pathwaySlug: null,
    });
    expect(result).toBe(1);
  });
  it("gets the correct programme count for secondary subjects with tiers", () => {
    const result = getProgrammeCount({
      data: mockResponseData,
      keystageSlug: "ks4",
      subjectSlug: "maths",
      pathwaySlug: null,
    });
    expect(result).toBe(2);
  });
  it("gets the correct programme count for secondary subjects with pathways with no pfs", () => {
    const result = getProgrammeCount({
      data: mockResponseData,
      keystageSlug: "ks4",
      subjectSlug: "computing",
      pathwaySlug: "core",
    });
    expect(result).toBe(1);
  });
  it("gets the correct programme count for secondary subjects with pathways with pfs", () => {
    const result = getProgrammeCount({
      data: mockResponseData,
      keystageSlug: "ks4",
      subjectSlug: "computing",
      pathwaySlug: "gcse",
    });
    expect(result).toBe(2);
  });
});
