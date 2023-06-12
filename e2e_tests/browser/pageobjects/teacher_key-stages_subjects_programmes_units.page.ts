import Page from "./page";

/**
 * sub page containing specific selectors and methods for a specific page
 */
class TeacherKeyStagesSubjectsProgrammesUnitsPage extends Page {
  /**
   * define selectors using getter methods
   */

  public get unitList() {
    return $("aria/A list of units");
  }

  async selectSecondUnit() {
    const unitList = await this.unitList;
    const units = unitList.$$("li");
    const secondUnit = await units[1];

    await secondUnit.scrollIntoView(this.scrollOptions);
    await secondUnit.click();
  }
}

export default new TeacherKeyStagesSubjectsProgrammesUnitsPage();
