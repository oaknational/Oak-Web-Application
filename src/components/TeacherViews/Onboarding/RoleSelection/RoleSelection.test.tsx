import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

import RoleSelectionView from "./RoleSelection.view";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import * as onboardingActions from "@/components/TeacherComponents/OnboardingForm/onboardingActions";

vi.mock("@/components/TeacherComponents/OnboardingForm/onboardingActions");

describe("RoleSelection", () => {
  it("renders a group of radio buttons in a form", () => {
    renderWithProviders()(<RoleSelectionView />);

    const radioGroup = screen.getByRole("radiogroup");
    expect(radioGroup).toBeDefined();

    expect(radioGroup.closest("form")).toBeDefined();
  });
  it("renders a role error", async () => {
    renderWithProviders()(<RoleSelectionView />);

    const continueButton = await screen.findByRole("button", {
      name: /continue/i,
    });

    await userEvent.click(continueButton);

    const roleError = await screen.findByText(
      /Please select what describes you best/i,
    );
    expect(roleError).toBeDefined();
    expect(roleError).toBeVisible();
  });
  it('renders an "other" role input when "other" is selected', async () => {
    renderWithProviders()(<RoleSelectionView />);

    const otherRadio = await screen.findByLabelText(/other/i);

    await userEvent.click(otherRadio);

    const otherRoleInput = await screen.findByLabelText(/your role/i);
    expect(otherRoleInput).toBeDefined();
    expect(otherRoleInput).toBeVisible();

    const continueButton = await screen.findByRole("button", {
      name: /continue/i,
    });
    await userEvent.click(continueButton);

    const otherRoleError = await screen.findByText(
      /Please tell us what your role is/i,
    );
    expect(otherRoleError).toBeDefined();
    expect(otherRoleError).toBeVisible();
  });
  it("clears errors when a role is selected", async () => {
    renderWithProviders()(<RoleSelectionView />);

    const continueButton = await screen.findByRole("button", {
      name: /continue/i,
    });
    await userEvent.click(continueButton);

    const roleError = await screen.findByText(
      /Please select what describes you best/i,
    );
    expect(roleError).toBeDefined();
    expect(roleError).toBeVisible();

    const teacherRadio = await screen.findByLabelText(/teacher trainer/i);
    await userEvent.click(teacherRadio);

    expect(
      screen.queryByText(/Please select what describes you best/i),
    ).toBeNull();
  });
  it("can submit when a role is selected", async () => {
    vi.spyOn(onboardingActions, "onboardUser");

    renderWithProviders()(<RoleSelectionView />);

    await userEvent.click(
      screen.getByRole("radio", {
        name: "Training to become a teacher",
      }),
    );
    await userEvent.click(
      screen.getByRole("button", {
        name: /continue/i,
      }),
    );

    expect(onboardingActions.onboardUser).toHaveBeenCalled();
  });
});
