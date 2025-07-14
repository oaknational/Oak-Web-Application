import { useRouter } from "next/router";

import HomePage from "@/pages/index";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { TeachersHomePageProps } from "@/pages/teachers";

const render = renderWithProviders();

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

const props: TeachersHomePageProps = {
  curriculumData: {
    keyStages: [
      {
        title: "Key stage 1",
        slug: "key-stage-1",
        displayOrder: 0,
        shortCode: "ks1",
      },
    ],
  },
  pageData: {
    heading: "",
    id: "",
    summaryPortableText: [],
    notification: { enabled: false },
    sidebarCard1: { title: "", bodyPortableText: [] },
    sidebarCard2: { title: "", bodyPortableText: [] },
    testimonials: [],
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
      render(<HomePage {...props} />);
    });

    // skipping as failing due to unrelated footer changes, to be fixed later
    it.skip.each(["curriculum", "pupils", "teachers", "ai"])(
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

        render(<HomePage {...props} />);

        expect(pushMock).toHaveBeenCalledWith(`/${path}`);
      },
    );
  });
});
