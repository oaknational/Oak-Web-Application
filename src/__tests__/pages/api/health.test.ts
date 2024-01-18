import { describe, expect, it } from "vitest";
import { createMocks } from "node-mocks-http";

import handler from "../../../pages/api/health";

describe("/api/health", () => {
  it("has a handler", () => {
    const spy = vi.fn();

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
