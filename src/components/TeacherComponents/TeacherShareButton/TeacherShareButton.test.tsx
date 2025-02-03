import { act, render, screen } from "@testing-library/react";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import { TeacherShareButton } from "./TeacherShareButton";

describe("TeacherShareButton", () => {
  it("renders", () => {
    render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <TeacherShareButton
          shareUrl={"test"}
          variant="primary"
          label="share me"
        />
      </OakThemeProvider>,
    );
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("copies a link to the clipboard when the button is clicked", async () => {
    // Mock the clipboard API
    const clipboardWriteTextMock = vi.fn();
    Object.assign(navigator, {
      clipboard: {
        writeText: clipboardWriteTextMock,
      },
    });

    render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <TeacherShareButton
          shareUrl={"test"}
          variant="primary"
          label="share me"
        />
      </OakThemeProvider>,
    );

    const button = screen.getByRole("button");
    act(() => {
      button.click();
    });

    expect(clipboardWriteTextMock).toHaveBeenCalledWith("test");
  });

  it("calls shareActivated when the button is clicked the first time", async () => {
    const shareActivatedMock = vi.fn();

    render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <TeacherShareButton
          shareUrl={"test"}
          shareActivated={shareActivatedMock}
          variant="primary"
          label="share me"
        />
      </OakThemeProvider>,
    );

    const button = screen.getByRole("button");

    act(() => {
      button.click();
    });
    expect(shareActivatedMock).toHaveBeenCalledTimes(1);
    act(() => {
      button.click();
    });
    expect(shareActivatedMock).toHaveBeenCalledTimes(1);
  });
});
