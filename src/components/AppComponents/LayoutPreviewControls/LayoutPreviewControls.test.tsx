import { usePathname } from "next/navigation";

import LayoutPreviewControls from "./LayoutPreviewControls";

import { ToastProvider } from "@/context/Toast";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

(usePathname as jest.Mock).mockReturnValue("/blog/some-blog-post");

describe("LayoutPreviewControls", () => {
  it("renders a link to exit preview mode including the current URL", () => {
    const { getByRole } = renderWithTheme(
      <ToastProvider>
        <LayoutPreviewControls />
      </ToastProvider>,
    );

    const link = getByRole("link");
    expect(link).toHaveAccessibleName("Exit preview");
    expect(link).toHaveAttribute(
      "href",
      "/api/preview/blog/some-blog-post?disable=true",
    );
  });
});
