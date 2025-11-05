import CurricUnitCard from "./CurricUnitCard";
import { unitWithOptions } from "./CurricUnitCard.fixtures";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("CurricUnitCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("render", () => {
    const { baseElement } = render(
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
    const { baseElement } = render(
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
    const { baseElement } = render(
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
    const { baseElement } = render(
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
