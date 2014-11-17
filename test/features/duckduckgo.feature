Feature: DuckDuckGo Demo

  Scenario: DuckDuckGo home page

    When I open http://duckduckgo.com
    Then the title should be DuckDuckGo
     And I should see a search box
     And I should see a search button

  Scenario: Google home page Part II

    When I open http://duckduckgo.com
    Then the title should be DuckDuckGo
    And I should see a search box
    And I should see a search button
    And I should see a #logo_homepage_link