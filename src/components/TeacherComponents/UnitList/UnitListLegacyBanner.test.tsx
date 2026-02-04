import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { screen } from "@testing-library/react";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import unitListingFixture from "@/node-lib/curriculum-api-2023/fixtures/unitListing.fixture";
import {
  UnitListLegacyBanner,
  UnitListLegacyBannerProps,
} from "@/components/TeacherComponents/UnitList/UnitListLegacyBanner";

const onClick = jest.fn();

const render = (children: React.ReactNode) =>
  renderWithProviders()(
    <OakThemeProvider theme={oakDefaultTheme}>{children}</OakThemeProvider>,
  );

const unitListing = unitListingFixture();

const allLegacyUnits: UnitListLegacyBannerProps["allLegacyUnits"] =
  unitListing.units;

const getLegacyUnits = (
  addExpiringBannerAction: boolean,
): UnitListLegacyBannerProps["allLegacyUnits"] => {
  if (!addExpiringBannerAction) return allLegacyUnits;
  const exampleUnit = allLegacyUnits?.[0]?.[0];
  let groupToPrepend: UnitListLegacyBannerProps["allLegacyUnits"][number] = [];
  if (exampleUnit) {
    const bannerUnit = {
      ...exampleUnit,
      actions: { displayExpiringBanner: true },
    };
    groupToPrepend = [bannerUnit];
  }
  return [
    groupToPrepend,
    ...allLegacyUnits,
  ] as UnitListLegacyBannerProps["allLegacyUnits"];
};

describe("components/UnitListLegacyBanner", () => {
  test("does not render when no units are marked for expiry", () => {
    render(
      <UnitListLegacyBanner
        allLegacyUnits={getLegacyUnits(false)}
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

  test("renders teacher removal banner when there are new units", () => {
    const { getByText } = render(
      <UnitListLegacyBanner
        allLegacyUnits={getLegacyUnits(true)}
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

  test("renders newsletter sign up banner when there are no new units", () => {
    const { getByText } = render(
      <UnitListLegacyBanner
        allLegacyUnits={getLegacyUnits(true)}
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

  test("renders pupil removal banner when there are new units", () => {
    const { getByText } = render(
      <UnitListLegacyBanner
        allLegacyUnits={getLegacyUnits(true)}
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
        "Scroll up to take a look at the brand-new and improved resources we've made for you.",
      ),
    ).toBeInTheDocument();
  });

  test("renders pupil removal banner when there are no new units", () => {
    const { getByText } = render(
      <UnitListLegacyBanner
        allLegacyUnits={getLegacyUnits(true)}
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
});
