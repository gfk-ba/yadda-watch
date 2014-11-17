@persistentSession
Feature: Persistent Session Demo

  Scenario: Persistent DuckDuckGo home page

    When I open http://duckduckgo.com
    Then the title should be DuckDuckGo
    When I type foobar in the search box

  Scenario: Persistent home page Part II

    Then I should see foobar in the page