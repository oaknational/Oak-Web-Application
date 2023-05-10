import Page from "./page";

/**
 * sub page containing specific selectors and methods for a specific page
 */
class TeacherKeyStagesSubjectsProgrammesUnitsLessonsPage extends Page {
  /**
   * define selectors using getter methods
   */

  public get lessonList() {
    return $("aria/A list of lessons");
  }

  async selectFirstLesson() {
    const lessonList = await this.lessonList;
    const lessons = lessonList.$$("li");
    const firstLesson = await lessons[0];

    await firstLesson.scrollIntoView(this.scrollOptions);
    await firstLesson.click();
  }
}

export default new TeacherKeyStagesSubjectsProgrammesUnitsLessonsPage();
