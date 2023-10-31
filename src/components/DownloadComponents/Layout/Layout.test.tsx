import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Layout from "./Layout";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
console.error = jest.fn;
describe("Downloads/Share Layout", () => {
  it("renders a toggleable select all checkbox", async () => {
    let checked = true;
    const { rerender } = renderWithTheme(
      <Layout
        header="Download"
        handleToggle={() => (checked = !checked)}
        selectAllChecked={checked}
        cardGroup={<div>Cards</div>}
        userDetails={<div>Details</div>}
        ctaButton={<button>CTA</button>}
      />,
    );

    const selectAllCheckbox = screen.getByRole("checkbox", {
      name: "Select all",
    });

    expect(selectAllCheckbox).toBeInTheDocument();
    expect(selectAllCheckbox).toBeChecked();

    const user = userEvent.setup();
    await user.click(selectAllCheckbox);
    rerender(
      <Layout
        header="Download"
        handleToggle={() => (checked = true)}
        selectAllChecked={false}
        cardGroup={<div>Cards</div>}
        userDetails={<div>Details</div>}
        ctaButton={<button>CTA</button>}
      />,
    );
    expect(selectAllCheckbox).not.toBeChecked();
  });
  it("handles download error message ", () => {
    renderWithTheme(
      <Layout
        header="Download"
        handleToggle={() => {}}
        selectAllChecked={true}
        cardGroup={<div>Cards</div>}
        userDetails={<div>Details</div>}
        ctaButton={<button>CTA</button>}
        errors={{ downloads: { message: "downloads error" } }}
      />,
    );

    const errorMessage = screen.getByText("downloads error");
    expect(errorMessage).toBeInTheDocument();
  });
});
