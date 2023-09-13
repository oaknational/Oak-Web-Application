import { screen } from "@testing-library/react";

import renderWithTheme from "../../../__tests__/__helpers__/renderWithTheme";

import CopyrightNotice from "./CopyrightNotice";

describe("CopyrightNotice", () => {
  it("renders pre-ALB copyright notice", () => {
    renderWithTheme(<CopyrightNotice showPostAlbCopyright={false} />);

    const preAlbCopyright = screen.getByText(
      "This content is made available by Oak and its partners",
      { exact: false },
    );
    expect(preAlbCopyright).toBeInTheDocument();
  });
  it("renders post-ALB copyright notice", () => {
    renderWithTheme(<CopyrightNotice showPostAlbCopyright={true} />);

    const preAlbCopyright = screen.getByText(
      "This content is © Oak National Academy (2023), licensed on",
      { exact: false },
    );
    expect(preAlbCopyright).toBeInTheDocument();
  });
});
