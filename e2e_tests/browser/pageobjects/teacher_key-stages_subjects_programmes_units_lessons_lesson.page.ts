import Page from "./page";

/**
 * sub page containing specific selectors and methods for a specific page
 */
class TeacherKeyStagesSubjectsProgrammesUnitsLessonsPage extends Page {
  /**
   * define selectors using getter methods
   */

  public get transcriptControl() {
    return $('button[aria-label="Show video transcript"]'); // TODO: this needs updating for the current aria label
  }

  public get transcriptContents() {
    return $("aria/The video transcript"); // TODO: check this matches the current aria label for the transcript
  }

  async toggleTranscript() {
    const transcriptControl = await this.transcriptControl;

    await transcriptControl.click();
  }

  async getTranscriptFirstParagraph() {
    const transcriptContents = await this.transcriptContents;
    const transcriptParagraphs = transcriptContents.$$("p");
    const firstParagraph = await transcriptParagraphs[0];

    // Make sure the first paragraph is visible before returning it.
    // This guards against content that is programmatically present, but not displayed properly.
    await firstParagraph.scrollIntoView(this.scrollOptions);
    await firstParagraph.waitForDisplayed();

    return firstParagraph;
  }
}

export default new TeacherKeyStagesSubjectsProgrammesUnitsLessonsPage();
