import { getPageViewProps } from "./getPageViewProps";

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
    expect(getPageViewProps("/teachers/programmes/ks2-maths/units")).toEqual({
      pageName: "Unit Listing",
      analyticsUseCase: "Teacher",
    });
  });
  it("Unit listing with query", () => {
    expect(
      getPageViewProps(
        "/teachers/programmes/primary-ks2-maths/units?learning-theme=circls",
      ),
    ).toEqual({
      pageName: "Unit Listing",
      analyticsUseCase: "Teacher",
    });
  });
  it("Lesson listing", () => {
    expect(
      getPageViewProps(
        "/teachers/programmes/primary-ks2-maths/units/geometry-349/lessons",
      ),
    ).toEqual({
      pageName: "Lesson Listing",
      analyticsUseCase: "Teacher",
    });
  });
  it("Lesson overview", () => {
    expect(
      getPageViewProps(
        "/teachers/programmes/primary-ks2-maths/units/geometry-123/lessons/angles-123",
      ),
    ).toEqual({
      pageName: "Lesson",
      analyticsUseCase: "Teacher",
    });
  });
  it("Lesson downloads", () => {
    expect(
      getPageViewProps(
        "/teachers/programmes/primary-ks2-maths/units/geometry-123/lessons/angles-123/downloads",
      ),
    ).toEqual({
      pageName: "Lesson Download",
      analyticsUseCase: "Teacher",
    });
  });
  it("Search", () => {
    expect(getPageViewProps("/teachers/search")).toEqual({
      pageName: "Search",
      analyticsUseCase: "Teacher",
    });
  });
  it("Search with query", () => {
    expect(getPageViewProps("/teachers/search?term=macb")).toEqual({
      pageName: "Search",
      analyticsUseCase: "Teacher",
    });
  });
  it("Landing page", () => {
    expect(getPageViewProps("/lp/lp-slug-from-sanity-123")).toEqual({
      pageName: "Landing Page",
      analyticsUseCase: null,
    });
  });
  it("Subject listing", () => {
    expect(getPageViewProps("/teachers/key-stages/ks2/subjects")).toEqual({
      pageName: "Subject Listing",
      analyticsUseCase: "Teacher",
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
    expect(getPageViewProps("/careers")).toEqual({
      analyticsUseCase: null,
      pageName: null,
    });
  });
  it("Contact us", () => {
    expect(getPageViewProps("/contact-us")).toEqual({
      pageName: "Contact Us",
      analyticsUseCase: null,
    });
  });
  it("Home", () => {
    expect(getPageViewProps("/")).toEqual({
      pageName: "Homepage",
      analyticsUseCase: null,
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
      getPageViewProps("https://classroom.thenational.academy/teachers"),
    ).toEqual({
      analyticsUseCase: null,
      pageName: null,
    });
  });
  it("Help", () => {
    expect(getPageViewProps("https://support.thenational.academy")).toEqual({
      analyticsUseCase: null,
      pageName: null,
    });
  });
  it("Our curriculum", () => {
    expect(
      getPageViewProps("https://teachers.thenational.academy/oaks-curricula"),
    ).toEqual({
      analyticsUseCase: null,
      pageName: null,
    });
  });
  it("Classroom", () => {
    expect(getPageViewProps("https://classroom.thenational.academy/")).toEqual({
      analyticsUseCase: null,
      pageName: null,
    });
  });
  it("Teacher hub", () => {
    expect(getPageViewProps("https://teachers.thenational.academy")).toEqual({
      analyticsUseCase: null,
      pageName: null,
    });
  });
});
