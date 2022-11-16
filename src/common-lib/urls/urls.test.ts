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
      }
    );
  });

  describe("resolveOakHrefProps()", () => {
    it("returns the correct path for a blog", () => {
      const props: ResolveOakHrefProps = { page: "blog", slug: "a-blog" };
      expect(resolveOakHref(props)).toBe("/blog/a-blog");
    });
    it("returns the correct path for a webinars", () => {
      const props: ResolveOakHrefProps = {
        page: "webinars",
        slug: "a-webinar",
      };
      expect(resolveOakHref(props)).toBe("/webinars/a-webinar");
    });
    it("returns the correct path for a blog-index page", () => {
      const props: ResolveOakHrefProps = {
        page: "blog-index",
      };
      expect(resolveOakHref(props)).toBe("/blog");
    });
    it("returns the correct path for a blog-index page ", () => {
      const props: ResolveOakHrefProps = {
        page: "webinars-index",
      };
      expect(resolveOakHref(props)).toBe("/webinars");
    });
    it("returns the correct path for a blog-index page with a category", () => {
      const props: ResolveOakHrefProps = {
        page: "blog-index",
        category: "lessons",
      };
      expect(resolveOakHref(props)).toBe("/blog/categories/lessons");
    });
    it("returns the correct path for a blog-index page with a category", () => {
      const props: ResolveOakHrefProps = {
        page: "webinars-index",
        category: "lessons",
      };
      expect(resolveOakHref(props)).toBe("/webinars/categories/lessons");
    });
    it("returns the correct path for a blog-index page with search object", () => {
      const props: ResolveOakHrefProps = {
        page: "webinars-index",
        search: {
          page: "blog",
        },
      };
      expect(resolveOakHref(props)).toBe("/webinars?page=blog");
    });
  });
});
