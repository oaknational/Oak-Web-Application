import { PupilNetworkClient } from "./network";

describe(PupilNetworkClient, () => {
  const client = new PupilNetworkClient();

  it("should be defined", () => {
    expect(client).toBeDefined();
  });
});
