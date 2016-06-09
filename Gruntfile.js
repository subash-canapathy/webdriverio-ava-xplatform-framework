var constants = require('./src/lib/constants');
var appRootPath = require('app-root-path');
var config = require('config');

module.exports = function (grunt) {
  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);

  // configure tasks
  grunt.initConfig({
    env: {
      options: {
        NODE_CONFIG_DIR : appRootPath + '/config'
      },
      local: {
        driverHost : config.get('driverHost'),
        driverPort : function() { return grunt.option('driverPort') },
        driverCapabilities : function() { return grunt.option('driverCapabilities') },
        platformType : function() { return grunt.option('platformType') }
      },
      sauce: {
        SAUCE_USERNAME : config.get('sauce.username'),
        SAUCE_ACCESS_KEY : config.get('sauce.accessKey'),
        driverHost : config.get('sauce.hostname'),
        driverPort : config.get('sauce.port'),
        driverCapabilities : function() { return grunt.option('driverCapabilities') },
        platformType : function() { return grunt.option('platformType') }
      }
    },

    shell: {
      // Remove --serial if you want multi level concurrency and have a sauce license with adequate parallel slots
      test: {
        command: `npm run ava -- \"src/tests/**/*.js\" --fail-fast=false --verbose --timeout=${config.get("testRunnerTimeout")} --serial`
      },
      bvt: {
        command: `npm run ava -- \"src/tests/**/*.js\" --match='@bvt*' --fail-fast=false --verbose --timeout=${config.get("testRunnerTimeout")} --serial`
      }
    },

    concurrent: {
      all: ['run_Web', 'run_Android', 'run_iOS']
    }
  });

  // Prevent grunt from failing fast on warnings
  grunt.option('force', true);

  // Register driver capabilities and type for each test runtime combination
  grunt.registerTask('Nexus5', function(n) {
    grunt.option('driverCapabilities', 'src/capabilities/nexus5-capabilities.json');
    grunt.option('platformType', constants.platformType.Android);
    grunt.option('driverPort', config.get('appiumAndroidPort'));
  });
  grunt.registerTask('iPhone6', function(n) {
    grunt.option('driverCapabilities', 'src/capabilities/iphone6-capabilities.json');
    grunt.option('platformType', constants.platformType.iOS);
    grunt.option('driverPort', config.get('appiumiOSPort'));
  });
  grunt.registerTask('Chrome', function(n) {
    grunt.option('driverCapabilities', 'src/capabilities/chrome-mac-capabilities.json');
    grunt.option('platformType', constants.platformType.Web);
    grunt.option('driverPort', config.get('seleniumPort'));
  });

  // Register test suite tasks, all of these should be runnable in parallel
  grunt.registerTask('run_Web', ['Chrome', 'env:local', 'shell:test']);
  grunt.registerTask('run_Android', ['Nexus5', 'env:local', 'shell:test']);
  grunt.registerTask('run_iOS', ['iPhone6', 'env:local', 'shell:test']);

  // Register default task
  grunt.registerTask('default', ['concurrent:all']);
};
