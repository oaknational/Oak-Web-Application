import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";

import DownloadPageWithAccordion, {
  DownloadWrapperProps,
} from "./DownloadPageWithAccordion";

import { ResourceFormValues } from "@/components/TeacherComponents/types/downloadAndShare.types";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import {
  defaultCopyrightRequirements,
  signedOutLoginRequired,
} from "@/__tests__/__helpers__/mockCopyrightRequirements";

type PropsWithoutForm = Omit<
  DownloadWrapperProps,
  "control" | "register" | "triggerForm"
>;
const props: PropsWithoutForm = {
  downloadsRestricted: false,
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
  copyrightYear: "2022-01-01T00:00:00Z",
  withHomeschool: true,
  showTermsAgreement: true,
  isLoading: false,
  geoRestricted: false,
  loginRequired: false,
  showGeoBlocked: false,
  lessonSlug: "lesson-1",
  lessonTitle: "Lesson 1",
  lessonReleaseDate: "2022-01-01T00:00:00Z",
  isLegacy: false,
};

let mockUseComplexCopyright = defaultCopyrightRequirements;
jest.mock("@/hooks/useComplexCopyright", () => ({
  useComplexCopyright: () => mockUseComplexCopyright,
}));

const ComponentWrapper = (props: PropsWithoutForm) => {
  const { control, register, trigger } = useForm<ResourceFormValues>();

  return (
    <DownloadPageWithAccordion
      {...props}
      control={control}
      register={register}
      triggerForm={trigger}
    />
  );
};

describe("Download Page With Accordion", () => {
  afterEach(() => {
    mockUseComplexCopyright = defaultCopyrightRequirements;
  });

  it("renders downloads accordion", async () => {
    renderWithProviders()(<ComponentWrapper {...props} />);

    const downloadsAccordion = screen.getByText("All resources selected");

    expect(downloadsAccordion).toBeInTheDocument();
  });

  it("renders a toggleable select all checkbox", async () => {
    let checked = true;
    const { rerender } = renderWithProviders()(
      <ComponentWrapper
        {...props}
        selectAllChecked={checked}
        handleToggleSelectAll={() => (checked = false)}
        showTermsAgreement={false}
      />,
    );

    const selectAllCheckbox = screen.getByRole("checkbox", {
      name: "All resources selected",
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
        showTermsAgreement={false}
      />,
    );
    expect(selectAllCheckbox).not.toBeChecked();
  });

  it("handles download error message ", () => {
    renderWithProviders()(
      <ComponentWrapper
        {...props}
        errors={{ resources: { message: "downloads error" } }}
      />,
    );

    const errorMessage = screen.getByText("downloads error");
    expect(errorMessage).toBeInTheDocument();
  });

  it("announces validation summary in a polite live region", async () => {
    renderWithProviders()(
      <ComponentWrapper
        {...props}
        errors={{
          resources: { message: "downloads error" },
          terms: { message: "terms error", type: "required" },
        }}
      />,
    );

    const validationSummary = screen.getByTestId("download-validation-summary");
    const srValidationSummary = screen.getByTestId(
      "download-validation-summary-sr",
    );

    expect(validationSummary).toBeInTheDocument();
    expect(srValidationSummary).toHaveAttribute("aria-live", "polite");
    await waitFor(() => {
      expect(srValidationSummary).toHaveTextContent(
        "To complete, correct the following: select at least one resource to continue. accept terms and conditions to continue",
      );
    });
  });

  it("remounts screen-reader validation summary when validationSummaryKey changes", () => {
    const validationErrors = {
      resources: { message: "downloads error" },
      terms: { message: "terms error", type: "required" },
    };

    const { rerender } = renderWithProviders()(
      <ComponentWrapper
        {...props}
        errors={validationErrors}
        validationSummaryKey={1}
      />,
    );

    const firstSrValidationSummary = screen.getByTestId(
      "download-validation-summary-sr",
    );

    rerender(
      <ComponentWrapper
        {...props}
        errors={validationErrors}
        validationSummaryKey={2}
      />,
    );

    expect(screen.getByTestId("download-validation-summary-sr")).not.toBe(
      firstSrValidationSummary,
    );
  });

  it("handles api error", () => {
    const { rerender } = renderWithProviders()(<ComponentWrapper {...props} />);

    const apiError = screen.queryByText("Api Error");
    expect(apiError).not.toBeInTheDocument();

    rerender(<ComponentWrapper {...props} apiError={"Api Error"} />);
    const apiErrorAfterRerender = screen.getByText("Api Error");
    expect(apiErrorAfterRerender).toBeInTheDocument();
  });

  it("shows risk assessment banners", () => {
    const { getAllByTestId } = renderWithProviders()(
      <ComponentWrapper {...props} showRiskAssessmentBanner={true} />,
    );

    const riskAssessmentBanner = getAllByTestId("risk-assessment-message");
    riskAssessmentBanner.forEach((banner) => {
      expect(banner).toBeInTheDocument();
    });
  });

  it("shows loading spinner", () => {
    const { getByTestId } = renderWithProviders()(
      <ComponentWrapper {...props} isLoading={true} />,
    );

    const loadingSpinner = getByTestId("loading");
    expect(loadingSpinner).toBeInTheDocument();
  });

  it("renders LoginRequired button instead of CTA component when downloadsRestricted is true", () => {
    const restrictedProps = {
      ...props,
      downloadsRestricted: true,
    };
    mockUseComplexCopyright = signedOutLoginRequired;
    const { queryByRole, getByRole } = renderWithProviders()(
      <ComponentWrapper {...restrictedProps} />,
    );

    const ctaButton = queryByRole("button", { name: "CTA" });
    const loginRequiredButton = getByRole("button", {
      name: "Sign in to continue",
    });
    expect(ctaButton).not.toBeInTheDocument();
    expect(loginRequiredButton).toBeInTheDocument();
  });
});
