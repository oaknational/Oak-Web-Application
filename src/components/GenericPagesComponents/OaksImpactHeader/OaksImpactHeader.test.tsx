import { OaksImpactHeader } from ".";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("OaksImpactHeader", () => {
  it("renders correctly", () => {
    const { baseElement, getByRole } = render(
      <OaksImpactHeader
        videoDescription={"TEST_VIDEO_DESCRIPTION"}
        video={undefined}
        title={"TEST_TITLE"}
        body={"TEST_BODY"}
      />,
    );
    expect(baseElement).toMatchSnapshot();
    expect(getByRole("heading")).toHaveTextContent("TEST_TITLE");
    expect(baseElement).toHaveTextContent("TEST_BODY");
    expect(baseElement).toHaveTextContent("TEST_VIDEO_DESCRIPTION");
  });
});
