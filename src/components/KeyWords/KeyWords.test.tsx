import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import KeyWords from "./KeyWords";

describe("KeyWords component", () => {
  const keyWordsData = [
    { keyword: "test1", description: "Description for test1" },
    { keyword: "test2", description: "Description for test2" },
  ];
  it("should render with correct title", () => {
    const { getByTestId, getByText } = renderWithTheme(
      <KeyWords keyWords={keyWordsData} />,
    );
    const componentTitle = getByText("Key words");
    expect(getByTestId("heading")).toBeInTheDocument();
    expect(componentTitle).toBeInTheDocument();
  });

  it("should render with multiple core content list", () => {
    const { getAllByRole } = renderWithTheme(
      <KeyWords keyWords={keyWordsData} />,
    );

    const listItems = getAllByRole("listitem");
    expect(listItems).toHaveLength(2);
  });

  it("should render with null and non-null core content", () => {
    const { getAllByRole } = renderWithTheme(
      <KeyWords keyWords={[{ keyword: "test1", description: null }]} />,
    );

    const listItems = getAllByRole("listitem");
    expect(listItems).toHaveLength(1);
  });
});
