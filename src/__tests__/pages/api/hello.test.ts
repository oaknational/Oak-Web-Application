import handler from "../../../pages/api/hello";

describe("hello api", () => {
  it("has a handler", () => {
    const spy = jest.fn();
    const req = {};
    const res = {
      status: () => {
        return {
          json: spy,
        };
      },
    };

    /*eslint-disable-next-line @typescript-eslint/ban-ts-comment */
    // @ts-ignore
    handler(req, res);

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
