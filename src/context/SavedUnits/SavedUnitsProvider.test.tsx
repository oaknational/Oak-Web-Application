import { useContext } from "react";
import { fireEvent, screen, waitFor } from "@testing-library/react";

import { SavedUnitsProvider } from "./SavedUnitsProvider";
import { SavedUnitsContext } from "./SavedUnitsStore";
import { useSharedSaveUnit } from "./hooks/useSharedSaveUnit";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { mockLoggedIn, mockLoggedOut } from "@/__tests__/__helpers__/mockUser";
import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";
import { SaveUnitButton } from "@/components/TeacherComponents/SaveUnitButton/SaveUnitButton";

const render = renderWithProviders();
const mockGetData = jest.fn();
const mockToast = jest.fn();
const emptyData: string[] = [];

jest.mock("@/node-lib/educator-api/helpers/useGetEducatorData", () => ({
  useGetEducatorData: (url: string) => mockGetData(url),
}));
jest.mock("@/context/OakNotifications/useOakNotificationsContext", () => ({
  useOakNotificationsContext: () => ({ setCurrentToastProps: mockToast }),
}));

const tracking = {
  savedFrom: "unit_listing_save_button" as const,
  keyStageSlug: "ks1",
  keyStageTitle: "Key stage 1" as const,
  subjectSlug: "maths",
  subjectTitle: "Maths",
};

function Button({ unitSlug }: { unitSlug: string }) {
  const store = useContext(SavedUnitsContext);
  if (!store) throw new Error("Missing SavedUnitsProvider");
  const { isSaved, onSaveToggle, showSignIn } = useSharedSaveUnit(
    store,
    "programme",
    unitSlug,
    tracking,
  );
  return (
    <button onClick={onSaveToggle}>
      {unitSlug}: {showSignIn ? "Sign in" : isSaved ? "Saved" : "Save"}
    </button>
  );
}

function Page({ showButtons = true }: { showButtons?: boolean }) {
  return (
    <SavedUnitsProvider programmeSlugs={["programme"]}>
      {showButtons && (
        <>
          <Button unitSlug="one" />
          <Button unitSlug="two" />
        </>
      )}
    </SavedUnitsProvider>
  );
}

describe("SavedUnitsProvider integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setUseUserReturn(mockLoggedIn);
    mockGetData.mockReturnValue({ data: emptyData });
    jest.mocked(global.fetch).mockResolvedValue({ ok: true } as Response);
  });

  it("loads saved data once per programme for multiple buttons", () => {
    const data = ["one"];
    mockGetData.mockReturnValue({ data });
    render(<Page />);

    expect(mockGetData).toHaveBeenCalledTimes(1);
    expect(mockGetData).toHaveBeenCalledWith(
      "/api/educator/getSavedUnits/programme",
    );
    expect(
      screen.getByRole("button", { name: "one: Saved" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "two: Save" }),
    ).toBeInTheDocument();
  });

  it("connects the save button to provider mutations and rolls back failures", async () => {
    jest.mocked(global.fetch).mockResolvedValue({ ok: false } as Response);
    render(
      <SavedUnitsProvider programmeSlugs={["programme"]}>
        <SaveUnitButton
          buttonVariant="default"
          programmeSlug="programme"
          unitSlug="one"
          unitTitle="Unit One"
          trackingProps={tracking}
        />
      </SavedUnitsProvider>,
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Save this unit: Unit One" }),
    );

    expect(
      screen.getByRole("button", { name: "Unsave this unit: Unit One" }),
    ).toHaveTextContent("Saved");
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Save this unit: Unit One" }),
      ).toHaveTextContent("Save"),
    );
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/educator/saveUnit/programme/one",
      { method: "POST" },
    );
    expect(mockToast).toHaveBeenLastCalledWith(
      expect.objectContaining({ variant: "error" }),
    );
    expect(mockGetData).toHaveBeenCalledTimes(1);
  });

  it("retains optimistic state while tab content unmounts and remounts", async () => {
    const { rerender } = render(<Page />);
    fireEvent.click(screen.getByRole("button", { name: "one: Save" }));
    await waitFor(() => expect(mockToast).toHaveBeenCalledTimes(1));
    rerender(<Page showButtons={false} />);
    rerender(<Page />);

    expect(
      screen.getByRole("button", { name: "one: Saved" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "two: Save" }),
    ).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("creates a fresh store when the authenticated user changes", () => {
    const { rerender } = render(<Page />);
    fireEvent.click(screen.getByRole("button", { name: "one: Save" }));

    setUseUserReturn(mockLoggedOut);
    rerender(<Page />);

    expect(
      screen.getByRole("button", { name: "one: Save" }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "one: Save" }));
    expect(
      screen.getByRole("button", { name: "one: Sign in" }),
    ).toBeInTheDocument();
  });
});
