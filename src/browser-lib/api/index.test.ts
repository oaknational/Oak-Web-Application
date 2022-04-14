import useApi from ".";

const oakFetchSpy = jest.fn();

jest.mock("./useOakFetch", () => ({
  __esModule: true,
  default: jest.fn(() => oakFetchSpy),
}));

const api = useApi();
describe("browser-lib/api/index", () => {
  it("should have /login method which calls /api/login", () => {
    api["/login"]({ accessToken: "123" });
    expect(oakFetchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "/api/login",
      })
    );
  });
});
