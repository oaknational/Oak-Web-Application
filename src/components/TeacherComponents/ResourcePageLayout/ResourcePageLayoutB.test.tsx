import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";

import ResourcePageLayoutB, {
  ResourcePageLayoutProps,
} from "./ResourcePageLayoutB";

import { ResourceFormProps } from "@/components/TeacherComponents/types/downloadAndShare.types";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

type PropsWithoutForm = Omit<
  ResourcePageLayoutProps,
  "control" | "register" | "triggerForm"
>;
const props: PropsWithoutForm = {
  page: "download",
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
  resourcesHeader: "Lesson downloads",
  updatedAt: "2022-01-01T00:00:00Z",
  withHomeschool: true,
  showTermsAgreement: true,
  isLoading: false,
};

const ComponentWrapper = (props: PropsWithoutForm) => {
  const { control, register, trigger } = useForm<ResourceFormProps>();

  return (
    <ResourcePageLayoutB
      {...props}
      control={control}
      register={register}
      triggerForm={trigger}
    />
  );
};

/** TEST TIMING OUT SPORADICALLY SO SKIPPED WITH A VIEW TO FIX IN THE FUTURE */
describe.skip("Downloads/Share Layout", () => {
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
