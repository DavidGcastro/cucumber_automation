Feature: Google Search Functionality

    Scenario: Can find search results
        When I type query as 'webdriver'
        Then I submit
        Then I should see title "webdriver - Google Search"
        