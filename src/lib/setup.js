import test from 'ava'
import readConfig from 'read-config'
import config from 'config'
import constants from './constants'
import appRootPath from 'app-root-path'

var chai        = require('chai');
var expect      = chai.expect;
var webdriverio = require('webdriverio');

test.beforeEach(async t => {
  // Pre-set test status
  t.context.testStatus = false;

  t.context.desired = readConfig(appRootPath + '/' + process.env.driverCapabilities);
  // Set app path per local config
  let appBinDir = config.get('appBinariesDir');
  if(process.env.platformType !== constants.platformType.Web) {
    if (process.env.SAUCE_USERNAME){
      t.context.desired.app = 'sauce-storage:' + t.context.desired.app;
      // t.context.desired['autoAcceptAlerts'] = true;
      t.context.desired['waitForAppScript'] = true;
    }
    else if(appBinDir.toString().startsWith('http')) {
      t.context.desired.app = appBinDir + '/' + t.context.desired.app;
    } else if(process.env.appBinariesDir) {
      t.context.desired.app = process.env.appBinariesDir + '/' + t.context.desired.app;
    } else {
      t.context.desired.app = appRootPath + '/' + appBinDir + '/' + t.context.desired.app;
    }
  }

  let options = {
    desiredCapabilities: t.context.desired,
    waitforTimeout: 20000,
    host: process.env.driverHost,
    port: process.env.driverPort
  };

  // If sauce details are provided run on sauceLabs
  if (process.env.SAUCE_USERNAME){
    options.user = process.env.SAUCE_USERNAME;
    options.key = process.env.SAUCE_ACCESS_KEY;
  }

  t.context.driver = webdriverio.remote(options);
  await t.context.driver.init();

  let title = t.title;
  title = title.replace('beforeEach for ','');
  t.context.desired.name = title + ' on ' + process.env.platformType;

  // Open the application on web-browser or on the device
  if(process.env.platformType === constants.platformType.Web) {
    await t.context.driver.url(config.get('baseUrl'));
  }
});

test.afterEach(async t => {
  t.context.testStatus = true;
});

test.afterEach.always(async t => {
  await t.context.driver.end();
  if (process.env.SAUCE_USERNAME) {
    await t.context.driver.sauceJobStatus(t.context.testStatus);
  }
});
