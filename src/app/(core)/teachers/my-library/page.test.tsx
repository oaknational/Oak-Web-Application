/**
 * @jest-environment jsdom
 */
import { screen } from "@testing-library/dom";
import { redirect } from "next/navigation";

import MyLibraryPage, { metadata } from "./page";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

jest.mock("posthog-js/react", () => ({
  useFeatureFlagVariantKey: () => true,
  useFeatureFlagEnabled: () => true,
}));
// jest.setup.js mocks next/navigation without `redirect`, so re-declare it here
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
  redirect: jest.fn(),
}));

const redirectToSignUp = jest.fn();
const mockAuth = jest.fn();
const mockCurrentUser = jest.fn();
jest.mock("@clerk/nextjs/server", () => ({
  auth: () => mockAuth(),
  currentUser: () => mockCurrentUser(),
}));

jest.mock("@/node-lib/educator-api/helpers/saveUnits/useMyLibrary", () => ({
  useMyLibrary: jest.fn(() => ({
    collectionData: [],
    isLoading: false,
  })),
}));

const render = renderWithProviders();

describe("app/(core)/teachers/my-library", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuth.mockResolvedValue({ userId: "user-123", redirectToSignUp });
    mockCurrentUser.mockResolvedValue({
      publicMetadata: { owa: { isOnboarded: true } },
    });
  });

  it("should render a header", async () => {
    render(await MyLibraryPage());
    const header = await screen.findByRole("heading", {
      name: "My library",
    });
    expect(header).toBeInTheDocument();
  });

  it("should render a no saved content heading", async () => {
    render(await MyLibraryPage());
    const noSavedContent = await screen.findByRole("heading", {
      name: "No units yet",
    });
    expect(noSavedContent).toBeInTheDocument();
  });

  it("should redirect to sign up when signed out", async () => {
    mockAuth.mockResolvedValue({ userId: null, redirectToSignUp });

    await MyLibraryPage();

    expect(redirectToSignUp).toHaveBeenCalledWith({
      returnBackUrl: "/teachers/my-library",
    });
    expect(mockCurrentUser).not.toHaveBeenCalled();
  });

  it("should redirect to onboarding when the user has not onboarded", async () => {
    mockCurrentUser.mockResolvedValue({
      publicMetadata: { owa: { isOnboarded: false } },
    });

    await MyLibraryPage();

    expect(redirect).toHaveBeenCalledWith(
      "/onboarding?returnTo=%2Fteachers%2Fmy-library",
    );
  });

  it("should generate the correct metadata", () => {
    expect(metadata).toMatchObject({
      title: "My library",
      description: "Save units to your own personal library",
      robots: {
        index: false,
        follow: false,
      },
    });
  });
});
