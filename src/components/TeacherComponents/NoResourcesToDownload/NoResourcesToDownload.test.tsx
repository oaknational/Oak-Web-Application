import NoResourcesToDownload from ".";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("NoResourcesToDownload", () => {
  it("renders NoResourcesToDownload component", () => {
    const { getByText } = renderWithTheme(<NoResourcesToDownload />);

    expect(getByText("No downloads available")).toBeInTheDocument();
  });
});
