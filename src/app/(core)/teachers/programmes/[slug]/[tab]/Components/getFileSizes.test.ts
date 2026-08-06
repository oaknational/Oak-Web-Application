import { getFileSizes } from "./getFileSizes";

import { getFile } from "@/pages/api/curriculum-downloads";

jest.mock("@/pages/api/curriculum-downloads", () => ({
  getFile: jest.fn().mockResolvedValue({}),
}));

describe("getFileSizes", () => {
  test("expect download size to be in document (tiers)", async () => {
    (getFile as jest.Mock).mockImplementation(async ({ tierSlug }) => {
      if (tierSlug === "foundation") {
        return Buffer.alloc(123456);
      } else if (tierSlug === "higher") {
        return Buffer.alloc(223456);
      }
      return;
    });
    const out = await getFileSizes(
      {
        phaseSlug: "secondary",
        subjectSlug: "science",
        ks4OptionSlug: null,
      },
      {
        tiers: [
          {
            tier: "Foundation",
            tier_slug: "foundation",
          },
          {
            tier: "Higher",
            tier_slug: "higher",
          },
        ],
        child_subjects: [],
      },
    );

    expect(out).toEqual([
      {
        downloadId: "curriculum-plans",
        size: 123456,
        tier: "foundation",
        childSubject: null,
      },
      {
        downloadId: "curriculum-plans",
        size: 223456,
        tier: "higher",
        childSubject: null,
      },
      {
        downloadId: "national-curriculum",
        size: 123456,
        tier: "foundation",
        childSubject: null,
      },
      {
        downloadId: "national-curriculum",
        size: 223456,
        tier: "higher",
        childSubject: null,
      },
    ]);
  });

  test("expect download size to be in document (child subjects & tiers)", async () => {
    (getFile as jest.Mock).mockImplementation(
      async ({ tierSlug, childSubjectSlug }) => {
        if (
          tierSlug === "foundation" &&
          childSubjectSlug === "combined-science"
        ) {
          return Buffer.alloc(123456);
        } else if (
          tierSlug === "higher" &&
          childSubjectSlug === "combined-science"
        ) {
          return Buffer.alloc(223456);
        } else if (
          tierSlug === "foundation" &&
          childSubjectSlug === "biology"
        ) {
          return Buffer.alloc(323456);
        } else if (tierSlug === "higher" && childSubjectSlug === "biology") {
          return Buffer.alloc(423456);
        }
        return;
      },
    );
    const out = await getFileSizes(
      {
        phaseSlug: "secondary",
        subjectSlug: "science",
        ks4OptionSlug: null,
      },
      {
        tiers: [
          {
            tier: "Foundation",
            tier_slug: "foundation",
          },
          {
            tier: "Higher",
            tier_slug: "higher",
          },
        ],
        child_subjects: [
          {
            subject: "Combined science",
            subject_slug: "combined-science",
          },
          {
            subject: "Biology",
            subject_slug: "biology",
          },
        ],
      },
    );

    expect(out).toEqual([
      {
        downloadId: "curriculum-plans",
        size: 123456,
        tier: "foundation",
        childSubject: "combined-science",
      },
      {
        downloadId: "curriculum-plans",
        size: 223456,
        tier: "higher",
        childSubject: "combined-science",
      },
      {
        downloadId: "curriculum-plans",
        size: 323456,
        tier: "foundation",
        childSubject: "biology",
      },
      {
        downloadId: "curriculum-plans",
        size: 423456,
        tier: "higher",
        childSubject: "biology",
      },
      {
        downloadId: "national-curriculum",
        size: 123456,
        tier: "foundation",
        childSubject: "combined-science",
      },
      {
        downloadId: "national-curriculum",
        size: 223456,
        tier: "higher",
        childSubject: "combined-science",
      },
      {
        downloadId: "national-curriculum",
        size: 323456,
        tier: "foundation",
        childSubject: "biology",
      },
      {
        downloadId: "national-curriculum",
        size: 423456,
        tier: "higher",
        childSubject: "biology",
      },
    ]);
  });
});
