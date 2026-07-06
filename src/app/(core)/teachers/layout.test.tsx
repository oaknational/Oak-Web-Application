/**
 * @jest-environment node
 */
import { OakBox } from "@oaknational/oak-components";

import TeachersLayout from "./layout";

import { topNavFixture } from "@/node-lib/curriculum-api-2023/fixtures/topNav.fixture";

const mockTopNav = jest.fn().mockResolvedValue(topNavFixture);
jest.mock("@/node-lib/curriculum-api-2023", () => ({
  __esModule: true,
  default: {
    topNav: () => mockTopNav(),
  },
}));

describe("core layout", () => {
  it("renders correctly", async () => {
    const result = await TeachersLayout({
      children: <OakBox>children</OakBox>,
    });

    expect(result).toMatchSnapshot();
  });
});
