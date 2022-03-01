import { createMocks } from "node-mocks-http";
import handler from "../../../pages/api/hello";

describe("hello api", () => {
  it("has a handler", () => {
    const spy = jest.fn();

    const { req, res } = createMocks();

    res.status = () => {
      return {
        json: spy,
      };
    };

    handler(req, res);

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
