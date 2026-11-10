import { usePathname } from "next/navigation";
import { render } from "@testing-library/react";

import useSelectedArea, { siteAreas } from "./useSelectedArea";

const Nav = () => {
  const selectedArea = useSelectedArea();
  return <div data-testid="comp">{selectedArea}</div>;
};

jest.mock("next/navigation");

describe("useSelectedArea()", () => {
  test.each([
    null,
    "/",
    "/teachers",
    "/teachers/lessons/pupils-example",
    "/teachers/programmes/english-primary/units/example/lessons/pupils-example",
    "/teachers/programmes/english-primary/units/pupils-example/lessons/example",
    "/blog/pupils-learning",
    "/pupils-example",
    "/pupilsomething",
    "/teachers/programmes/pupils-lesson",
  ])("selects teachers for pathname %s", (pathname) => {
    jest.mocked(usePathname).mockReturnValue(pathname);
    const { getByTestId } = render(<Nav />);
    expect(getByTestId("comp")).toHaveTextContent(siteAreas.teachers);
  });

  test.each([
    "/pupils",
    "/pupils/",
    "/pupils/years",
    "/pupils/lessons/example",
    "/pupils/programmes/english-primary/units/example/lessons/example/overview",
  ])("selects pupils for pathname %s", (pathname) => {
    jest.mocked(usePathname).mockReturnValue(pathname);
    const { getByTestId } = render(<Nav />);
    expect(getByTestId("comp")).toHaveTextContent(siteAreas.pupils);
  });

  test.each([
    ["/pupils/years", "/teachers/lessons/example", siteAreas.teachers],
    ["/teachers/lessons/example", "/pupils/years", siteAreas.pupils],
    [null, "/pupils/years", siteAreas.pupils],
    ["/pupils/years", null, siteAreas.teachers],
  ])("updates selection when navigating from %s to %s", (from, to, area) => {
    jest.mocked(usePathname).mockReturnValue(from);
    const { getByTestId, rerender } = render(<Nav />);

    jest.mocked(usePathname).mockReturnValue(to);
    rerender(<Nav />);

    expect(getByTestId("comp")).toHaveTextContent(area);
  });
});
