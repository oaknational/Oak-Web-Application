import { createMocks } from "node-mocks-http";

import handler from "../../../pages/api/hello";

describe("hello api", () => {
  it("has a handler", () => {
    const spy = jest.fn();

    const { req, res } = createMocks();

    const spiedRes = {
      ...res,
      status: () => {
        return {
          json: spy,
        };
      },
    };

    /**
     * @see https://github.com/howardabrams/node-mocks-http/issues/245
     */
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    handler(req, spiedRes);

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
