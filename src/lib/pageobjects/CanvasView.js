import BaseView from './BaseView'

export default class CanvasView extends BaseView {
  constructor( driver) {
    super(driver);
    this.elements = {
      greetings : {
        Android : "//android.widget.TextView[@text='foo']",
        iOS : "//UIAStaticText[contains(@name, 'foo')]",
        Web : "//span[contains(text(), 'foo')]"
      }
    }
  }
}
