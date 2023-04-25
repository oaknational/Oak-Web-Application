import {
  getPageViewProps,
  isExternalHref,
  resolveOakHref,
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
      }
    );
  });

  describe("resolveOakHrefProps()", () => {
    it("Our teachers", () => {
      const props: ResolveOakHrefProps = { page: "our-teachers" };
      expect(resolveOakHref(props)).toBe(
        "https://classroom.thenational.academy/teachers"
      );
    });
    it("Blog single", () => {
      const props: ResolveOakHrefProps = {
        page: "blog-single",
        slug: "a-blog",
      };
      expect(resolveOakHref(props)).toBe("/blog/a-blog");
    });
    it("Webinar single", () => {
      const props: ResolveOakHrefProps = {
        page: "webinar-single",
        slug: "a-webinar",
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
        category: "lessons",
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
        category: "lessons",
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
        viewType: "teachers",
        keyStage: "ks2",
        subject: "maths",
      };
      expect(resolveOakHref(props)).toBe(
        "/beta/teachers/key-stages/ks2/subjects/maths/units"
      );
    });
    it("Tier selection", () => {
      const props: ResolveOakHrefProps = {
        page: "tier-selection",
        viewType: "teachers",
        keyStage: "ks2",
        subject: "maths",
      };
      expect(resolveOakHref(props)).toBe(
        "/beta/teachers/key-stages/ks2/subjects/maths/units"
      );
    });
    it("Unit listing with query", () => {
      expect(
        resolveOakHref({
          page: "unit-index",
          viewType: "teachers",
          keyStage: "ks2",
          subject: "maths",
          search: { "learning-theme": "circls" },
        })
      ).toBe(
        "/beta/teachers/key-stages/ks2/subjects/maths/units?learning-theme=circls"
      );
    });
    it("Lesson listing", () => {
      expect(
        resolveOakHref({
          page: "lesson-index",
          viewType: "teachers",
          keyStage: "ks2",
          subject: "maths",
          slug: "geometry-349",
        })
      ).toBe("/beta/teachers/key-stages/ks2/subjects/maths/units/geometry-349");
    });
    it("Lesson overview", () => {
      expect(
        resolveOakHref({
          page: "lesson-overview",
          viewType: "teachers",
          keyStage: "ks2",
          subject: "maths",
          unit: "geometry-349",
          slug: "semi-circles-48",
        })
      ).toBe(
        "/beta/teachers/key-stages/ks2/subjects/maths/units/geometry-349/lessons/semi-circles-48"
      );
    });
    it("Lesson downloads", () => {
      expect(
        resolveOakHref({
          page: "lesson-downloads",
          viewType: "teachers",
          keyStageSlug: "ks2",
          subjectSlug: "maths",
          unitSlug: "geometry-349",
          slug: "semi-circles-48",
        })
      ).toBe(
        "/beta/teachers/key-stages/ks2/subjects/maths/units/geometry-349/lessons/semi-circles-48/downloads"
      );
    });
    it("Search", () => {
      expect(
        resolveOakHref({
          page: "search",
          viewType: "teachers",
        })
      ).toBe("/beta/teachers/search");
    });
    it("Search with query", () => {
      expect(
        resolveOakHref({
          page: "search",
          viewType: "teachers",
          query: { term: "something", keyStages: ["ks4", "ks2"] },
        })
      ).toBe("/beta/teachers/search?term=something&keyStages=ks4%2Cks2");
    });
    it("Landing page", () => {
      expect(
        resolveOakHref({
          page: "landing-page",
          slug: "lp-slug-123",
        })
      ).toBe("/lp/lp-slug-123");
    });
    it("Subject listing", () => {
      expect(
        resolveOakHref({
          page: "subject-index",
          viewType: "teachers",
          slug: "ks2",
        })
      ).toBe("/beta/teachers/key-stages/ks2/subjects");
    });
    it("About us: Board", () => {
      expect(resolveOakHref({ page: "about-board" })).toBe("/about-us/board");
    });
    it("About us: Who we are", () => {
      expect(resolveOakHref({ page: "about-who-we-are" })).toBe(
        "/about-us/who-we-are"
      );
    });
    it("About us: Leadership", () => {
      expect(resolveOakHref({ page: "about-leadership" })).toBe(
        "/about-us/leadership"
      );
    });
    it("About us: Partners", () => {
      expect(resolveOakHref({ page: "about-partners" })).toBe(
        "/about-us/partners"
      );
    });
    it("About us: Work with us", () => {
      expect(resolveOakHref({ page: "about-work-with-us" })).toBe(
        "/about-us/work-with-us"
      );
    });
    it("Contact us", () => {
      expect(resolveOakHref({ page: "contact" })).toBe("/contact-us");
    });
    it("Develop your curriculum", () => {
      expect(resolveOakHref({ page: "develop-your-curriculum" })).toBe(
        "/develop-your-curriculum"
      );
    });
    it("Home", () => {
      expect(resolveOakHref({ page: "home", viewType: null })).toBe("/");
    });
    it("Home (teachers)", () => {
      expect(resolveOakHref({ page: "home", viewType: "teachers" })).toBe(
        "/beta/teachers"
      );
    });
    it("Lesson planning", () => {
      expect(resolveOakHref({ page: "lesson-planning" })).toBe(
        "/lesson-planning"
      );
    });
    it("Legal", () => {
      expect(resolveOakHref({ page: "legal", slug: "legal-page-123" })).toBe(
        "/legal/legal-page-123"
      );
    });
    it("Support your team", () => {
      expect(resolveOakHref({ page: "support-your-team" })).toBe(
        "/support-your-team"
      );
    });
    it("Help", () => {
      expect(resolveOakHref({ page: "help" })).toBe(
        "https://support.thenational.academy"
      );
    });
    it("Careers", () => {
      expect(resolveOakHref({ page: "careers" })).toBe(
        "https://app.beapplied.com/org/1574/oak-national-academy"
      );
    });
    it("Our curriculum", () => {
      expect(resolveOakHref({ page: "oak-curriculum" })).toBe(
        "https://teachers.thenational.academy/oaks-curricula"
      );
    });
    it("Classroom", () => {
      expect(resolveOakHref({ page: "classroom" })).toBe(
        "https://classroom.thenational.academy"
      );
    });
    it("Teacher hub", () => {
      expect(resolveOakHref({ page: "teacher-hub" })).toBe(
        "https://teachers.thenational.academy"
      );
    });
  });
});
describe("getPageViewProps()", () => {
  it("Blog listing", () => {
    expect(getPageViewProps("/blog")).toEqual({
      pageName: "Blog Listing",
      analyticsUseCase: null,
    });
  });
  it("Blog listing with category", () => {
    expect(getPageViewProps("/blog/categories/lessons")).toEqual({
      pageName: "Blog Listing",
      analyticsUseCase: null,
    });
  });
  it("Blog single", () => {
    expect(getPageViewProps("/blog/a-blog")).toEqual({
      pageName: "Blog",
      analyticsUseCase: null,
    });
  });
  it("Webinar listing ", () => {
    expect(getPageViewProps("/webinars")).toEqual({
      pageName: "Webinar Listing",
      analyticsUseCase: null,
    });
  });
  it("Webinar listing with category", () => {
    expect(getPageViewProps("/webinars/categories/lessons")).toEqual({
      pageName: "Webinar Listing",
      analyticsUseCase: null,
    });
  });
  it("Webinar listing with query", () => {
    expect(getPageViewProps("/webinars?page=6")).toEqual({
      pageName: "Webinar Listing",
      analyticsUseCase: null,
    });
  });
  it("Webinar single", () => {
    expect(getPageViewProps("/webinars/a-webinar")).toEqual({
      pageName: "Webinar",
      analyticsUseCase: null,
    });
  });
  it("Unit listing", () => {
    expect(
      getPageViewProps("/beta/teachers/key-stages/ks2/subjects/maths/units")
    ).toEqual({
      pageName: "Unit Listing",
      analyticsUseCase: null,
    });
  });
  it("Unit listing with query", () => {
    expect(
      getPageViewProps(
        "/beta/teachers/key-stages/ks2/subjects/maths/units?learning-theme=circls"
      )
    ).toEqual({
      pageName: "Unit Listing",
      analyticsUseCase: null,
    });
  });
  it("Lesson listing", () => {
    expect(
      getPageViewProps(
        "/beta/teachers/key-stages/ks2/subjects/maths/units/geometry-123"
      )
    ).toEqual({
      pageName: "Lesson Listing",
      analyticsUseCase: null,
    });
  });
  it("Lesson overview", () => {
    expect(
      getPageViewProps(
        "/beta/teachers/key-stages/ks2/subjects/maths/units/geometry-123/lessons/angles-123"
      )
    ).toEqual({
      pageName: "Lesson",
      analyticsUseCase: null,
    });
  });
  it("Lesson downloads", () => {
    expect(
      getPageViewProps(
        "/beta/teachers/key-stages/ks2/subjects/maths/units/geometry-123/lessons/angles-123/downloads"
      )
    ).toEqual({
      pageName: "Lesson Download",
      analyticsUseCase: null,
    });
  });
  it("Search", () => {
    expect(getPageViewProps("/beta/teachers/search")).toEqual({
      pageName: "Search",
      analyticsUseCase: null,
    });
  });
  it("Search with query", () => {
    expect(getPageViewProps("/beta/teachers/search?term=macb")).toEqual({
      pageName: "Search",
      analyticsUseCase: null,
    });
  });
  it("Landing page", () => {
    expect(getPageViewProps("/lp/lp-slug-from-sanity-123")).toEqual({
      pageName: "Landing Page",
      analyticsUseCase: null,
    });
  });
  it("Subject listing", () => {
    expect(getPageViewProps("/beta/teachers/key-stages/ks2/subjects")).toEqual({
      pageName: "Subject Listing",
      analyticsUseCase: null,
    });
  });
  it("About us: Board", () => {
    expect(getPageViewProps("/about-us/board")).toEqual({
      pageName: "About Us: Board",
      analyticsUseCase: null,
    });
  });
  it("About us: Who we are", () => {
    expect(getPageViewProps("/about-us/who-we-are")).toEqual({
      pageName: "About Us: Who We Are",
      analyticsUseCase: null,
    });
  });
  it("About us: Leadership", () => {
    expect(getPageViewProps("/about-us/leadership")).toEqual({
      pageName: "About Us: Leadership",
      analyticsUseCase: null,
    });
  });
  it("About us: Partners", () => {
    expect(getPageViewProps("/about-us/partners")).toEqual({
      pageName: "About Us: Partners",
      analyticsUseCase: null,
    });
  });
  it("About us: Work with us", () => {
    expect(getPageViewProps("/about-us/work-with-us")).toEqual({
      pageName: "About Us: Work With Us",
      analyticsUseCase: null,
    });
  });
  it("Careers", () => {
    expect(getPageViewProps("/careers")).toEqual(null);
  });
  it("Contact us", () => {
    expect(getPageViewProps("/contact-us")).toEqual({
      pageName: "Contact Us",
      analyticsUseCase: null,
    });
  });
  it("Develop your curriculum", () => {
    expect(getPageViewProps("/develop-your-curriculum")).toEqual({
      pageName: "Develop Your Curriculum",
      analyticsUseCase: null,
    });
  });
  it("Home", () => {
    expect(getPageViewProps("/")).toEqual({
      pageName: "Homepage",
      analyticsUseCase: null,
    });
  });
  it("Home (teachers)", () => {
    expect(getPageViewProps("/beta/teachers")).toEqual({
      pageName: "Homepage",
      analyticsUseCase: "teachers",
    });
  });
  it("Lesson planning", () => {
    expect(getPageViewProps("/lesson-planning")).toEqual({
      pageName: "Plan a Lesson",
      analyticsUseCase: null,
    });
  });
  it("Legal", () => {
    expect(getPageViewProps("/legal/know-your-rights")).toEqual({
      pageName: "Legal",
      analyticsUseCase: null,
    });
  });
  it("Support your team", () => {
    expect(getPageViewProps("/support-your-team")).toEqual({
      pageName: "Support Your Team",
      analyticsUseCase: null,
    });
  });
  /**
   * External pages will return null, as we cannot track page views for pages
   * outside of this app.
   */
  it("Our teachers", () => {
    expect(
      getPageViewProps("https://classroom.thenational.academy/teachers")
    ).toEqual(null);
  });
  it("Help", () => {
    expect(getPageViewProps("https://support.thenational.academy")).toEqual(
      null
    );
  });
  it("Our curriculum", () => {
    expect(
      getPageViewProps("https://teachers.thenational.academy/oaks-curricula")
    ).toEqual(null);
  });
  it("Classroom", () => {
    expect(getPageViewProps("https://classroom.thenational.academy/")).toEqual(
      null
    );
  });
  it("Teacher hub", () => {
    expect(getPageViewProps("https://teachers.thenational.academy")).toEqual(
      null
    );
  });
});
