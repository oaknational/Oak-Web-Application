import {
  PublicSubscriptionStatusSourceOfStatusEnum,
  PublicSubscriptionStatusStatusEnum,
} from "@hubspot/api-client/lib/codegen/communication_preferences";

import { getisSubscribed } from "./index";

describe("getIsSubscribed", () => {
  it("should return true when subscription status is set", async () => {
    const result = getisSubscribed(
      [
        {
          name: "School Support",
          status: PublicSubscriptionStatusStatusEnum.Subscribed,
          description: "",
          id: "1",
          sourceOfStatus:
            PublicSubscriptionStatusSourceOfStatusEnum.SubscriptionStatus,
        },
      ],
      "School Support",
    );
    expect(result).toBe(true);
  });
  it("should return false when subscription status is not set", async () => {
    const result = getisSubscribed(
      [
        {
          name: "School Support",
          status: PublicSubscriptionStatusStatusEnum.NotSubscribed,
          description: "",
          id: "1",
          sourceOfStatus:
            PublicSubscriptionStatusSourceOfStatusEnum.SubscriptionStatus,
        },
      ],
      "School Support",
    );
    expect(result).toBe(false);
  });
});
