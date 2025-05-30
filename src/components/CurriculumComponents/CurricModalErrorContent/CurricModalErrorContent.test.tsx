import CurricModalErrorContent from "./CurricModalErrorContent";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("CurricModalErrorContent", () => {
  it("should render correctly", () => {
    const { container } = renderWithTheme(
      <CurricModalErrorContent statusCode="404" message="Missing!" />,
    );
    expect(container).toMatchSnapshot();
  });

  it("should render additional when supplied", () => {
    const { container } = renderWithTheme(
      <CurricModalErrorContent
        statusCode="404"
        message="Missing!"
        additional="Close this modal"
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
