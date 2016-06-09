import BaseView from './BaseView'
import sleep from 'sleep-promise'
import constants from '../constants'

export default class LoginView extends BaseView {
  constructor( driver) {
    super(driver);
    this.elements = {
      loginButton : {
        Android : "//android.widget.TextView[@text='login']",
        iOS : "//UIAApplication[1]/UIAWindow[1]//UIAElement[contains(@name, 'login')]",
        Web : "//span[contains(text(), 'Log In')]"
      },
      viewAppButton : {
        Android : "//android.widget.TextView[@text='login]",
        iOS : "//UIAApplication[1]/UIAWindow[1]//UIAElement[contains(@name, 'login')]",
        Web : "//span[contains(text(), 'Log In')]"
      }
    };

    if(process.env.platformType === constants.platformType.Web) {
     driver.waitForExist(this.elements.loginButton[constants.platformType.Web]);
    }
  }

  /*
    We have this abstracted to handle the button UI position change after it appears.
  */
  async clickViewAppButton() {
    if(process.env.platformType === constants.platformType.Web) {await sleep(2000); }

    await this.click("viewAppButton");
    await sleep(1000);
  }
}
