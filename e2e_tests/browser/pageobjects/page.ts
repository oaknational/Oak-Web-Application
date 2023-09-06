import type ScrollIntoViewOptions from "webdriverio/build/commands/element/scrollIntoView.d.ts";

/**
 * main page object containing all methods, selectors and functionality
 * that is shared across all page objects
 */
export default class Page {
  /**
   * Opens a sub page of the page.
   *
   * Note that this only apply to pages with non-dynamic paths.
   * Pages with dynamic paths must be navigated to via the UI.
   *
   * @param path path of the sub page (e.g. /path/to/page.html)
   */
  public open(path: string) {
    return browser.url(path);
  }

  get confirmicFrameContainer() {
    return $("#mtm-frame-container");
  }

  // Config for scrollIntoView behaviour.
  // https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
  // Public instance field.
  scrollOptions: ScrollIntoViewOptions = {
    block: "center",
    inline: "center",
    behavior: "smooth",
  };

  // Close the Confirmic overlay if present.
  async closeConfirmicOverlay() {
    // Wait for the Confirmic overlay to turn up,
    // it may not, depending on the cookie situation.
    try {
      await browser.waitUntil(
        async () => await (await this.confirmicFrameContainer).isExisting(),
        {
          timeout: 5000,
          timeoutMsg: "Confirmic overlay did not display.",
        },
      );
    } catch (error) {
      console.log("Confirmic overlay message: ", error.message);
      // The overlay didn't turn up, so this function has nothing left to do.
      return;
    }

    const frameContainer = await this.confirmicFrameContainer;
    // Switch to Confirmic modal frame.
    // There are two iframes, we want the first one.
    const iframe = await frameContainer.$("iframe");
    await browser.switchToFrame(iframe);

    // Get the cookie consent buttons, and click the one of the right.
    // This should work for the "yes" and "accept changes" button flavours.
    const buttons = await $$("button");
    const farRightButton = await buttons[buttons.length - 1];
    await farRightButton.click();

    // Switch back to the top-level parent frame.
    await browser.switchToFrame(null);

    // Wait for the overlay to go away.
    try {
      await browser.waitUntil(
        async () =>
          (await (await this.confirmicFrameContainer).isExisting()) !== true,
        {
          timeout: 5000,
          timeoutMsg: "Expected Confirmic overlay to go away.",
        },
      );
    } catch (error) {
      // The overlay is gone, nothing to do.
      // console.log("Confirmic overlay dismissal message: ", error.message);
      return;
    }
  }
}
