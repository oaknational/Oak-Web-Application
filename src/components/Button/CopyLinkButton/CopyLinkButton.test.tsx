import userEvent from "@testing-library/user-event";

import { ToastProvider } from "../../../context/Toast";
import renderWithTheme from "../../../__tests__/__helpers__/renderWithTheme";

import CopyLinkButton from "./CopyLinkButton";

const useFeatureFlags = jest.fn(() => ({ enabled: {} }));
jest.mock("posthog-js/react", () => ({
  useFeatureFlags: () => useFeatureFlags(),
}));

describe("Copy link button", () => {
  it("renders", () => {
    const { getByRole } = renderWithTheme(
      <ToastProvider>
        <CopyLinkButton />
      </ToastProvider>
    );

    expect(getByRole("button")).toBeInTheDocument();
  });

  it("updates the label", async () => {
    const { getByLabelText, rerender } = renderWithTheme(
      <ToastProvider>
        <CopyLinkButton />
      </ToastProvider>
    );

    const user = userEvent.setup();

    const button = getByLabelText("Copy to clipboard");
    expect(button).toBeInTheDocument();

    await user.click(button);

    rerender(
      <ToastProvider>
        <CopyLinkButton />
      </ToastProvider>
    );

    const clickedButton = getByLabelText("Copied to clipboard");
    expect(clickedButton).toBeInTheDocument();
  });

  it("renders IconButton if feature flag 'test-feature-flag' enabled", () => {
    useFeatureFlags.mockImplementationOnce(() => ({
      enabled: { "test-feature-flag": true },
    }));

    const { getByRole } = renderWithTheme(
      <ToastProvider>
        <CopyLinkButton />
      </ToastProvider>
    );

    expect(getByRole("button")).toBeInTheDocument();
  });
});
