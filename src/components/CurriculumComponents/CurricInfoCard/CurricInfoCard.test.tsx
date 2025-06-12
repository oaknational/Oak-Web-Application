import { screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";

import renderWithTheme from "../../../__tests__/__helpers__/renderWithTheme";

import CurricInfoCard, { CurricInfoCardProps } from "./CurricInfoCard";

const props: Omit<CurricInfoCardProps, "children"> = {
  iconName: "search",
  background: "mint30",
  iconHeight: "all-spacing-12",
  iconWidth: "all-spacing-11",
};

describe("CurricInfoCard", () => {
  it("renders the text", () => {
    renderWithTheme(
      <CurricInfoCard {...props}>This is some information.</CurricInfoCard>,
    );
    expect(screen.getByText("This is some information.")).toBeInTheDocument();
  });

  it("renders the icon", () => {
    const { container } = renderWithTheme(
      <CurricInfoCard {...props}>This is some information.</CurricInfoCard>,
    );
    expect(container.querySelector("img")).toBeInTheDocument();
  });

  it("renders the correct icon", () => {
    renderWithTheme(
      <CurricInfoCard
        iconName="clipboard"
        background="mint30"
        iconHeight={"all-spacing-14"}
        iconWidth={"all-spacing-9"}
      >
        National curriculum and exam board aligned
      </CurricInfoCard>,
    );

    const iconContainer = screen.getByTestId("icon-clipboard");
    const iconImage = within(iconContainer).getByRole("presentation");

    expect(iconImage).toBeInTheDocument();
    expect(iconImage.getAttribute("src")).toBeTruthy();
  });
});
