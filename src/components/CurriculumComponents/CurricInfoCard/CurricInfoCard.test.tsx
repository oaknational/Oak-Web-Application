import { screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import renderWithTheme from "../../../__tests__/__helpers__/renderWithTheme";

import CurricInfoCard, { CurricInfoCardProps } from "./CurricInfoCard";

const props: CurricInfoCardProps = {
  text: "This is some information.",
  iconName: "search",
  background: "mint30",
  iconHeight: "all-spacing-12",
  iconWidth: "all-spacing-11",
};

describe("CurricInfoCard", () => {
  it("renders the text", () => {
    renderWithTheme(<CurricInfoCard {...props} />);
    expect(screen.getByText("This is some information.")).toBeInTheDocument();
  });

  it("renders the icon", () => {
    renderWithTheme(<CurricInfoCard {...props} />);
    expect(screen.getByAltText("search")).toBeInTheDocument();
  });

  it("renders with default icon when not provided", () => {
    const { iconName, ...propsWithoutIcon } = props;
    renderWithTheme(<CurricInfoCard {...propsWithoutIcon} />);
    expect(screen.getByAltText("books")).toBeInTheDocument();
  });
});
