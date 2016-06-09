import test from 'ava'
import LoginView from '../lib/pageobjects/LoginView'
import CanvasView from '../lib/pageobjects/CanvasView'
require('../lib/setup');
var expect = require('chai').expect;

test('POC App Login and view canvas', async t => {
  let driver = t.context.driver;

  // Login and view app
  let loginView = new LoginView(driver);
  await loginView.click('loginButton');
  await loginView.clickViewAppButton();

  // Verify that we are on canvas view
  let canvasView = new CanvasView(driver);
  await canvasView.verifyElementPresent('greetings');

  // Verify greeting
  expect(await canvasView.getText('greetings')).to.contain('Hello');
});
