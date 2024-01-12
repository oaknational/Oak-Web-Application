import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";

import { ResourceFormProps } from "../downloadAndShare.types";

import ResourcePageLayout, {
  ResourcePageLayoutProps,
} from "./ResourcePageLayout";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

type PropsWithoutForm = Omit<
  ResourcePageLayoutProps,
  "control" | "register" | "triggerForm"
>;
const props: PropsWithoutForm = {
  page: "download",
  header: "Downloads",
  selectAllChecked: true,
  handleToggleSelectAll: vi.fn(),
  errors: {},
  showLoading: false,
  showNoResources: false,
  showPostAlbCopyright: true,
  showSavedDetails: false,
  onEditClick: vi.fn(),
  setSchool: vi.fn(),
  cardGroup: <div>Cards</div>,
  cta: <button>CTA</button>,
  resourcesHeader: "Lesson downloads",
};

const ComponentWrapper = (props: PropsWithoutForm) => {
  const { control, register, trigger } = useForm<ResourceFormProps>();

  return (
    <ResourcePageLayout
      {...props}
      control={control}
      register={register}
      triggerForm={trigger}
    />
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
        errors={{ resources: { message: "downloads error" } }}
      />,
    );

    const errorMessage = screen.getByText("downloads error");
    expect(errorMessage).toBeInTheDocument();
  });
  it("handles api error", () => {
    const { rerender } = renderWithTheme(<ComponentWrapper {...props} />);

    const apiError = screen.queryByText("Api Error");
    expect(apiError).not.toBeInTheDocument();

    rerender(<ComponentWrapper {...props} apiError={"Api Error"} />);
    const apiErrorAfterRerender = screen.getByText("Api Error");
    expect(apiErrorAfterRerender).toBeInTheDocument();
  });
});
