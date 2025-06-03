import { basicFixtures } from "./CurricVisualiserUnitList.fixtures";

import { CurricVisualiserUnitList } from ".";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("CurricVisualiserUnitList", () => {
  it("should display a list of units", async () => {
    const { baseElement, findAllByRole } = renderWithTheme(
      <CurricVisualiserUnitList {...basicFixtures} />,
    );

    const allLinks = await findAllByRole("link");
    expect(allLinks.length).toEqual(4);
    expect(allLinks[0]?.textContent).toEqual(expect.stringContaining("One"));
    expect(allLinks[1]?.textContent).toEqual(expect.stringContaining("Two"));
    expect(allLinks[2]?.textContent).toEqual(expect.stringContaining("Three"));
    expect(allLinks[3]?.textContent).toEqual(expect.stringContaining("Four"));
    expect(baseElement).toMatchSnapshot();
  });
});
