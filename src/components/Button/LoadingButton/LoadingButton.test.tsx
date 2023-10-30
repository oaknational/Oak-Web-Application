import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";

import LoadingButton from "./LoadingButton";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("Loading button", () => {
  it("updates on click", async () => {
    let loading = false;
    const setLoading = () => {
      loading = true;
    };
    const { rerender } = renderWithTheme(
      <LoadingButton
        text="Click"
        isLoading={loading}
        loadingText="Loading..."
        onClick={setLoading}
        icon="bell"
      />,
    );

    const user = userEvent.setup();
    const button = screen.getByRole("button", { name: "Click" });

    await user.click(button);
    rerender(
      <LoadingButton
        text="Click"
        isLoading={loading}
        loadingText="Loading..."
        onClick={setLoading}
        icon="bell"
      />,
    );

    expect(button).toHaveAttribute("disabled");
    expect(button).toHaveTextContent("Loading...");
  });
});
