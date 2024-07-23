import { render } from "@testing-library/react";

import useReferrer, { referrerSources } from "./useReferrer";

const TestComponent = () => {
  const referrer = useReferrer();
  return <div data-testid="comp">{referrer}</div>;
};

describe("useReferrer()", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("internal source", () => {
    jest
      .spyOn(document, "referrer", "get")
      .mockReturnValue("https://thenational.academy/");
    jest.spyOn(window, "location", "get").mockReturnValue({
      ...window.location,
      hostname: "thenational.academy",
    });
    const { getByTestId } = render(<TestComponent />);
    expect(getByTestId("comp")).toHaveTextContent(referrerSources.internal);
  });

  test("direct source", () => {
    jest.spyOn(document, "referrer", "get").mockReturnValue("");
    const { getByTestId } = render(<TestComponent />);
    expect(getByTestId("comp")).toHaveTextContent(referrerSources.direct);
  });
  test("google source", () => {
    jest
      .spyOn(document, "referrer", "get")
      .mockReturnValue("https://google.com");
    const { getByTestId } = render(<TestComponent />);
    expect(getByTestId("comp")).toHaveTextContent(referrerSources.google);
  });
  test("external source", () => {
    jest
      .spyOn(document, "referrer", "get")
      .mockReturnValue("https://example.com");

    const { getByTestId } = render(<TestComponent />);
    expect(getByTestId("comp")).toHaveTextContent(referrerSources.external);
  });
});
