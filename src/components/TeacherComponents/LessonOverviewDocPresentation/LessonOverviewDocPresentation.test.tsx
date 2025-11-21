import { screen } from "@testing-library/dom";

import LessonOverviewDocPresentation from "./LessonOverviewDocPresentation";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

const mockErrorReporter = jest.fn();
jest.mock("@/common-lib/error-reporter", () => ({
  __esModule: true,
  default:
    () =>
    (...args: []) =>
      mockErrorReporter(...args),
}));

describe("LessonOverviewDocPresentation", () => {
  it("renders an iframe with the correct url", () => {
    render(
      <LessonOverviewDocPresentation
        asset="https://www.testurl.com/edit"
        title="Test"
        docType="lesson guide"
      />,
    );
    const iframe = screen.getByTestId("overview-presentation-document");
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveProperty("src", "https://www.testurl.com/preview");
  });
  it("reports an error if asset url is not formatted correctly", () => {
    render(
      <LessonOverviewDocPresentation
        asset="https://www.testurl.com"
        title="Test"
        docType="lesson guide"
      />,
    );
    expect(mockErrorReporter).toHaveBeenCalled();
  });
});
