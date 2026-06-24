import { screen } from "@testing-library/dom";
import { usePathname } from "next/navigation";

import OnboardingLayout from "./layout";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { mockLoggedIn } from "@/__tests__/__helpers__/mockUser";
import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";

jest.mock("posthog-js/react", () => ({
  useFeatureFlagVariantKey: () => "with-login",
  useFeatureFlagEnabled: () => false,
}));

jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  usePathname: jest.fn(() => "/onboarding"),
}));

const setPathname = (pathname: string) => {
  (usePathname as jest.Mock).mockReturnValue(pathname);
};

describe("Onboarding layout", () => {
  beforeEach(() => {
    setUseUserReturn(mockLoggedIn);
  });

  it("renders the child content when signed in", () => {
    setPathname("/onboarding");
    renderWithProviders()(
      <OnboardingLayout>
        <div>child content</div>
      </OnboardingLayout>,
    );

    expect(screen.getByText("child content")).toBeInTheDocument();
  });

  it("renders the contact us link", async () => {
    setPathname("/onboarding");
    renderWithProviders()(
      <OnboardingLayout>
        <div>child content</div>
      </OnboardingLayout>,
    );

    const contactUs = await screen.findByText("Contact us", { exact: false });
    expect(contactUs).toBeInTheDocument();
    expect(contactUs.closest("a")).toHaveAttribute("href", "/contact-us");
  });

  it.each([
    ["/onboarding", "Nearly done", "complete your account setup"],
    [
      "/onboarding/school-selection",
      "Nearly done",
      "complete your account setup",
    ],
    ["/onboarding/role-selection", "Last step", "complete your account setup"],
    [
      "/onboarding/how-can-oak-support-you",
      "Last step",
      "tailor Oak to suit your needs",
    ],
  ])("renders the correct prompt for %s", (pathname, heading, body) => {
    setPathname(pathname);
    renderWithProviders()(
      <OnboardingLayout>
        <div>child content</div>
      </OnboardingLayout>,
    );

    expect(screen.getByText(new RegExp(heading, "i"))).toBeInTheDocument();
    expect(screen.getByText(new RegExp(body, "i"))).toBeInTheDocument();
  });
});
