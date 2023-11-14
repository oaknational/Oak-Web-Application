import { screen } from "@testing-library/react";

import renderWithTheme from "../../../__tests__/__helpers__/renderWithTheme";

import CopyrightNotice from "./CopyrightNotice";

describe("CopyrightNotice", () => {
  it("renders pre-ALB copyright notice", () => {
    renderWithTheme(
      <CopyrightNotice
        showPostAlbCopyright={false}
        openLinksExternally={false}
      />,
    );

    const preAlbCopyright = screen.getByText(
      "This content is made available by Oak and its partners",
      { exact: false },
    );
    expect(preAlbCopyright).toBeInTheDocument();
  });
  it("renders post-ALB copyright notice", () => {
    renderWithTheme(
      <CopyrightNotice
        showPostAlbCopyright={true}
        openLinksExternally={false}
      />,
    );

    const preAlbCopyright = screen.getByText(
      "This content is © Oak National Academy (2023), licensed on",
      { exact: false },
    );
    expect(preAlbCopyright).toBeInTheDocument();
  });
  it("opens links in a new tab when openLinksExternally is true", async () => {
    renderWithTheme(
      <CopyrightNotice
        showPostAlbCopyright={true}
        openLinksExternally={true}
      />,
    );

    const links = screen.getAllByRole("link");
    const firstLink = links[0];
    if (!firstLink) {
      throw new Error("Failed to find any links in CopyrightNotice component");
    }
    expect(firstLink).toHaveAttribute("target", "_blank");
  });
  it("opens links in the same tab when openLinksExternally is false", async () => {
    renderWithTheme(
      <CopyrightNotice
        showPostAlbCopyright={true}
        openLinksExternally={false}
      />,
    );

    const links = screen.getAllByRole("link");
    const firstLink = links[0];
    if (!firstLink) {
      throw new Error("Failed to find any links in CopyrightNotice component");
    }
    expect(firstLink).not.toHaveAttribute("target", "_blank");
  });
  it("links that will open in a new tab should be tagged with an icon", () => {
    renderWithTheme(
      <CopyrightNotice
        showPostAlbCopyright={true}
        openLinksExternally={true}
      />,
    );
    const links = screen.getAllByRole("link");
    const externalLinkIcons = screen.getAllByTestId("external-link-icon");
    expect(links).toHaveLength(externalLinkIcons.length);
  });
  it("links that do not open in a new tab should not be tagged with an icon", () => {
    renderWithTheme(
      <CopyrightNotice
        showPostAlbCopyright={true}
        openLinksExternally={false}
      />,
    );
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
    const externalLinkIcons = screen.queryAllByTestId("external-link-icon");
    expect(externalLinkIcons).toHaveLength(0);
  });
});
