import Page from "./page";

const PAGE_PATH = "/teachers";

const VALID_KEY_STAGE_IDS = ["KS1", "KS2", "KS3", "KS4"];

/**
 * sub page containing specific selectors and methods for a specific page
 */
class TeacherHomePage extends Page {
  /**
   * define selectors using getter methods
   */
  public get title() {
    return $("h1");
  }

  public get keyStageNav() {
    return $("aria/key stages and year groups");
  }

  /**
   * overwrite specific options to adapt it to page object
   */
  public open() {
    return super.open(PAGE_PATH);
  }

  async selectKeyStage(keyStageId: string) {
    if (!VALID_KEY_STAGE_IDS.includes(keyStageId)) {
      throw new Error(`Invalid key stage id: ${keyStageId}`);
    }

    const keyStageNav = await this.keyStageNav;

    // https://webdriver.io/docs/selectors/#link-text
    const keyStageLink = await keyStageNav.$(`=${keyStageId}`);

    await keyStageLink.click();
  }
}

export default new TeacherHomePage();
