import { OakGridArea } from "@oaknational/oak-components";
import type { ComponentProps } from "react";

import {
  imageTextSplitSectionBlockFixture,
  imageTextSplitSectionWithBulletListFixture,
  imageTextSplitSectionWithNumberedListFixture,
  imageTextSplitSectionWithLinkFixture,
} from "./ImageTextSplitSection.fixtures";

import ImageTextSplitSection from ".";

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

describe("ImageTextSplitSection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("it renders correct data", () => {
    const fixture = imageTextSplitSectionBlockFixture(
      "Who can join the panel?",
      "Join the research panel body copy goes here",
    );

    const { baseElement, getByRole } = render(
      <ImageTextSplitSection {...fixture} />,
    );

    expect(baseElement).toMatchSnapshot();
    expect(getByRole("heading", { level: 2 })).toHaveTextContent(fixture.title);
  });

  test("renders bullet points correctly", () => {
    const { baseElement } = render(
      <ImageTextSplitSection
        {...imageTextSplitSectionWithBulletListFixture()}
      />,
    );

    expect(baseElement).toMatchSnapshot();
  });

  test("renders numbered points correctly", () => {
    const { baseElement } = render(
      <ImageTextSplitSection
        {...imageTextSplitSectionWithNumberedListFixture()}
      />,
    );

    expect(baseElement).toMatchSnapshot();
  });

  test("renders links with icon correctly", () => {
    const { baseElement } = render(
      <ImageTextSplitSection {...imageTextSplitSectionWithLinkFixture()} />,
    );

    expect(baseElement).toMatchSnapshot();
  });

  test("it renders the grid position correctly when imagePosition is passed as 'left'", () => {
    const fixture = imageTextSplitSectionBlockFixture(
      "Who can join the panel?",
      "Join the research panel body copy goes here",
      "left",
    );

    render(<ImageTextSplitSection {...fixture} />);

    const [imageCall, textCall] = jest.mocked(OakGridArea).mock.calls;

    expect(imageCall?.[0].$colStart).toEqual([1, 2, 1]);
    expect(textCall?.[0].$colStart).toEqual([1, 2, 8]);
  });

  test("it renders the grid position correctly when imagePosition is passed as 'right'", () => {
    const fixture = imageTextSplitSectionBlockFixture(
      "Who can join the panel?",
      "Join the research panel body copy goes here",
      "right",
    );

    render(<ImageTextSplitSection {...fixture} />);

    const [imageCall, textCall] = jest.mocked(OakGridArea).mock.calls;

    expect(imageCall?.[0].$colStart).toEqual([1, 2, 7]);
    expect(textCall?.[0].$colStart).toEqual([1, 2, 1]);
  });

  test("it renders the grid position correctly when imagePosition is not passed", () => {
    const fixture = imageTextSplitSectionBlockFixture(
      "Who can join the panel?",
      "Join the research panel body copy goes here",
    );

    render(<ImageTextSplitSection {...fixture} />);

    const [imageCall, textCall] = jest.mocked(OakGridArea).mock.calls;

    expect(imageCall?.[0].$colStart).toEqual([1, 2, 1]);
    expect(textCall?.[0].$colStart).toEqual([1, 2, 8]);
  });
});
