import startHubspot from "./startHubspot";

const getOakGlobals = jest.fn(() => ({
  hubspot: {
    scriptLoaded: false,
  },
}));
jest.mock("../oak-globals/oakGlobals.ts", () => ({
  __esModule: true,
  ...jest.requireActual("../oak-globals/oakGlobals.ts"),
  default: () => getOakGlobals(),
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
    getOakGlobals.mockImplementationOnce(() => ({
      hubspot: {
        scriptLoaded: true,
      },
    }));
    startHubspot({ scriptDomain: "hs-test.domain", portalId: "portal-id-123" });
    expect(documentCreateElement).not.toHaveBeenCalled();
  });
});
