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
  redirect: jest.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT;${url}`);
  }),
}));

const redirectToSignUp = jest.fn();
const getToken = jest.fn();
const mockAuth = jest.fn();
const mockCurrentUser = jest.fn();
jest.mock("@clerk/nextjs/server", () => ({
  auth: () => mockAuth(),
  currentUser: () => mockCurrentUser(),
}));

const mockGetUserListContent = jest.fn();
jest.mock(
  "@/node-lib/educator-api/queries/getUserListContent/getUserListContent",
  () => ({
    getUserListContent: (...args: unknown[]) => mockGetUserListContent(...args),
  }),
);

// Echo the server data back so the view renders from its SWR fallback
jest.mock("@/node-lib/educator-api/helpers/useGetEducatorData", () => ({
  useGetEducatorData: (_url: string, config?: { fallbackData?: unknown }) => ({
    data: config?.fallbackData,
    isLoading: false,
    mutate: jest.fn(),
  }),
}));

const reportError = jest.fn();
jest.mock("@/common-lib/error-reporter", () => ({
  __esModule: true,
  default:
    () =>
    (...args: unknown[]) =>
      reportError(...args),
}));

const render = renderWithProviders();

describe("app/(core)/teachers/my-library", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuth.mockResolvedValue({
      userId: "user-123",
      getToken,
      redirectToSignUp,
    });
    mockCurrentUser.mockResolvedValue({
      publicMetadata: { owa: { isOnboarded: true } },
    });
    mockGetUserListContent.mockResolvedValue({});
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
    expect(mockGetUserListContent).toHaveBeenCalledWith(getToken, "user-123");
  });

  it("should report the error and render without collections when the fetch fails", async () => {
    mockGetUserListContent.mockRejectedValue(new Error("boom"));

    render(await MyLibraryPage());

    expect(reportError).toHaveBeenCalled();
    expect(
      await screen.findByRole("heading", { name: "My library" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("No units yet")).not.toBeInTheDocument();
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

    await expect(MyLibraryPage()).rejects.toThrow("NEXT_REDIRECT");

    expect(redirect).toHaveBeenCalledWith(
      "/onboarding?returnTo=%2Fteachers%2Fmy-library",
    );
    expect(mockGetUserListContent).not.toHaveBeenCalled();
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
