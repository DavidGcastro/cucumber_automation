var { setWorldConstructor } = require('cucumber');
var seleniumWebdriver = require('selenium-webdriver');

function CustomWorld() {
  this.num = 5;
}

setWorldConstructor(CustomWorld);
