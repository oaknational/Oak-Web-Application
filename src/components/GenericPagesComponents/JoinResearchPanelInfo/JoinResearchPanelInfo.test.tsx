import { OakGridArea } from "@oaknational/oak-components";
import type { ComponentProps } from "react";

import { joinResearchPanelInfoBlockFixture } from "./JoinResearchPanelInfo.fixtures";

import JoinResearchPanelInfo from ".";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

jest.mock("@oaknational/oak-components", () => {
  const oakComponents = jest.requireActual("@oaknational/oak-components");

  return {
    ...oakComponents,
    OakGridArea: jest.fn((props: ComponentProps<typeof OakGridArea>) => (
      <oakComponents.OakGridArea {...props} />
    )),
  };
});

describe("JoinResearchPanelInfo", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("it renders correct data", () => {
    const fixture = joinResearchPanelInfoBlockFixture(
      "Who can join the panel?",
      "Join the research panel body copy goes here",
    );

    const { baseElement, getByRole } = render(
      <JoinResearchPanelInfo {...fixture} />,
    );

    expect(baseElement).toMatchSnapshot();
    expect(getByRole("heading", { level: 2 })).toHaveTextContent(fixture.title);
  });

  test("it renders the grid position correctly when imagePosition is passed as 'left'", () => {
    const fixture = joinResearchPanelInfoBlockFixture(
      "Who can join the panel?",
      "Join the research panel body copy goes here",
      "left",
    );

    render(<JoinResearchPanelInfo {...fixture} />);

    const [imageCall, textCall] = jest.mocked(OakGridArea).mock.calls;

    expect(imageCall?.[0].$colStart).toEqual([1, 2, 1]);
    expect(textCall?.[0].$colStart).toEqual([1, 2, 8]);
  });

  test("it renders the grid position correctly when imagePosition is passed as 'right'", () => {
    const fixture = joinResearchPanelInfoBlockFixture(
      "Who can join the panel?",
      "Join the research panel body copy goes here",
      "right",
    );

    render(<JoinResearchPanelInfo {...fixture} />);

    const [imageCall, textCall] = jest.mocked(OakGridArea).mock.calls;

    expect(imageCall?.[0].$colStart).toEqual([1, 2, 7]);
    expect(textCall?.[0].$colStart).toEqual([1, 2, 1]);
  });

  test("it renders the grid position correctly when imagePosition is not passed", () => {
    const fixture = joinResearchPanelInfoBlockFixture(
      "Who can join the panel?",
      "Join the research panel body copy goes here",
    );

    render(<JoinResearchPanelInfo {...fixture} />);

    const [imageCall, textCall] = jest.mocked(OakGridArea).mock.calls;

    expect(imageCall?.[0].$colStart).toEqual([1, 2, 1]);
    expect(textCall?.[0].$colStart).toEqual([1, 2, 8]);
  });
});
