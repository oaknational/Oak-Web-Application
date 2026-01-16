import userEvent from "@testing-library/user-event";

import FocusWrap from ".";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["theme", "oakTheme"]);

describe("Component - subject phase picker", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("onWrapEnd", async () => {
    const onWrapStart = jest.fn();
    const onWrapEnd = jest.fn();
    const { getByTestId } = render(
      <FocusWrap onWrapStart={onWrapStart} onWrapEnd={onWrapEnd}>
        <button data-testid="first">one</button>
        <button data-testid="second">two</button>
        <button data-testid="third">three</button>
      </FocusWrap>,
    );
    getByTestId("first").focus();
    expect(getByTestId("first").matches(":focus")).toBe(true);
    expect(onWrapStart).toHaveBeenCalledTimes(0);
    expect(onWrapEnd).toHaveBeenCalledTimes(0);

    await userEvent.tab();
    expect(getByTestId("second").matches(":focus")).toBe(true);
    expect(onWrapStart).toHaveBeenCalledTimes(0);
    expect(onWrapEnd).toHaveBeenCalledTimes(0);

    await userEvent.tab();
    expect(getByTestId("third").matches(":focus")).toBe(true);
    expect(onWrapStart).toHaveBeenCalledTimes(0);
    expect(onWrapEnd).toHaveBeenCalledTimes(0);

    await userEvent.tab();
    expect(onWrapStart).toHaveBeenCalledTimes(0);
    expect(onWrapEnd).toHaveBeenCalledTimes(1);
  });

  test("onWrapStart", async () => {
    const onWrapStart = jest.fn();
    const onWrapEnd = jest.fn();
    const { getByTestId } = render(
      <FocusWrap onWrapStart={onWrapStart} onWrapEnd={onWrapEnd}>
        <button data-testid="first">one</button>
        <button data-testid="second">two</button>
        <button data-testid="third">three</button>
      </FocusWrap>,
    );

    getByTestId("third").focus();
    expect(getByTestId("third").matches(":focus")).toBe(true);
    expect(onWrapStart).toHaveBeenCalledTimes(0);
    expect(onWrapEnd).toHaveBeenCalledTimes(0);

    await userEvent.tab({ shift: true });
    expect(getByTestId("second").matches(":focus")).toBe(true);
    expect(onWrapStart).toHaveBeenCalledTimes(0);
    expect(onWrapEnd).toHaveBeenCalledTimes(0);

    await userEvent.tab({ shift: true });
    expect(getByTestId("first").matches(":focus")).toBe(true);
    expect(onWrapStart).toHaveBeenCalledTimes(0);
    expect(onWrapEnd).toHaveBeenCalledTimes(0);

    await userEvent.tab({ shift: true });
    expect(onWrapStart).toHaveBeenCalledTimes(1);
    expect(onWrapEnd).toHaveBeenCalledTimes(0);
  });
});
