import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import CommonMisconceptions from "./CommonMisconceptions";

describe("CommonMisconceptions component", () => {
  it("should render with correct heading", () => {
    const commonMisconceptions = [
      { misconception: "test misconception", response: "test response" },
    ];
    const { getByTestId, getByText } = renderWithTheme(
      <CommonMisconceptions commonMisconceptions={commonMisconceptions} />
    );
    const componentTitle = getByText("Common misconceptions");
    expect(getByTestId("heading")).toBeInTheDocument();
    expect(componentTitle).toBeInTheDocument();
  });

  it("should render with misconception and response", () => {
    const commonMisconceptions = [
      { misconception: "test misconception", response: "test response" },
    ];
    const { getByText } = renderWithTheme(
      <CommonMisconceptions commonMisconceptions={commonMisconceptions} />
    );
    const misconception = getByText("test misconception");
    const response = getByText("test response");

    expect(misconception).toBeInTheDocument();
    expect(response).toBeInTheDocument();
  });

  // Ask Thomas if you can pass null as a response ot misconception
  //   it("should render with null and non-null core content", () => {
  //     const commonMisconceptions = [
  //       { misconception: "test misconception", response: null },
  //     ];
  //     const { getAllByRole } = renderWithTheme(
  //       <CommonMisconceptions commonMisconceptions={commonMisconceptions} />
  //     );

  //     const listItems = getAllByRole("listitem");
  //     expect(listItems).toHaveLength(1);
  //   });
});
