import LayoutPreviewControls from "./LayoutPreviewControls";

import { ToastProvider } from "@/context/Toast";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const useRouter = jest.spyOn(require("next/router"), "useRouter");

describe("LayoutPreviewControls", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it("renders a link to exit preview mode including the current URL", () => {
    useRouter.mockReturnValue({
      asPath: "/blog/some-blog-post",
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
