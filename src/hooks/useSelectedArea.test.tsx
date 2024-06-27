import { useRouter } from "next/router";
import { render } from "@testing-library/react";

import useSelectedArea from "./useSelectedArea";

import { siteAreas } from "@/components/AppComponents/AppHeader/AppHeader";

const Nav = () => {
  const selectedArea = useSelectedArea();
  return <div data-testid="comp">{selectedArea}</div>;
};
jest.mock("next/router");
describe("useClickableCard()", () => {
  test("default to teachers selection when on home path", async () => {
    (useRouter as jest.Mock).mockReturnValue({
      pathname: "/",
      asPath: "/",
    });
    const { getByTestId } = render(<Nav />);
    expect(getByTestId("comp")).toHaveTextContent(siteAreas.teachers);
  });
  test("show pupils selection when pupils is in the pathname", async () => {
    (useRouter as jest.Mock).mockReturnValue({
      pathname: "/pupils/url",
      asPath: "/pupils/url",
    });
    const { getByTestId } = render(<Nav />);
    expect(getByTestId("comp")).toHaveTextContent(siteAreas.pupils);
  });
  test("uses asPath value clientside to determine correct navigation", async () => {
    (useRouter as jest.Mock).mockReturnValue({
      pathname: "/404",
      asPath: "/pupils/url",
    });
    const { getByTestId } = render(<Nav />);
    expect(getByTestId("comp")).toHaveTextContent(siteAreas.pupils);
  });
});
