import { GetInvolvedLinkCard } from ".";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("GetInvolvedLinkCard", () => {
  it("renders with single button", () => {
    const { container } = render(
      <GetInvolvedLinkCard
        headingTag={"h2"}
        headingTitle={"Give your feedback"}
        buttons={[{ text: "Get in touch", link: "#" }]}
        content="Share your story and we'll send you a gift voucher as a thanks for your time. Whether you've planned more efficiently, strengthened your subject knowledge or refreshed your curriculum design, your experience can inspire other teachers."
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it("renders with multiple buttons", () => {
    const { container } = render(
      <GetInvolvedLinkCard
        headingTag={"h3"}
        headingTitle={"Help us improve"}
        buttons={[
          {
            text: "Join the research panel",
            link: "https://example.com/research",
          },
          { text: "Explore our research", link: "https://example.com/explore" },
        ]}
        content="Teachers are at the heart of everything we build."
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it("renders external links with correct attributes", () => {
    const { getByText } = render(
      <GetInvolvedLinkCard
        headingTag={"h3"}
        headingTitle={"External Links"}
        buttons={[
          {
            text: "External Link",
            link: "https://example.com",
            external: true,
          },
          { text: "Internal Link", link: "/internal" },
        ]}
        content="Test content"
      />,
    );

    const externalLink = getByText("External Link").closest("a");
    const internalLink = getByText("Internal Link").closest("a");

    expect(externalLink).toHaveAttribute("target", "_blank");
    expect(externalLink).toHaveAttribute("rel", "noopener noreferrer");
    expect(internalLink).not.toHaveAttribute("target");
    expect(internalLink).not.toHaveAttribute("rel");
  });

  it("renders without buttons", () => {
    const { container } = render(
      <GetInvolvedLinkCard
        headingTag={"h3"}
        headingTitle={"No Buttons"}
        buttons={[]}
        content="Content without buttons"
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
