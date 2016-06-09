import config from 'config'

export default class BaseView {

  constructor( driver ) {
    this.driver = driver;
    this.elements = {};
    this.url = config.get( 'baseUrl' );
    this.elementWaitTimeMs = config.get('explicitWaitMs');
    this.pollingFreq = config.get('pollingFreqMs');
  }

  async click(elementName) {
    let selector = this.elements[elementName][process.env.platformType];
    await this.driver.waitForExist(selector);
    await this.driver.click(selector);
  }

  async getText(elementName) {
    let selector = this.elements[elementName][process.env.platformType];
    await this.driver.waitForExist(selector);
    return await this.driver.getText(selector);
  }

  async verifyElementPresent(elementName) {
    let selector = this.elements[elementName][process.env.platformType];
    await this.driver.waitForExist(selector);
  }
}
