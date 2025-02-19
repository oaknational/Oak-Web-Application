import { queryByAttribute } from "@testing-library/react";
import { FieldErrors, useForm } from "react-hook-form";

import TermsAgreementForm, {
  TermsAgreementFormProps,
} from "./TermsAgreementForm";

import {
  ResourceFormProps,
  ResourceFormWithRiskAssessmentProps,
} from "@/components/TeacherComponents/types/downloadAndShare.types";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

type TermsAgreementFormPropsOptionalForm = Omit<
  TermsAgreementFormProps,
  "form" | "copyrightYear"
> & {
  errors?: FieldErrors<ResourceFormProps | ResourceFormWithRiskAssessmentProps>;
};

const render = renderWithProviders();

const Wrapper = (props: TermsAgreementFormPropsOptionalForm) => {
  const { control, register, trigger } = useForm<
    ResourceFormProps | ResourceFormWithRiskAssessmentProps
  >();

  return (
    <TermsAgreementForm
      {...props}
      copyrightYear={"2022-01-01T00:00:00Z"}
      form={{ control, register, trigger, errors: props.errors || {} }}
    />
  );
};

describe("TermsAgreementForm (School, email and terms form within the teacher and curriculum journey)", () => {
  it("Shows school error message when error object is passed in", async () => {
    const errorMessage = `Select school, type 'homeschool' or tick 'My school isn't listed'`;
    const errors: FieldErrors<
      ResourceFormProps | ResourceFormWithRiskAssessmentProps
    > = {
      school: {
        message: errorMessage,
        type: "too_small",
      },
    };
    const { container } = render(
      <Wrapper errors={errors} showRiskAssessmentCheckbox={false} />,
    );

    const error = queryByAttribute("id", container, "school-error");
    expect(error).toBeInTheDocument();
    expect(error).toHaveTextContent(errorMessage);
  });

  it("Shows loading", async () => {
    const { getByTestId } = render(
      <Wrapper isLoading={true} showRiskAssessmentCheckbox={false} />,
    );
    const loadingElement = getByTestId("loading");
    expect(loadingElement).toBeInTheDocument();
  });

  it("Shows DetailsCompleted component", async () => {
    const { getByTestId } = render(
      <Wrapper showSavedDetails={true} showRiskAssessmentCheckbox={false} />,
    );
    const detailsCompletedComponent = getByTestId("details-completed");
    expect(detailsCompletedComponent).toBeInTheDocument();
  });

  it("Shows newsletter policy", async () => {
    const { getByTestId } = render(
      <Wrapper showRiskAssessmentCheckbox={false} />,
    );
    const detailsCompletedComponent = getByTestId("newsletter-policy");
    expect(detailsCompletedComponent).toBeInTheDocument();
  });

  it("Shows ResourcePageTermsAndConditionsCheckbox component", async () => {
    // Render the component with required props
    const { getByTestId } = render(
      <Wrapper showRiskAssessmentCheckbox={false} />,
    );
    const detailsCompletedComponent = getByTestId("termsCheckbox");
    expect(detailsCompletedComponent).toBeInTheDocument();
  });
  it("Shows ResourcePageTermsAndConditionsCheckbox component", async () => {
    // Render the component with required props
    const { getByTestId } = render(
      <Wrapper showRiskAssessmentCheckbox={false} />,
    );
    const detailsCompletedComponent = getByTestId("termsCheckbox");
    expect(detailsCompletedComponent).toBeInTheDocument();
  });
});
