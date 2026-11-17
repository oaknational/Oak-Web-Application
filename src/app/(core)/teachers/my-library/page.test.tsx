import { redirect } from "next/navigation";

import MyLibraryPage, { metadata } from "./page";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
  redirect: jest.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT;${url}`);
  }),
}));

const getToken = jest.fn();
const redirectToSignUp = jest.fn();
const mockAuth = jest.fn();
jest.mock("@clerk/nextjs/server", () => ({
  auth: () => mockAuth(),
}));

jest.mock("./MyLibraryContent", () => ({
  MyLibraryContent: jest.fn(() => <div>Mocked MyLibraryContent</div>),
}));

describe("app/(core)/teachers/my-library", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuth.mockResolvedValue({
      userId: "user-123",
      getToken,
      redirectToSignUp,
      isAuthenticated: true,
      sessionClaims: { owa: { isOnboarded: true } },
    });
  });

  it("should render the page content when authenticated and onboarded", async () => {
    const result = await MyLibraryPage();
    expect(result).toBeDefined();
  });

  it("should redirect to sign up when signed out", async () => {
    mockAuth.mockResolvedValue({
      userId: null,
      redirectToSignUp,
    });
    const result = await MyLibraryPage();
    expect(result).toBeUndefined();
  });

  it("should redirect to onboarding when the user has not onboarded", async () => {
    mockAuth.mockResolvedValue({
      userId: "user-123",
      getToken,
      redirectToSignUp,
      isAuthenticated: true,
      sessionClaims: { owa: { isOnboarded: false } },
    });

    await expect(MyLibraryPage()).rejects.toThrow("NEXT_REDIRECT");

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
