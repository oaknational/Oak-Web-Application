/**
 * @jest-environment node
 */
import { OakBox } from "@oaknational/oak-components";

import TeachersLayout from "./layout";

describe("core layout", () => {
  it("renders correctly", async () => {
    const result = await TeachersLayout({
      children: <OakBox>children</OakBox>,
    });

    expect(result).toMatchSnapshot();
  });
});
