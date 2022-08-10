import startHubspot from "./startHubspot";

const scriptAlreadyLoaded = jest.fn(() => false);
jest.mock("../../utils/scriptAlreadyLoaded.ts", () => ({
  __esModule: true,
  default: () => scriptAlreadyLoaded(),
}));
const documentCreateElement = jest.spyOn(document, "createElement");

describe("startHubspot.ts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("should call createElement", () => {
    startHubspot({ scriptDomain: "hs-test.domain", portalId: "portal-id-123" });
    expect(documentCreateElement).toHaveBeenCalled();
  });
  test("should not call createElement if already loaded", () => {
    scriptAlreadyLoaded.mockImplementationOnce(() => true);
    startHubspot({ scriptDomain: "hs-test.domain", portalId: "portal-id-123" });
    expect(documentCreateElement).not.toHaveBeenCalled();
  });
});
