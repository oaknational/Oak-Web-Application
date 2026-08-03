import { OaksImpactCaseStudyHeader } from ".";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("OaksImpactCaseStudies", () => {
  it("renders correctly", () => {
    const { baseElement, getByRole } = render(
      <OaksImpactCaseStudyHeader
        title="TEST_TITLE"
        publishedDate="TEST_DATE"
        onCopyLink={() => {}}
      />,
    );

    expect(baseElement).toMatchSnapshot();
    expect(getByRole("heading", { name: "TEST_TITLE" })).toBeInTheDocument();
    expect(baseElement).toHaveTextContent("TEST_DATE");
  });

  it("calls onCopyLink when copy link clicked", () => {
    const onCopyLink = jest.fn();
    const { getByRole } = render(
      <OaksImpactCaseStudyHeader
        title="TEST_TITLE"
        publishedDate="TEST_DATE"
        onCopyLink={onCopyLink}
      />,
    );

    const buttonEl = getByRole("button");
    buttonEl.click();
    expect(onCopyLink).toHaveBeenCalledTimes(1);
  });
});
