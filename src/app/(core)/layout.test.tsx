/**
 * @jest-environment node
 */
import { OakBox } from "@oaknational/oak-components";

import CoreLayout from "./layout";

import { topNavFixture } from "@/node-lib/curriculum-api-2023/fixtures/topNav.fixture";
import OakError from "@/errors/OakError";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const mockTopNav = jest.fn().mockResolvedValue(topNavFixture);
jest.mock("@/node-lib/curriculum-api-2023", () => ({
  __esModule: true,
  default: {
    topNav: () => mockTopNav(),
  },
}));

jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
}));

const render = renderWithProviders();

describe("core layout", () => {
  it("renders correctly", async () => {
    const result = await CoreLayout({ children: <OakBox>children</OakBox> });

    expect(result).toMatchSnapshot();
  });
  it("returns not found on error", async () => {
    mockTopNav.mockRejectedValueOnce(
      new OakError({ code: "curriculum-api/not-found" }),
    );
    expect(async () =>
      render(
        await CoreLayout({
          children: <OakBox>children</OakBox>,
        }),
      ),
    ).rejects.toEqual(new Error("NEXT_HTTP_ERROR_FALLBACK;404"));
  });
});
