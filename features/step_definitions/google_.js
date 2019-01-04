const assert = require('assert');
const { When, Then } = require('cucumber');

When('I type query as {string}', { timeout: 50 * 10000 }, async function(
  searchQuery
) {
  // Write code here that turns the phrase above into concrete actions
  await this.driver.get('https://www.google.com');
  await this.driver.findElement({ name: 'q' }).sendKeys(searchQuery + '\n');
});

Then(/^I submit$/, function(next) {
  next();
});

Then(/^I should see title "([^"]*)"$/, async function(titleMatch) {
  let title = await this.driver.getTitle();
  assert.equal(title, titleMatch, 'Expected title to be ' + titleMatch);
});
