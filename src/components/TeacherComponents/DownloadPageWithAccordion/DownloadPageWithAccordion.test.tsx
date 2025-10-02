import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";

import DownloadPageWithAccordion, {
  DownloadPageWithAccordionProps,
} from "./DownloadPageWithAccordion";

import { ResourceFormProps } from "@/components/TeacherComponents/types/downloadAndShare.types";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import {
  defaultCopyrightRequirements,
  signedOutLoginRequired,
} from "@/__tests__/__helpers__/mockCopyrightRequirements";

type PropsWithoutForm = Omit<
  DownloadPageWithAccordionProps,
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
  updatedAt: "2022-01-01T00:00:00Z",
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

let mockUseCopyrightRequirements = defaultCopyrightRequirements;
jest.mock("@/hooks/useCopyrightRequirements", () => ({
  useCopyrightRequirements: () => mockUseCopyrightRequirements,
}));

const ComponentWrapper = (props: PropsWithoutForm) => {
  const { control, register, trigger } = useForm<ResourceFormProps>();

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
    mockUseCopyrightRequirements = defaultCopyrightRequirements;
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
    mockUseCopyrightRequirements = signedOutLoginRequired;
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
