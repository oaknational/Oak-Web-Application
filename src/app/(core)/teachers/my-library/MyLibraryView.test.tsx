import { screen } from "@testing-library/dom";

import { MyLibraryView } from "./MyLibraryView";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import userListContentFixture from "@/node-lib/educator-api/fixtures/userListContent.fixture";

const mockUseGetEducatorData = jest.fn();
jest.mock("@/node-lib/educator-api/helpers/useGetEducatorData", () => ({
  useGetEducatorData: (...args: unknown[]) => mockUseGetEducatorData(...args),
}));

jest.mock("@/node-lib/educator-api/helpers/saveUnits/useSaveUnits", () => ({
  useSaveUnits: () => ({
    onSaveToggle: jest.fn(),
    isUnitSaved: () => false,
    isUnitSaving: () => false,
    showSignIn: false,
    setShowSignIn: jest.fn(),
  }),
}));

const render = renderWithProviders();

describe("MyLibraryView", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseGetEducatorData.mockImplementation(
      (_url: string, config?: { fallbackData?: unknown }) => ({
        data: config?.fallbackData,
        isLoading: false,
        mutate: jest.fn(),
      }),
    );
  });

  it("seeds SWR with the server-fetched units", () => {
    const savedUnits = userListContentFixture("programme1");

    render(<MyLibraryView savedUnits={savedUnits} />);

    expect(mockUseGetEducatorData).toHaveBeenCalledWith(
      "/api/educator/getSavedContentLists",
      { fallbackData: savedUnits },
    );
    expect(screen.getByText("Maths KS1")).toBeInTheDocument();
  });

  it("renders revalidated data in place of the server-fetched units", () => {
    mockUseGetEducatorData.mockReturnValue({
      data: userListContentFixture("programme2", {
        subject: "Biology",
        subjectSlug: "biology",
      }),
      isLoading: false,
      mutate: jest.fn(),
    });

    render(<MyLibraryView savedUnits={userListContentFixture("programme1")} />);

    expect(screen.getByText("Biology KS1")).toBeInTheDocument();
    expect(screen.queryByText("Maths KS1")).not.toBeInTheDocument();
  });

  it("omits the fallback when the server fetch failed", () => {
    mockUseGetEducatorData.mockReturnValue({
      data: undefined,
      isLoading: true,
      mutate: jest.fn(),
    });

    render(<MyLibraryView savedUnits={null} />);

    expect(mockUseGetEducatorData).toHaveBeenCalledWith(
      "/api/educator/getSavedContentLists",
      { fallbackData: undefined },
    );
    expect(screen.queryByText("No units yet")).not.toBeInTheDocument();
  });
});
