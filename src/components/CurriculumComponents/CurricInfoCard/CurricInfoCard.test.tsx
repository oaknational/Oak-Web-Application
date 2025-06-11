import { screen } from "@testing-library/react";
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
    renderWithTheme(
      <CurricInfoCard {...props}>This is some information.</CurricInfoCard>,
    );
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  it("renders with default icon when not provided", () => {
    const { iconName, ...propsWithoutIcon } = props;
    renderWithTheme(
      <CurricInfoCard {...propsWithoutIcon}>
        This is some information.
      </CurricInfoCard>,
    );
    expect(screen.getByRole("img")).toBeInTheDocument();
  });
});
