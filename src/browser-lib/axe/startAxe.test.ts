import startAxe from "./startAxe";

const mockAxe = jest.fn();
jest.mock("@axe-core/react", () => ({
  __esModule: true,
  default: mockAxe,
}));

describe("axe", () => {
  const originalEnv = process.env;
  afterEach(() => {
    process.env = originalEnv;
  });
  test("does not call axe() in production", async () => {
    process.env = { NODE_ENV: "production" };
    await startAxe();
    expect(mockAxe).not.toHaveBeenCalled();
  });
  test("calls axe() in development", async () => {
    process.env = { NODE_ENV: "development" };
    await startAxe();
    expect(mockAxe).toHaveBeenCalled();
  });
});
