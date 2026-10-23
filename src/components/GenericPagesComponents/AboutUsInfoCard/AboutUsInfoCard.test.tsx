import { screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";

import AboutUsInfoCard, { AboutUsInfoCardProps } from "./AboutUsInfoCard";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const props = {
  iconName: "search",
  background: "bg-decorative1-very-subdued",
  iconHeight: "spacing-72",
  iconWidth: "spacing-64",
} satisfies Omit<AboutUsInfoCardProps, "children">;

const render = renderWithProvidersByName(["oakTheme"]);

describe("AboutUsInfoCard", () => {
  it("renders the text", () => {
    render(
      <AboutUsInfoCard {...props}>This is some information.</AboutUsInfoCard>,
    );
    expect(screen.getByText("This is some information.")).toBeInTheDocument();
  });

  it("renders the icon", () => {
    const { container } = render(
      <AboutUsInfoCard {...props}>This is some information.</AboutUsInfoCard>,
    );
    expect(container.querySelector("img")).toBeInTheDocument();
  });

  it("renders the correct icon", () => {
    render(
      <AboutUsInfoCard
        iconName="clipboard"
        background="bg-decorative1-very-subdued"
        iconHeight={"spacing-92"}
        iconWidth={"spacing-48"}
      >
        National curriculum and exam board aligned
      </AboutUsInfoCard>,
    );

    const iconContainer = screen.getByTestId("icon-clipboard");
    const iconImage = within(iconContainer).getByRole("presentation");

    expect(iconImage).toBeInTheDocument();
    expect(iconImage.getAttribute("src")).toBeTruthy();
  });

  it("renders the correct icon when an asset is provided", () => {
    const icon = {
      altText: "Icon alt text",
      asset: {
        _id: "icon-123",
        url: "https://example.com/icon.svg",
      },
    };
    render(
      <AboutUsInfoCard
        icon={icon}
        background="bg-decorative1-very-subdued"
        iconHeight={"spacing-92"}
        iconWidth={"spacing-48"}
      >
        National curriculum and exam board aligned
      </AboutUsInfoCard>,
    );

    const image = screen.getByAltText("Icon alt text");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", icon.asset.url);
  });
});
