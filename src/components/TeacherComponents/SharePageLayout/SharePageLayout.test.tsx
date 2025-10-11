import { screen } from "@testing-library/react";
import { useForm } from "react-hook-form";

import ResourcePageLayoutB, { SharePageLayoutProps } from "./SharePageLayout";

import { ResourceFormProps } from "@/components/TeacherComponents/types/downloadAndShare.types";
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
let mockUseCopyrightRequirements = defaultCopyrightRequirements;
jest.mock("@/hooks/useCopyrightRequirements", () => ({
  useCopyrightRequirements: () => mockUseCopyrightRequirements,
}));
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

describe("Downloads/Share Layout", () => {
  afterEach(() => {
    mockUseCopyrightRequirements = defaultCopyrightRequirements;
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

  it("shows copyright when no terms are linked", () => {
    const { getByTestId } = renderWithTheme(
      <ComponentWrapper {...props} showTermsAgreement={false} />,
    );

    const copyright = getByTestId("copyright-container");
    expect(copyright).toBeInTheDocument();
  });

  it("shows loading spinner", () => {
    const { getByTestId } = renderWithTheme(
      <ComponentWrapper {...props} isLoading={true} />,
    );

    const loadingSpinner = getByTestId("loading");
    expect(loadingSpinner).toBeInTheDocument();
  });
});
