import { render, screen } from "@testing-library/react";
import { DefaultTheme, ThemeProvider } from "styled-components";

import { mockImageAsset } from "../../__tests__/__helpers__/cms";

import CMSImage from "./CMSImage";

describe("CMSImage", () => {
  it("renders an image", () => {
    const mockImage = mockImageAsset();
    render(
      <ThemeProvider
        theme={
          {
            colors: { pastelTurqoise: "#123456" },
            contrastColors: { pastelTurqoise: "white" },
          } as DefaultTheme
        }
      >
        <CMSImage image={mockImage} />
      </ThemeProvider>
    );

    const img = screen.getByRole("img");
    expect(img).toBeInTheDocument();
  });
});
