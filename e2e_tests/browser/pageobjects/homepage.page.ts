import Page from "./page";

/**
 * sub page containing specific selectors and methods for a specific page
 */
class HomePage extends Page {
  /**
   * define selectors using getter methods
   */
  public get title() {
    return $("h1");
  }

  // /**
  //  * a method to encapsulate automation code to interact with the page
  //  * e.g. to login using username and password
  //  */
  // public async login(username: string, password: string) {
  //   await this.inputUsername.setValue(username);
  //   await this.inputPassword.setValue(password);
  //   await this.btnSubmit.click();
  // }

  /**
   * overwrite specific options to adapt it to page object
   */
  public open() {
    return super.open("/");
  }
}

export default new HomePage();
