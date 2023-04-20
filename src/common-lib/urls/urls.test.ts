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
    it.todo("Lesson listing");
    it.todo("Lesson overview");
    it.todo("Lesson downloads");
    it.todo("Search");
    it.todo("Landing page");
    it.todo("Subject listing");
    it.todo("About us: Board");
    it.todo("About us: Who we are");
    it.todo("About us: Leadership");
    it.todo("About us: Partners");
    it.todo("About us: Work with us");
    it.todo("Careers");
    it.todo("Contact us");
    it.todo("Develop your curriculum");
    it.todo("Help");
    it.todo("Home");
    it.todo("Lesson planning");
    it.todo("Legal");
    it.todo("Support your team");
    it.todo("Our curriculum");
    it.todo("Classroom");
    it.todo("Teacher hub");
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
      analyticsUseCase: "teachers",
    });
  });
  it("Unit listing with query", () => {
    expect(
      getPageViewProps(
        "/beta/teachers/key-stages/ks2/subjects/maths/units?learning-theme=circls"
      )
    ).toEqual({
      pageName: "Unit Listing",
      analyticsUseCase: "teachers",
    });
  });
  it("Lesson listing", () => {
    expect(
      getPageViewProps(
        "/beta/teachers/key-stages/ks2/subjects/maths/units/geometry-123"
      )
    ).toEqual({
      pageName: "Lesson Listing",
      analyticsUseCase: "teachers",
    });
  });
  it("Lesson overview", () => {
    expect(
      getPageViewProps(
        "/beta/teachers/key-stages/ks2/subjects/maths/units/geometry-123/lessons/angles-123"
      )
    ).toEqual({
      pageName: "Lesson",
      analyticsUseCase: "teachers",
    });
  });
  it("Lesson downloads", () => {
    expect(
      getPageViewProps(
        "/beta/teachers/key-stages/ks2/subjects/maths/units/geometry-123/lessons/angles-123/downloads"
      )
    ).toEqual({
      pageName: "Lesson Download",
      analyticsUseCase: "teachers",
    });
  });
  it("Search", () => {
    expect(getPageViewProps("/beta/teachers/search")).toEqual({
      pageName: "Search",
      analyticsUseCase: "teachers",
    });
  });
  it("Search with query", () => {
    expect(getPageViewProps("/beta/teachers/search?term=macb")).toEqual({
      pageName: "Search",
      analyticsUseCase: "teachers",
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
      analyticsUseCase: "teachers",
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
