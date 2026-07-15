import {
  isExternalHref,
  resolveOakHref,
  resolveProgrammeUnitsHref,
  ResolveOakHrefProps,
} from "./urls";

describe("urls.ts", () => {
  describe("isExternalHref()", () => {
    test.each([
      "https://teachers.thenational.academy",
      "https://classroom.thenational.academy",
      "https://www.example.com",
    ])("'%s' is external", (href) => {
      expect(isExternalHref(href)).toBe(true);
    });
    test.each(["/about", "#email-form", "http://localhost/contact-us"])(
      "'%s' is not external",
      (href) => {
        expect(isExternalHref(href)).toBe(false);
      },
    );
  });

  describe("resolveOakHrefProps()", () => {
    it("Our teachers", () => {
      const props: ResolveOakHrefProps = { page: "our-teachers" };
      expect(resolveOakHref(props)).toBe(
        "https://classroom.thenational.academy/teachers",
      );
    });
    it("Blog single", () => {
      const props: ResolveOakHrefProps = {
        page: "blog-single",
        blogSlug: "a-blog",
      };
      expect(resolveOakHref(props)).toBe("/blog/a-blog");
    });
    it("Webinar single", () => {
      const props: ResolveOakHrefProps = {
        page: "webinar-single",
        webinarSlug: "a-webinar",
      };
      expect(resolveOakHref(props)).toBe("/webinars/a-webinar");
    });
    it("Blog listing", () => {
      const props: ResolveOakHrefProps = {
        page: "blog-index",
      };
      expect(resolveOakHref(props)).toBe("/blog");
    });
    it("Blog listing with category", () => {
      const props: ResolveOakHrefProps = {
        page: "blog-index",
        categorySlug: "lessons",
      };
      expect(resolveOakHref(props)).toBe("/blog/categories/lessons");
    });
    it("Webinar listing ", () => {
      const props: ResolveOakHrefProps = {
        page: "webinar-index",
      };
      expect(resolveOakHref(props)).toBe("/webinars");
    });
    it("Webinar listing with category", () => {
      const props: ResolveOakHrefProps = {
        page: "webinar-index",
        categorySlug: "lessons",
      };
      expect(resolveOakHref(props)).toBe("/webinars/categories/lessons");
    });
    it("Webinar listing with query", () => {
      const props: ResolveOakHrefProps = {
        page: "webinar-index",
        search: {
          page: "6",
        },
      };
      expect(resolveOakHref(props)).toBe("/webinars?page=6");
    });
    it("Unit overview", () => {
      expect(
        resolveOakHref({
          page: "unit-overview",
          programmeSlug: "primary-ks2-maths",
          unitSlug: "geometry-349",
        }),
      ).toBe(
        "/teachers/programmes/primary-ks2-maths/units/geometry-349/lessons",
      );
    });
    it("Lesson overview", () => {
      expect(
        resolveOakHref({
          page: "lesson-overview",
          programmeSlug: "primary-ks2-maths",
          unitSlug: "geometry-349",
          lessonSlug: "semi-circles-48",
        }),
      ).toBe(
        "/teachers/programmes/primary-ks2-maths/units/geometry-349/lessons/semi-circles-48",
      );
    });
    it("Unit overview with query", () => {
      expect(
        resolveOakHref({
          page: "unit-overview",
          programmeSlug: "primary-ks2-maths",
          unitSlug: "geometry-349",
          query: { subject_category: "fiction" },
        }),
      ).toBe(
        "/teachers/programmes/primary-ks2-maths/units/geometry-349/lessons?subject_category=fiction",
      );
    });
    it("Lesson downloads", () => {
      expect(
        resolveOakHref({
          page: "lesson-downloads",
          programmeSlug: "primary-ks2-maths",
          unitSlug: "geometry-349",
          lessonSlug: "semi-circles-48",
        }),
      ).toBe(
        "/teachers/programmes/primary-ks2-maths/units/geometry-349/lessons/semi-circles-48/downloads",
      );
    });
    it("Lesson media", () => {
      expect(
        resolveOakHref({
          page: "lesson-media",
          programmeSlug: "primary-ks2-maths",
          unitSlug: "geometry-360",
          lessonSlug: "semi-circles-52",
        }),
      ).toBe(
        "/teachers/programmes/primary-ks2-maths/units/geometry-360/lessons/semi-circles-52/media",
      );
    });
    it("Lesson downloads success", () => {
      expect(
        resolveOakHref({
          page: "lesson-downloads-success",
          programmeSlug: "maths-secondary-year-10-aqa",
          unitSlug: "algebra-123",
          lessonSlug: "solving-equations-456",
        }),
      ).toBe(
        "/teachers/programmes/maths-secondary-year-10-aqa/units/algebra-123/lessons/solving-equations-456/downloads/success",
      );
    });
    it("Lesson share", () => {
      expect(
        resolveOakHref({
          page: "lesson-share",
          programmeSlug: "maths-secondary-year-10-aqa",
          unitSlug: "algebra-123",
          lessonSlug: "solving-equations-456",
        }),
      ).toBe(
        "/teachers/programmes/maths-secondary-year-10-aqa/units/algebra-123/lessons/solving-equations-456/share",
      );
    });
    it("Search", () => {
      expect(
        resolveOakHref({
          page: "search",
        }),
      ).toBe("/teachers/search");
    });
    it("Search with query", () => {
      expect(
        resolveOakHref({
          page: "search",
          query: { term: "something", keyStages: ["ks4", "ks2"] },
        }),
      ).toBe("/teachers/search?term=something&keyStages=ks4%2Cks2");
    });
    it("Landing page", () => {
      expect(
        resolveOakHref({
          page: "landing-page",
          lpSlug: "lp-slug-123",
        }),
      ).toBe("/lp/lp-slug-123");
    });
    it("About us: Who we are", () => {
      expect(resolveOakHref({ page: "about-who-we-are" })).toBe(
        "/about-us/who-we-are",
      );
    });
    it("About us: Meet the team", () => {
      expect(resolveOakHref({ page: "about-meet-the-team" })).toBe(
        "/about-us/meet-the-team",
      );
    });
    it("About us: Oak's curricula", () => {
      expect(resolveOakHref({ page: "about-oaks-curricula" })).toBe(
        "/about-us/oaks-curricula",
      );
    });
    it("About us: Get involved", () => {
      expect(resolveOakHref({ page: "about-get-involved" })).toBe(
        "/about-us/get-involved",
      );
    });
    it("Contact us", () => {
      expect(resolveOakHref({ page: "contact" })).toBe("/contact-us");
    });
    it("Home", () => {
      expect(resolveOakHref({ page: "home" })).toBe("/");
    });
    it("Home (teachers)", () => {
      expect(resolveOakHref({ page: "home" })).toBe("/");
    });
    it("Lesson planning", () => {
      expect(resolveOakHref({ page: "lesson-planning" })).toBe(
        "/lesson-planning",
      );
    });
    it("Legal", () => {
      expect(
        resolveOakHref({ page: "legal", legalSlug: "legal-page-123" }),
      ).toBe("/legal/legal-page-123");
    });
    it("Help", () => {
      expect(resolveOakHref({ page: "help" })).toBe(
        "https://support.thenational.academy",
      );
    });
    it("Careers", () => {
      expect(resolveOakHref({ page: "careers" })).toBe(
        "https://app.beapplied.com/org/1574/oak-national-academy",
      );
    });
    it("Our curriculum", () => {
      expect(resolveOakHref({ page: "oak-curriculum" })).toBe(
        "https://teachers.thenational.academy/oaks-curricula",
      );
    });
    it("Classroom", () => {
      expect(resolveOakHref({ page: "classroom" })).toBe(
        "https://classroom.thenational.academy",
      );
    });
    it("Labs", () => {
      expect(resolveOakHref({ page: "labs" })).toBe(
        "https://labs.thenational.academy",
      );
    });
    it("Teacher hub", () => {
      expect(resolveOakHref({ page: "teacher-hub" })).toBe(
        "https://teachers.thenational.academy",
      );
    });
    it("Labs teaching materials", () => {
      expect(resolveOakHref({ page: "labs-teaching-materials" })).toBe(
        "https://labs.thenational.academy/aila/teaching-materials",
      );
    });
    it("Labs teaching materials with single query parameter", () => {
      expect(
        resolveOakHref({
          page: "labs-teaching-materials",
          query: { docType: "additional-glossary" },
        }),
      ).toBe(
        "https://labs.thenational.academy/aila/teaching-materials?docType=additional-glossary",
      );
    });
    it("Labs teaching materials with multiple query parameters", () => {
      expect(
        resolveOakHref({
          page: "labs-teaching-materials",
          query: {
            docType: "additional-glossary",
            lessonSlug: "fractions-intro",
            programmeSlug: "maths-ks2",
          },
        }),
      ).toBe(
        "https://labs.thenational.academy/aila/teaching-materials?docType=additional-glossary&lessonSlug=fractions-intro&programmeSlug=maths-ks2",
      );
    });
    it("Labs teaching materials with empty query object", () => {
      expect(
        resolveOakHref({
          page: "labs-teaching-materials",
          query: {},
        }),
      ).toBe("https://labs.thenational.academy/aila/teaching-materials");
    });
    it("Labs teaching materials with null/undefined query values", () => {
      expect(
        resolveOakHref({
          page: "labs-teaching-materials",
          query: {
            docType: null,
            lessonSlug: undefined,
            programmeSlug: "science-ks3",
          },
        }),
      ).toBe(
        "https://labs.thenational.academy/aila/teaching-materials?programmeSlug=science-ks3",
      );
    });

    it("EYFS page direct link", () => {
      const props: ResolveOakHrefProps = {
        page: "eyfs-page",
        subjectSlug: "maths",
      };
      expect(resolveOakHref(props)).toBe("/teachers/eyfs/maths");
    });
  });

  describe("resolveProgrammeUnitsHref()", () => {
    it("converts a simple ks3 programme slug to a teacher-programme units URL", () => {
      expect(resolveProgrammeUnitsHref("history-secondary-ks3")).toBe(
        "/teachers/programmes/history-secondary/units?keystages=ks3",
      );
    });

    it("converts an EYFS programme slug to a teacher-programme units URL", () => {
      expect(
        resolveProgrammeUnitsHref(
          "maths-foundation-early-years-foundation-stage-l",
        ),
      ).toBe(
        "/teachers/programmes/maths-foundation/units?keystages=early-years-foundation-stage",
      );
    });

    it("maps legacy learning-theme search param to threads query key", () => {
      expect(
        resolveProgrammeUnitsHref("english-secondary-ks3", {
          "learning-theme": "reading",
        }),
      ).toBe(
        "/teachers/programmes/english-secondary/units?keystages=ks3&threads=reading",
      );
    });

    it("maps legacy category search param to subject_categories query key", () => {
      expect(
        resolveProgrammeUnitsHref("english-secondary-ks3", {
          category: "grammar",
        }),
      ).toBe(
        "/teachers/programmes/english-secondary/units?keystages=ks3&subject_categories=grammar",
      );
    });

    it("maps KS4 science child-subject slug to science parent when parent subject context is provided", () => {
      expect(
        resolveProgrammeUnitsHref(
          "biology-secondary-ks4-higher-aqa",
          undefined,
          { subjectParentTitle: "Science" },
        ),
      ).toBe(
        "/teachers/programmes/science-secondary-aqa/units?keystages=ks4&tiers=higher&child_subjects=biology",
      );
    });

    it("falls back to the subject slug in the programme slug when parent subject context is not provided", () => {
      expect(
        resolveProgrammeUnitsHref("history-secondary-ks3", undefined, {
          subjectParentTitle: null,
        }),
      ).toBe("/teachers/programmes/history-secondary/units?keystages=ks3");
    });

    it("falls back to a raw programme units URL for unparseable slugs", () => {
      expect(resolveProgrammeUnitsHref("not-a-valid-slug")).toBe(
        "/teachers/programmes/not-a-valid-slug/units",
      );
    });

    it("falls back to a raw programme units URL for unparseable slugs with search params", () => {
      expect(
        resolveProgrammeUnitsHref("not-a-valid-slug", {
          year: "year-7",
          "learning-theme": "reading",
          category: "grammar",
        }),
      ).toBe(
        "/teachers/programmes/not-a-valid-slug/units?year=year-7&learning-theme=reading&category=grammar",
      );
    });
  });
});
