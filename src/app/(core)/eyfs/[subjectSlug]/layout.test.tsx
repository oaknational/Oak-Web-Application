/**
 * @jest-environment node
 */

import { OakBox } from "@oaknational/oak-components";

import EYFSLayout from "./layout";

import OakError from "@/errors/OakError";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const mockEyfsPage = jest.fn().mockResolvedValue({
  subjectTitle: "Maths",
  units: [],
  subjectTabs: [],
});

jest.mock("@/node-lib/curriculum-api-2023", () => ({
  __esModule: true,
  default: {
    eyfsPage: () => mockEyfsPage(),
  },
}));

// Unmock the mock created in jest setup to get access to the notFound function
jest.unmock("next/navigation");

const render = renderWithProviders();

describe("eyfs layout", () => {
  it("renders correctly", async () => {
    const result = await EYFSLayout({
      params: Promise.resolve({ subjectSlug: "maths" }),
      children: <OakBox>children</OakBox>,
    });

    expect(result).toMatchSnapshot();
  });
  it("returns not found on error", async () => {
    mockEyfsPage.mockRejectedValueOnce(
      new OakError({ code: "curriculum-api/not-found" }),
    );
    expect(async () =>
      render(
        await EYFSLayout({
          params: Promise.resolve({ subjectSlug: "maths" }),
          children: <OakBox>children</OakBox>,
        }),
      ),
    ).rejects.toEqual(new Error("NEXT_HTTP_ERROR_FALLBACK;404"));
  });
});
