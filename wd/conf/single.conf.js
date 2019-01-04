exports.config = {
  user: 'davidcastro9',
  key: 'qYQDPWb8hzmkyb1fdKvT',
  server: 'hub-cloud.browserstack.com',
  seleniumHost: 'hub-cloud.browserstack.com',
  seleniumPort: 80,

  test: '../tests/single_test.js',

  //determines how we are going to run the test
  //we can pick an OS, Device and screen resolution.

  capabilities: [
    {
      os: 'OS X',
      os_version: 'Mojave',
      browser: 'Chrome',
      browser_version: '72.0 beta',
      resolution: '1024x768'
    },
    {
      os: 'Windows',
      os_version: '8.1',
      browser: 'IE',
      browser_version: '11.0',
      resolution: '1024x768'
    }
  ]
};
