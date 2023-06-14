import Page from "./page";

/**
 * sub page containing specific selectors and methods for a specific page
 */
class TeacherKeyStagesSubjectsProgrammesPage extends Page {
  /**
   * define selectors using getter methods
   */

  public get tierFoundation() {
    return $("=Foundation");
  }

  async selectTierFoundation() {
    const tierFoundation = await this.tierFoundation;

    await tierFoundation.scrollIntoView(this.scrollOptions);
    await tierFoundation.click();
  }
}

export default new TeacherKeyStagesSubjectsProgrammesPage();
