import { getFileSizes } from "./getFileSizes";

import { contentLengthFromResource } from "@/utils/resource";

jest.mock("@/utils/resource", () => ({
  contentLengthFromResource: jest.fn().mockResolvedValue(1234),
}));

describe("getFileSizes", () => {
  test("expect download size to be in document (tiers)", async () => {
    (contentLengthFromResource as jest.Mock).mockImplementation(
      async (url: string) => {
        if (url.includes("foundation")) {
          return 123456;
        } else if (url.includes("higher")) {
          return 223456;
        }
        return -1;
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
    (contentLengthFromResource as jest.Mock).mockImplementation(
      async (url: string) => {
        if (url.includes("foundation") && url.includes("combined-science")) {
          return 123456;
        } else if (url.includes("higher") && url.includes("combined-science")) {
          return 223456;
        } else if (url.includes("foundation") && url.includes("biology")) {
          return 323456;
        } else if (url.includes("higher") && url.includes("biology")) {
          return 423456;
        }
        return -1;
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
