import { screen } from "@testing-library/react";

import { TakedownBanner } from "./TakedownBanner";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const onClick = jest.fn();

jest.mock("../../../node-lib/cms");
globalThis.matchMedia = jest.fn().mockReturnValue({
  matches: true,
});

const render = renderWithProviders();

describe("TakedownBanner", () => {
  test("does not render when no units are marked for expiry and is a cycle 1 subject", () => {
    render(
      <TakedownBanner
        isExpiring={false}
        isLegacy={true}
        userType="teacher"
        subjectSlug="maths"
        onButtonClick={onClick}
        hasNewUnits={false}
      />,
    );
    expect(
      screen.queryByText(
        "These resources will be removed by end of Summer Term 2025.",
      ),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("New units on the way!")).not.toBeInTheDocument();
  });

  test("renders teacher removal banner when there are new units in a cycle 1 subject", () => {
    const { getByText } = render(
      <TakedownBanner
        isExpiring={true}
        isLegacy={true}
        userType="teacher"
        subjectSlug="maths"
        onButtonClick={onClick}
        hasNewUnits={true}
      />,
    );
    expect(
      getByText(
        "These resources were made for remote use during the pandemic, not classroom teaching.",
      ),
    ).toBeInTheDocument();
    expect(
      getByText(
        "Switch to our new teaching resources now - designed by teachers and leading subject experts, and tested in classrooms.",
      ),
    ).toBeInTheDocument();
  });
  test("renders legacy takedown banner for cycle 2 subjects", () => {
    const { getByText } = render(
      <TakedownBanner
        isExpiring={false}
        isLegacy={true}
        userType="teacher"
        subjectSlug="geography"
        onButtonClick={onClick}
        hasNewUnits={true}
      />,
    );

    const bannerHeader = getByText(
      "These resources will be removed by the end of the Spring Term 2026.",
    );
    expect(bannerHeader).toBeInTheDocument();

    const bannerBody = getByText(
      "Start using our brand new teaching resources now. Designed by teachers and subject experts, with real classrooms in mind.",
    );
    expect(bannerBody).toBeInTheDocument();
  });

  test("renders newsletter sign up banner when there are no new units", () => {
    const { getByText } = render(
      <TakedownBanner
        isExpiring={true}
        isLegacy={true}
        userType="teacher"
        subjectSlug="maths"
        hasNewUnits={false}
      />,
    );
    expect(getByText("New units on the way!")).toBeInTheDocument();
    expect(
      getByText(
        "These resources were made for remote use during the pandemic, not classroom teaching.",
      ),
    ).toBeInTheDocument();
  });

  test("renders pupil removal banner when there are new units in a cycle 1 subject", () => {
    const { getByText } = render(
      <TakedownBanner
        isExpiring={true}
        isLegacy={true}
        userType="pupil"
        subjectSlug="maths"
        hasNewUnits={true}
      />,
    );
    expect(
      getByText(
        "These lessons were made for home learning during the pandemic.",
      ),
    ).toBeInTheDocument();
    expect(
      getByText(
        "Take a look at the brand-new and improved lessons we've made for you.",
      ),
    ).toBeInTheDocument();
  });

  test("renders pupil removal banner when there are no new units in a cycle 1 subject", () => {
    const { getByText } = render(
      <TakedownBanner
        isExpiring={true}
        isLegacy={true}
        userType="pupil"
        subjectSlug="maths"
        hasNewUnits={false}
      />,
    );
    expect(getByText("New units on the way!")).toBeInTheDocument();
    expect(
      getByText("We're busy creating new lessons for you."),
    ).toBeInTheDocument();
  });

  test("renders legacy take down banner for pupils in cycle 2 legacy subjects", () => {
    const { getByText } = render(
      <TakedownBanner
        isExpiring={false}
        isLegacy={true}
        userType="pupil"
        subjectSlug="geography"
        hasNewUnits={true}
      />,
    );

    const bannerHeader = getByText(
      "These lessons will be removed by the end of the Spring Term 2026.",
    );
    expect(bannerHeader).toBeInTheDocument();

    const bannerBody = getByText(
      "We’ve made brand new and improved lessons for you.",
    );
    expect(bannerBody).toBeInTheDocument();
  });
});
