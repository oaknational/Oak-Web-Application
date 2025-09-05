import { isExternalHref, resolveOakHref, ResolveOakHrefProps } from "./urls";

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
    it("Unit listing", () => {
      const props: ResolveOakHrefProps = {
        page: "unit-index",
        programmeSlug: "primary-ks2-maths",
      };
      expect(resolveOakHref(props)).toBe(
        "/teachers/programmes/primary-ks2-maths/units",
      );
    });
    it("Programme listing", () => {
      const props: ResolveOakHrefProps = {
        page: "programme-index",
        keyStageSlug: "ks2",
        subjectSlug: "maths",
      };
      expect(resolveOakHref(props)).toBe(
        "/teachers/key-stages/ks2/subjects/maths/programmes",
      );
    });
    it("Unit listing with query", () => {
      expect(
        resolveOakHref({
          page: "unit-index",
          programmeSlug: "primary-ks2-maths",
          search: { "learning-theme": "circls" },
        }),
      ).toBe(
        "/teachers/programmes/primary-ks2-maths/units?learning-theme=circls",
      );
    });
    it("Lesson listing", () => {
      expect(
        resolveOakHref({
          page: "lesson-index",
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
    it("Lesson downloads", () => {
      expect(
        resolveOakHref({
          page: "lesson-downloads",
          programmeSlug: "primary-ks2-maths",
          unitSlug: "geometry-349",
          lessonSlug: "semi-circles-48",
          downloads: "downloads",
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
    it("Subject listing", () => {
      expect(
        resolveOakHref({
          page: "subject-index",
          keyStageSlug: "ks2",
        }),
      ).toBe("/teachers/key-stages/ks2/subjects");
    });
    it("About us: Board", () => {
      expect(resolveOakHref({ page: "about-board" })).toBe("/about-us/board");
    });
    it("About us: Who we are", () => {
      expect(resolveOakHref({ page: "about-who-we-are" })).toBe(
        "/about-us/who-we-are",
      );
    });
    it("About us: Leadership", () => {
      expect(resolveOakHref({ page: "about-leadership" })).toBe(
        "/about-us/leadership",
      );
    });
    it("About us: Partners", () => {
      expect(resolveOakHref({ page: "about-partners" })).toBe(
        "/about-us/partners",
      );
    });
    it("About us: Work with us", () => {
      expect(resolveOakHref({ page: "about-work-with-us" })).toBe(
        "/about-us/work-with-us",
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
    it("Support your team", () => {
      expect(resolveOakHref({ page: "support-your-team" })).toBe(
        "/support-your-team",
      );
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
  });
});
