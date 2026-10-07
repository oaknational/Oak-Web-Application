/**
 * @jest-environment jsdom
 */
import { screen } from "@testing-library/dom";

import MyLibraryPage, { metadata } from "./page";

import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";
import { mockLoggedIn } from "@/__tests__/__helpers__/mockUser";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

jest.mock("posthog-js/react", () => ({
  useFeatureFlagVariantKey: () => true,
  useFeatureFlagEnabled: () => true,
}));
jest.mock("next/navigation");

const render = renderWithProviders();

jest.mock("@/node-lib/educator-api/helpers/saveUnits/useMyLibrary", () => ({
  useMyLibrary: jest.fn(() => ({
    collectionData: [],
    isLoading: false,
  })),
}));

describe("app/(core)/teachers/my-library", () => {
  beforeEach(() => {
    setUseUserReturn(mockLoggedIn);
  });
  it("should render a header", async () => {
    render(MyLibraryPage());
    const header = await screen.findByRole("heading", {
      name: "My library",
    });
    expect(header).toBeInTheDocument();
  });
  it("should render a no saved content heading", async () => {
    render(MyLibraryPage());
    const noSavedContent = await screen.findByRole("heading", {
      name: "No units yet",
    });
    expect(noSavedContent).toBeInTheDocument();
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
