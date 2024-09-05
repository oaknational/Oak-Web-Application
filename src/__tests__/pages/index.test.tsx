import { useRouter } from "next/router";

import Home from "@/pages/index";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { HomePageProps } from "@/pages-helpers/home/getBlogPosts";

const render = renderWithProviders();

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

const props: HomePageProps = {
  pageData: {
    heading: "",
    id: "",
    summaryPortableText: [],
    notification: { enabled: false },
    sidebarCard1: { title: "", bodyPortableText: [] },
    sidebarCard2: { title: "", bodyPortableText: [] },
  },
  posts: [],
};

describe("Homepage", () => {
  describe("Page component", () => {
    it("renders", () => {
      // Ensure useRouter is not mocked here or reset it to its original state
      (useRouter as jest.Mock).mockReturnValue({
        push: jest.fn(),
        route: "/",
        pathname: "/",
        query: "",
        asPath: "/",
      });
      render(<Home {...props} />);
    });

    it.each(["curriculum", "pupils", "teachers"])(
      "redirects to / when the path includes #",
      (path) => {
        const pushMock = jest.fn();
        (useRouter as jest.Mock).mockReturnValue({
          push: pushMock,
          route: "/",
          pathname: "/",
          query: "",
          asPath: "/",
        });

        // mock the href of window.location
        Object.defineProperty(window, "location", {
          value: {
            href: `/#${path}`,
          },
          writable: true,
        });

        render(<Home {...props} />);

        expect(pushMock).toHaveBeenCalledWith(`/${path}`);
      },
    );
  });
});
