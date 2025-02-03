import mockRouter from "next-router-mock";

import LayoutPreviewControls from "./LayoutPreviewControls";

import { ToastProvider } from "@/context/Toast";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("LayoutPreviewControls", () => {
  beforeEach(() => {
    mockRouter.setCurrentUrl("/");
  });

  it("renders a link to exit preview mode including the current URL", () => {
    mockRouter.push({
      pathname: "/blog/some-blog-post",
      query: {},
    });

    const { getByRole } = renderWithTheme(
      <ToastProvider>
        <LayoutPreviewControls />
      </ToastProvider>,
    );

    const link = getByRole("link");
    expect(link).toHaveAccessibleName("Exit preview");
    expect(link).toHaveAttribute(
      "href",
      "/api/exit-preview/blog/some-blog-post",
    );
  });
});
