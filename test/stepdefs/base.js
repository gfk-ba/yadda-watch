module.exports.using = function (library, context) {
    library
            .when("I open $URL", function(url) {
                this.browser.url(url)
            })
            .then("the title should be $TITLE", function(title){
                this.browser.assert.title(title, '')
            })
            .then("I should see a $element", function (element) {
                var elementSelector = context.getElementFromView(element);

                this.browser.assert.elementPresent(elementSelector)
            })
            .then("I should see $text in the $element", function (text, element) {
                var elementSelector = context.getElementFromView(element);
                this.browser.assert.containsText(elementSelector, text);
            })
            .when('I type $text in the $element', function (text, element) {
                var elementSelector = context.getElementFromView(element);
                this.browser
                        .waitForElementVisible(elementSelector, 5000)
                        .pause(500)
                        .setValue(elementSelector, text.split(''));

            })
};