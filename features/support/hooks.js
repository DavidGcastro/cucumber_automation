// hooks.js
//use same config as wd test
const config = require('../../wd/conf/single.conf').config;
const username = process.env.BROWSERSTACK_USERNAME || config.user;
const accessKey = process.env.BROWSERSTACK_ACCESS_KEY || config.key;
const { Builder } = require('selenium-webdriver');
const { Before, After } = require('cucumber');

// Create sesh
const createBrowserStackSession = function(config, capabilities) {
  return new Builder()
    .usingServer('http://' + config.server + '/wd/hub')
    .withCapabilities(capabilities)
    .build();
};

//these hooks are using the Before and After functions provided by Cucumber.

//"Hooks are blocks of code that can run at various points in the Cucumber execution cycle.They are typically used for setup and teardown of the environment before and after each scenario."
const myHooks = function() {
  var bs_local = null;
  //Set something to World, so it can be used on every test after, destroy session after.
  Before(function(scenario, callback) {
    //makes global
    var world = this;
    var task_id = parseInt(process.env.TASK_ID || 0);
    //capabilities are what virtual environments these tests would run on via browserstack
    var capabilities = config.capabilities[task_id];
    capabilities['browserstack.user'] = username;
    capabilities['browserstack.key'] = accessKey;
    // if we are testing on our machine
    if (capabilities['browserstack.local']) {
      // Code to start browserstack local before start of test and stop browserstack local after end of test
      bs_local = new browserstack.Local();
      bs_local.start({ key: accessKey }, function(error) {
        if (error) return console.log(error.red);

        world.driver = createBrowserStackSession(config, capabilities);
        callback();
      });
    }

    //no we are using browserstack
    else {
      world.driver = createBrowserStackSession(config, capabilities);
      //why a callback?
      callback();
    }
  });

  //after tests are done destroy session
  After(function(scenario, callback) {
    this.driver.quit().then(function() {
      if (bs_local) {
        bs_local.stop(callback);
      } else callback();
    });
  });
};

module.exports = myHooks;
