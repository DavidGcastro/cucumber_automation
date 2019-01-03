var chai = require('chai'),
  //Chai as Promised extends Chai with a fluent language for asserting facts about promises.
  //IE: return doSomethingAsync().should.eventually.equal("foo");
  chaiAsPromised = require('chai-as-promised'),
  wd = require('wd'),
  colors = require('colors'),
  child_process = require('child_process'),
  browserstack = require('browserstack-local');

chai.use(chaiAsPromised);
chai.should();
//By default, the promises returned by Chai as Promised's assertions are regular Chai assertion objects,
//extended with a single then method derived from the input promise. To change this behavior,
//for instance to output a promise with more useful sugar methods such as are found in most promise libraries,
//you can override chaiAsPromised.transferPromiseness
chaiAsPromised.transferPromiseness = wd.transferPromiseness;

// wd.addPromiseChainMethod(name, method): This is for promise returning methods USING CHAIN internally.
//This will only add the method to the promiseChain browser prototype(but neither to async nor to promise browser prototypes).
// If you are only using the promise chain api, you should probably stick with wd.addPromiseChainMethod.

// adding custom promise chain method

wd.addPromiseChainMethod('onQuit', function(done) {
  if (done) done();
  return this;
});

function runOnBrowserStack(caps, test, done) {
  console.log('Running Test: ' + test.name.green + '\n');
  var browser = wd.promiseChainRemote(
    config.seleniumHost,
    config.seleniumPort,
    username,
    accessKey
  );

  // optional extra logging
  browser.on('status', function(info) {
    console.log(info.cyan);
  });
  browser.on('command', function(eventType, command, response) {
    console.log(' > ' + eventType.green, command, (response || '').grey);
  });
  browser.on('http', function(meth, path, data) {
    console.log(' > ' + meth.yellow, path, (data || '').grey);
  });

  test
    .run(browser.init(caps))
    .fin(function() {
      return browser.quit();
    })
    .onQuit(done)
    .done();
}

var config_file = process.argv[2] || 'conf.js';
var config = require(config_file).config;
var test = require(config.test);

var username = process.env.BROWSERSTACK_USERNAME || config.user;
var accessKey = process.env.BROWSERSTACK_ACCESS_KEY || config.key;
//loops thru:
//  capabilities:
// [
// {
//     browserName: 'chrome',
//         name: 'single_test',
//             build: 'wd-browserstack'
// }
//   ]
for (var i in config.capabilities) {
  var caps = config.capabilities[i];
  if (caps['browserstack.local']) {
    // Code to start browserstack local before start of test and stop browserstack local after end of test
    console.log('Connecting local');
    var bs_local = new browserstack.Local();
    bs_local.start({ key: accessKey }, function(error) {
      if (error) return console.log(error.red);
      console.log('Connected. Now testing...');

      runOnBrowserStack(caps, test, function() {
        bs_local.stop();
      });
    });
  } else {
    runOnBrowserStack(caps, test);
  }
}
