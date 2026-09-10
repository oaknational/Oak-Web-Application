import { screen } from "@testing-library/react";

import OglCopyrightNotice from "./OglCopyrightNotice";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("CopyrightNotice", () => {
  it("renders pre-ALB copyright notice", () => {
    renderWithTheme(
      <OglCopyrightNotice
        showPostAlbCopyright={false}
        openLinksExternally={false}
        copyrightYear="2022-01-01T00:00:00Z"
      />,
    );

    const preAlbCopyright = screen.getByText(
      "This content is made available by Oak National Academy Limited and its partners",
      { exact: false },
    );
    expect(preAlbCopyright).toBeInTheDocument();
  });
  it("renders post-ALB copyright notice", () => {
    renderWithTheme(
      <OglCopyrightNotice
        showPostAlbCopyright={true}
        openLinksExternally={false}
        copyrightYear="2024-01-01T00:00:00Z"
      />,
    );

    const preAlbCopyright = screen.getByText(
      `This content is © Oak National Academy Limited (2024), licensed on`,
      { exact: false },
    );
    expect(preAlbCopyright).toBeInTheDocument();
  });
});
