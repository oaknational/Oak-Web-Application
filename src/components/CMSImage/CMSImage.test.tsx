import { render, screen } from "@testing-library/react";

import { mockImageAsset } from "../../__tests__/__helpers__/cms";

import CMSImage from "./CMSImage";

describe("CMSImage", () => {
  it("renders an image", () => {
    const mockImage = mockImageAsset();
    render(<CMSImage image={mockImage} />);

    const img = screen.getByRole("img");
    expect(img).toBeInTheDocument();
  });
});
