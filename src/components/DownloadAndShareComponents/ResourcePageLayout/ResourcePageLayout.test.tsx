import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";

import { DownloadFormProps } from "../downloads.types";

import ResourcePageLayout, {
  ResourcePageLayoutProps,
} from "./ResourcePageLayout";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

type PropsWithoutForm = Omit<ResourcePageLayoutProps, "control" | "register">;
const props: PropsWithoutForm = {
  header: "Downloads",
  selectAllChecked: true,
  handleToggleSelectAll: jest.fn(),
  errors: {},
  showLoading: false,
  showNoResources: false,
  showPostAlbCopyright: true,
  showSavedDetails: false,
  onEditClick: jest.fn(),
  setSchool: jest.fn(),
  cardGroup: <div>Cards</div>,
  cta: <button>CTA</button>,
};

const ComponentWrapper = (props: PropsWithoutForm) => {
  const { control, register } = useForm<DownloadFormProps>();

  return (
    <ResourcePageLayout {...props} control={control} register={register} />
  );
};

describe("Downloads/Share Layout", () => {
  it("renders a toggleable select all checkbox", async () => {
    let checked = true;
    const { rerender } = renderWithTheme(
      <ComponentWrapper
        {...props}
        selectAllChecked={checked}
        handleToggleSelectAll={() => (checked = false)}
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
      <ComponentWrapper
        {...props}
        selectAllChecked={checked}
        handleToggleSelectAll={() => (checked = false)}
      />,
    );
    expect(selectAllCheckbox).not.toBeChecked();
  });
  it("handles download error message ", () => {
    renderWithTheme(
      <ComponentWrapper
        {...props}
        errors={{ downloads: { message: "downloads error" } }}
      />,
    );

    const errorMessage = screen.getByText("downloads error");
    expect(errorMessage).toBeInTheDocument();
  });
});
