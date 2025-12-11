import { usePathname } from "next/navigation";
import { render } from "@testing-library/react";

import useSelectedArea from "./useSelectedArea";

import { siteAreas } from "@/components/AppComponents/AppHeader/AppHeader";

const Nav = () => {
  const selectedArea = useSelectedArea();
  return <div data-testid="comp">{selectedArea}</div>;
};

jest.mock("next/navigation");

describe("useSelectedArea()", () => {
  test("default to teachers selection when on home path", async () => {
    (usePathname as jest.Mock).mockReturnValue("/");
    const { getByTestId } = render(<Nav />);
    expect(getByTestId("comp")).toHaveTextContent(siteAreas.teachers);
  });

  test("show pupils selection when pupils is in the pathname", async () => {
    (usePathname as jest.Mock).mockReturnValue("/pupils/url");
    const { getByTestId } = render(<Nav />);
    expect(getByTestId("comp")).toHaveTextContent(siteAreas.pupils);
  });
});
