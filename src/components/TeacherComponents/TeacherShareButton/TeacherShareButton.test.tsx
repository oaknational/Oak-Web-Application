import { act, render, renderHook, screen } from "@testing-library/react";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";
import userEvent from "@testing-library/user-event";

import { TeacherShareButton } from "./TeacherShareButton";
import { useTeacherShareButton } from "./useTeacherShareButton";

// Mock the clipboard API
const clipboardWriteTextMock = jest.fn();
Object.assign(navigator, {
  clipboard: {
    writeText: clipboardWriteTextMock,
  },
});

describe("TeacherShareButton", () => {
  it("renders", () => {
    render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <TeacherShareButton
          shareUrl={"test"}
          variant="primary"
          handleClick={() => {}}
          label="share me"
        />
      </OakThemeProvider>,
    );
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("copies a link to the clipboard when the button is clicked", async () => {
    const { result } = renderHook(() =>
      useTeacherShareButton({ shareUrl: "test", shareActivated: () => {} }),
    );

    render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <TeacherShareButton
          shareUrl={"test"}
          variant="primary"
          label="share me"
          handleClick={result.current.handleClick}
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
    const shareActivatedMock = jest.fn();

    const { result } = renderHook(() =>
      useTeacherShareButton({
        shareUrl: "test",
        shareActivated: shareActivatedMock,
      }),
    );

    render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <TeacherShareButton
          shareUrl={"test"}
          variant="primary"
          label="share me"
          handleClick={result.current.handleClick}
        />
      </OakThemeProvider>,
    );

    const button = screen.getByRole("button");

    await userEvent.click(button);
    expect(shareActivatedMock).toHaveBeenCalledTimes(1);
  });
});
