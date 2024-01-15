import { render } from "@testing-library/react";

import ConditionalScript from "./ConditionalScript";

const Mock = jest.fn();
jest.mock("next/script", () => ({
  __esModule: true,
  default: (...props: []) => Mock(...props),
}));

describe("<ConditionalScript />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("loads if shouldLoad true", () => {
    render(<ConditionalScript shouldLoad={true} src="foo" />);
    expect(Mock).toHaveBeenCalledWith({ src: "foo" }, {});
  });
  test("does not load if shouldLoad false", () => {
    render(<ConditionalScript shouldLoad={false} src="foo" />);
    expect(Mock).not.toHaveBeenCalled();
  });
});
