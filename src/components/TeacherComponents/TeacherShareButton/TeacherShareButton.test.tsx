import { act, render, screen } from "@testing-library/react";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";
import userEvent from "@testing-library/user-event";

import { TeacherShareButton } from "./TeacherShareButton";

import { useCopyLink } from "@/hooks/useCopyLink";
import { renderHookWithProviders } from "@/__tests__/__helpers__/renderWithProviders";

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
    const { result } = renderHookWithProviders()(() =>
      useCopyLink({ linkToCopy: "test", copyActivated: () => {} }),
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

    const button = screen.getByRole("button", { name: "share me" });
    act(() => {
      button.click();
    });

    expect(clipboardWriteTextMock).toHaveBeenCalledWith("test");
  });

  it("calls copyActivated when the button is clicked the first time", async () => {
    const copyActivatedMock = jest.fn();

    const { result } = renderHookWithProviders()(() =>
      useCopyLink({
        linkToCopy: "test",
        copyActivated: copyActivatedMock,
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

    const button = screen.getByRole("button", { name: "share me" });

    await userEvent.click(button);
    expect(copyActivatedMock).toHaveBeenCalledTimes(1);
  });
});
