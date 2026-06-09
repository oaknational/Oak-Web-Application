import { screen } from "@testing-library/react";
import { useForm, FieldErrors } from "react-hook-form";

import ResourcePageLayoutB, { SharePageLayoutProps } from "./SharePageLayout";

import { ResourceFormValues } from "@/components/TeacherComponents/types/downloadAndShare.types";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { defaultCopyrightRequirements } from "@/__tests__/__helpers__/mockCopyrightRequirements";

type PropsWithoutForm = Omit<
  SharePageLayoutProps,
  "control" | "register" | "triggerForm"
>;
const props: PropsWithoutForm = {
  header: "Share",
  errors: {},
  showLoading: false,
  showNoResources: false,
  showPostAlbCopyright: true,
  showSavedDetails: false,
  onEditClick: jest.fn(),
  setSchool: jest.fn(),
  cardGroup: <div>Cards</div>,
  cta: <button>CTA</button>,
  updatedAt: "2022-01-01T00:00:00Z",
  withHomeschool: true,
  showTermsAgreement: true,
  isLoading: false,
};
let mockUseComplexCopyright = defaultCopyrightRequirements;
jest.mock("@/hooks/useComplexCopyright", () => ({
  useComplexCopyright: () => mockUseComplexCopyright,
}));
const ComponentWrapper = (props: PropsWithoutForm) => {
  const { control, register, trigger } = useForm<ResourceFormValues>();

  return (
    <ResourcePageLayoutB
      {...props}
      control={control}
      register={register}
      triggerForm={trigger}
    />
  );
};

describe("Downloads/Share Layout", () => {
  afterEach(() => {
    mockUseComplexCopyright = defaultCopyrightRequirements;
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

  it("exposes validation summary as an alert for assistive technology", () => {
    renderWithTheme(
      <ComponentWrapper
        {...props}
        errors={
          {
            resources: {
              type: "custom",
              message: "select at least one resource to continue",
            },
            terms: {
              type: "custom",
              message: "accept terms and conditions to continue",
            },
          } satisfies FieldErrors<ResourceFormValues>
        }
        validationSummaryKey={1}
      />,
    );

    const validationSummary = screen.getByTestId("share-validation-summary");
    const validationSummarySr = screen.getByTestId(
      "share-validation-summary-sr",
    );
    expect(validationSummary).toHaveAttribute("role", "alert");
    expect(validationSummary).toHaveAttribute("aria-atomic", "true");
    expect(validationSummarySr).toHaveTextContent(
      "To complete correct the following: select at least one resource to continue. accept terms and conditions to continue",
    );
  });

  it("remounts validation summary when validationSummaryKey changes", () => {
    const validationErrors = {
      resources: {
        type: "custom",
        message: "select at least one resource to continue",
      },
    } satisfies FieldErrors<ResourceFormValues>;

    const { rerender } = renderWithTheme(
      <ComponentWrapper
        {...props}
        errors={validationErrors}
        validationSummaryKey={1}
      />,
    );

    const firstValidationSummary = screen.getByTestId(
      "share-validation-summary",
    );

    rerender(
      <ComponentWrapper
        {...props}
        errors={validationErrors}
        validationSummaryKey={2}
      />,
    );

    expect(screen.getByTestId("share-validation-summary")).not.toBe(
      firstValidationSummary,
    );
  });

  it("does not render validation summary when errors have no summary messages", () => {
    renderWithTheme(
      <ComponentWrapper
        {...props}
        errors={
          {
            schoolName: {
              type: "custom",
              message: "enter a school name",
            },
          } satisfies FieldErrors<ResourceFormValues>
        }
      />,
    );

    expect(
      screen.queryByTestId("share-validation-summary"),
    ).not.toBeInTheDocument();
  });

  it("shows loading spinner", () => {
    const { getByTestId } = renderWithTheme(
      <ComponentWrapper {...props} isLoading={true} />,
    );

    const loadingSpinner = getByTestId("loading");
    expect(loadingSpinner).toBeInTheDocument();
  });
});
