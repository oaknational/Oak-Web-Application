import { queryByAttribute } from "@testing-library/react";
import { FieldErrors, useForm } from "react-hook-form";

import TermsAgreementForm, {
  TermsAgreementFormProps,
} from "./TermsAgreementForm";

import { ResourceFormProps } from "@/components/TeacherComponents/types/downloadAndShare.types";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

type TermsAgreementFormPropsOptionalForm = Omit<
  TermsAgreementFormProps,
  "form" | "copyrightYear"
> & {
  errors?: FieldErrors<ResourceFormProps>;
};

const render = renderWithProviders();

const Wrapper = (props: TermsAgreementFormPropsOptionalForm) => {
  const { control, register, trigger } = useForm<ResourceFormProps>();

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
    const errors: FieldErrors<ResourceFormProps> = {
      school: {
        message: errorMessage,
        type: "too_small",
      },
    };
    const { container } = render(<Wrapper errors={errors} />);

    const error = queryByAttribute("id", container, "school-error");
    expect(error).toBeInTheDocument();
    expect(error).toHaveTextContent(errorMessage);
  });

  it("Shows loading", async () => {
    const { getByTestId } = render(<Wrapper isLoading={true} />);
    const loadingElement = getByTestId("loading");
    expect(loadingElement).toBeInTheDocument();
  });

  it("Shows DetailsCompleted component", async () => {
    const { getByTestId } = render(<Wrapper showSavedDetails={true} />);
    const detailsCompletedComponent = getByTestId("details-completed");
    expect(detailsCompletedComponent).toBeInTheDocument();
  });

  it("Shows newsletter policy", async () => {
    const { getByTestId } = render(<Wrapper />);
    const detailsCompletedComponent = getByTestId("newsletter-policy");
    expect(detailsCompletedComponent).toBeInTheDocument();
  });

  it("Shows ResourcePageTermsAndConditionsCheckbox component", async () => {
    // Render the component with required props
    const { getByTestId } = render(<Wrapper />);
    const detailsCompletedComponent = getByTestId("termsCheckbox");
    expect(detailsCompletedComponent).toBeInTheDocument();
  });
  it("Shows ResourcePageTermsAndConditionsCheckbox component", async () => {
    // Render the component with required props
    const { getByTestId } = render(<Wrapper />);
    const detailsCompletedComponent = getByTestId("termsCheckbox");
    expect(detailsCompletedComponent).toBeInTheDocument();
  });
  it("does not show heading and copyright notice when isDownloadsExperiment is true", async () => {
    const { queryByText } = render(<Wrapper isDownloadsExperiment />);
    const heading = queryByText("Your details");
    const copyrightNotice = queryByText("Open Government Licence version 3.0");
    expect(heading).not.toBeInTheDocument();
    expect(copyrightNotice).not.toBeInTheDocument();
  });
});
