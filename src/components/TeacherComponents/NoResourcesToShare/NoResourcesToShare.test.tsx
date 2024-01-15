import NoResourcesToShare from ".";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("NoResourcesToDownload", () => {
  it("renders NoResourcesToShare component", () => {
    const { getByText } = renderWithTheme(<NoResourcesToShare />);

    expect(getByText("No resources to share")).toBeInTheDocument();
  });
});
