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
        onButtonClick={onClick}
        hasNewUnits={true}
      />,
    );
    expect(
      getByText("These resources will be removed by end of Summer Term 2025."),
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
        hasNewUnits={false}
      />,
    );
    expect(getByText("New units on the way!")).toBeInTheDocument();
    expect(
      getByText(
        "These units were created for remote use during the pandemic and will be removed by the end of the summer term 2025.",
      ),
    ).toBeInTheDocument();
  });

  test("renders pupil removal banner when there are new units", () => {
    const { getByText } = render(
      <UnitListLegacyBanner
        allLegacyUnits={getLegacyUnits(true)}
        userType="pupil"
        hasNewUnits={true}
      />,
    );
    expect(
      getByText("These resources will be removed by end of Summer Term 2025."),
    ).toBeInTheDocument();
    expect(
      getByText("We’ve made brand-new and improved resources for you."),
    ).toBeInTheDocument();
  });

  test("renders pupil removal banner when there are no new units", () => {
    const { getByText } = render(
      <UnitListLegacyBanner
        allLegacyUnits={getLegacyUnits(true)}
        userType="pupil"
        hasNewUnits={false}
      />,
    );
    expect(getByText("New units on the way!")).toBeInTheDocument();
    expect(
      getByText("We’re busy creating new lessons for you."),
    ).toBeInTheDocument();
  });
});
