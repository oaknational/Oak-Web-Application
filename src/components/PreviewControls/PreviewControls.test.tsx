import { ToastProvider } from "../../context/Toast";
import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import PreviewControls from "./PreviewControls";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const useRouter = jest.spyOn(require("next/router"), "useRouter");

describe("PreviewControls", () => {
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
        <PreviewControls />
      </ToastProvider>
    );

    const link = getByRole("link");
    expect(link).toHaveAccessibleName("Exit preview");
    expect(link).toHaveAttribute(
      "href",
      "/api/exit-preview/blog/some-blog-post"
    );
  });
});
