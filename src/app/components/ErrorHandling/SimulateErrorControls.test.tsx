import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

import { SimulateErrorControls } from "./SimulateErrorControls";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

jest.spyOn(console, "error").mockImplementation(() => {});

describe("SimulateErrorControls", () => {
  it("does not render when disabled", async () => {
    process.env.NEXT_PUBLIC_SIMULATE_ERROR = "false";
    render(<SimulateErrorControls errorBoundaryLevel="root" />);

    expect(
      screen.queryByRole("button", { name: "Simulate root error" }),
    ).not.toBeInTheDocument();
  });
  it("renders a button when enabled", () => {
    process.env.NEXT_PUBLIC_SIMULATE_ERROR = "true";
    render(<SimulateErrorControls errorBoundaryLevel="root" />);

    expect(
      screen.getByRole("button", { name: "Simulate root error" }),
    ).toBeInTheDocument();
  });
  it("throws an error when clicked", async () => {
    process.env.NEXT_PUBLIC_SIMULATE_ERROR = "true";
    render(<SimulateErrorControls errorBoundaryLevel="root" />);

    const simulateErrorBtn = screen.getByRole("button", {
      name: "Simulate root error",
    });
    const user = userEvent.setup();
    await expect(user.click(simulateErrorBtn)).rejects.toThrow();
  });
});
