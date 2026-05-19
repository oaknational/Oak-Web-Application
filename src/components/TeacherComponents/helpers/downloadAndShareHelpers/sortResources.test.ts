import { sortShareResources } from "./sortResources";

import * as shareResources from "@/node-lib/curriculum-api-2023/fixtures/shareableResources.fixture";

describe("sortResources", () => {
  it("sorts share resources", () => {
    const sorted = sortShareResources(shareResources.allResources);
    expect(sorted[0]?.type).toBe("video");
  });
});
