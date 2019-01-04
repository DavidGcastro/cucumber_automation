Feature: this is an example to test is the "this" context refers to a global object or "world"

  Scenario: Check this context
    Given I have added to the this context in another test
    When I check the context
    Then I should have the key attached to the this context