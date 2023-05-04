import Page from "./page";

/**
 * sub page containing specific selectors and methods for a specific page
 */
class TeacherKeyStagesSubjectsPage extends Page {
  /**
   * define selectors using getter methods
   */

  public get subjectMaths() {
    // This is a pretty fragile selector, but there is very little
    // semantic page structure to use.
    return $("=Maths");
  }

  async selectMaths() {
    const subjectMaths = await this.subjectMaths;

    await subjectMaths.click();
  }
}

export default new TeacherKeyStagesSubjectsPage();
