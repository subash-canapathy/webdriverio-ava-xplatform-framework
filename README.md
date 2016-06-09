# Cross Platform UI Test Framework - WebdriverIO+AVA+Grunt

UI test framework bootstrap for building tests for apps built using [react-native/react](https://facebook.github.io/react-native/), [cordova](https://cordova.apache.org/), [codenameone](https://www.codenameone.com/) or equivalent libraries, where dev code is write once build for all 3 platforms.
The framework's intention is to follow the dev paradigm and make sure we have common tests across all three platforms.

## Running tests locally

For local dev setup make sure the following are running on a Mac. <i>(Win/Linux - no iOS emulator support)</i>
* selenium standalone server on port 4444(default) - <i>this is required if your project has web app too </i>
* appium server on port 4723 for iOS. <i> make sure you have a device or emulator listed on `xcrun simctl list`</i>
* appium server on port 4724 for Android. <i> make sure you have a device or emulator listed on `adb devices`</i>

### Sample appium server startup commands for iOS and Android

<b>Android:</b>
`appium --port 4723 --command-timeout "7200" --session-override --debug-log-spacing --automation-name "Appium" --platform-name "Android" --platform-version "5.1" -bp 5728`

<b>iOS:</b>
`appium --port 4724 --command-timeout "7200" --session-override --debug-log-spacing --platform-version "9.3" --platform-name "iOS" --no-reset --device-name "iPhone 6" --native-instruments-lib -bp 5731`

## Running tests using SauceLabs

Use the ENV variables
* SAUCE_USERNAME
* SAUCE_ACCESS_KEY

in the gruntfile or set them on the shell to run tests on sauce labs.

## Usage

`npm install`

then run suites using: <i>npm run grunt <task-name> </i>

`npm run grunt run_Web` - runs tests on web.

`npm run grunt run_Android` - runs tests on android.

`npm run grunt run_iOS` - runs tests on android.

`npm run grunt` - run tests on web and android in parallel.

## Configuration

App/Test configuration is set through the node-config standard through NODE_ENV.
`./config/default.json` holds the common configuration and the individual ENV name json files override and add to the default config.

### Capabilities

Device capabilities are defined as separate json configuration objects inside `./src/capabilities`

### Suites

Suites are organized in grunt.

```js
grunt.registerTask('run_Web', ['Chrome', 'env:local', 'shell:test']);
````

here the sequence of the tasks determine the context given to the test suite. The test suite and test cases are common for all platforms.

For eg: the Chrome and env:local are defined this way:

```js
grunt.registerTask('Chrome', function(n) {
  grunt.option('driverCapabilities', 'src/capabilities/chrome-mac-capabilities.json');
  grunt.option('platformType', constants.platformType.Web);
  grunt.option('driverPort', config.get('seleniumPort'));
});
````

```js
env: {
  local: {
    driverHost : config.get('driverHost'),
    driverPort : function() { return grunt.option('driverPort') },
    driverCapabilities : function() { return grunt.option('driverCapabilities') },
    platformType : function() { return grunt.option('platformType') }
  }
}
````

## Page objects

Page objects are defined in ES6 class standard with driver as the only constructor parameter required.
All page objects inherit from [BaseView](./src/lib/pageobjects/BaseView.js)

TODO: use a variation [pageObject paradigm suggested by webdriverio](https://github.com/webdriverio/webdriverio/tree/master/examples/pageobject) - yet using ES6 classes.

## Ava tests

Tests are written using [Ava](https://github.com/avajs/ava)

before and after hooks + webdriver vending and state/context management is handled by [setup.js](./src/lib/setup.js)
all tests have access to ava's `t.context.` objects which can be set on before/after hooks and will behave like ThreadLocals to the individual tests.
