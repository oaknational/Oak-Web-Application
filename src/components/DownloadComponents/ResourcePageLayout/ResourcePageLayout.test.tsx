import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ResourcePageLayoutProps from "./ResourcePageLayout";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("Downloads/Share Layout", () => {
  it("renders a toggleable select all checkbox", async () => {
    let checked = true;
    const { rerender } = renderWithTheme(
      <ResourcePageLayoutProps
        header="Download"
        handleToggleSelectAll={() => (checked = !checked)}
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
      <ResourcePageLayoutProps
        header="Download"
        handleToggleSelectAll={() => (checked = true)}
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
      <ResourcePageLayoutProps
        header="Download"
        handleToggleSelectAll={() => {}}
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
