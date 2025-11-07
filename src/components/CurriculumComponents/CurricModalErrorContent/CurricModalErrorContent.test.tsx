import CurricModalErrorContent from "./CurricModalErrorContent";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("CurricModalErrorContent", () => {
  it("should render correctly", () => {
    const { container } = render(
      <CurricModalErrorContent statusCode="404" message="Missing!" />,
    );
    expect(container).toMatchSnapshot();
  });

  it("should render additional when supplied", () => {
    const { container } = render(
      <CurricModalErrorContent
        statusCode="404"
        message="Missing!"
        additional="Close this modal"
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
