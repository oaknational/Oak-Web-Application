import CurricUnitCard from "./CurricUnitCard";
import { unitWithOptions } from "./CurricUnitCard.fixtures";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("CurricUnitCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("render", () => {
    const { baseElement } = renderWithTheme(
      <CurricUnitCard
        unit={unitWithOptions}
        index={0}
        isHighlighted={false}
        href="/"
      />,
    );

    expect(baseElement).toMatchSnapshot();
  });

  test("highlighted state", () => {
    const { baseElement } = renderWithTheme(
      <CurricUnitCard
        unit={unitWithOptions}
        index={0}
        isHighlighted={true}
        href="/"
      />,
    );

    expect(baseElement).toMatchSnapshot();
  });

  test("index is correct", () => {
    const { baseElement } = renderWithTheme(
      <CurricUnitCard
        unit={unitWithOptions}
        index={0}
        isHighlighted={false}
        href="/"
      />,
    );

    expect(baseElement).toMatchSnapshot();
  });

  test("changes color when highlighed", () => {
    const { baseElement } = renderWithTheme(
      <CurricUnitCard
        unit={unitWithOptions}
        index={0}
        isHighlighted={false}
        href="/"
      />,
    );

    expect(baseElement).toMatchSnapshot();
  });
});
