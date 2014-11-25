var webdriver = require('selenium-webdriver');
var chai = require('chai');
var expect = chai.expect;

var Steps = {
	using: function(library, ctx) {
        library
                .when("I open the test enviroment", function () {
                    var self = this;
                    this.driver.get('http://www.duckduckgo.com').then(function () {
                        self.done();
                    });

                })
                .when("I open $URL", function(url) {
                    var self = this;
                    this.driver.get(url).then(function () {
                        self.done();
                    });
                })
                .then("the title should be $TITLE", function(expected){
                    var self = this;
                    this.driver.getTitle().then(function(title) {
                        expect(expected).to.equal(title);
                        self.done();
                    });
                })
                .then("I should see a $element", function (element) {
                    var self = this;
                    self.done();

                })
                .then("I should see $text in the $element", function (expected, element) {
                    var elementSelector = ctx.getElementFromView(element);
                    var self = this;
                    this.driver.findElement(webdriver.By.css(elementSelector)).getText().then(function(text) {
        				expect(text).to.contain(title);
        				self.done();
        			});
                })
                .when('I type $text in the $element', function (text, element) {
                    var elementSelector = ctx.getElementFromView(element),
                        webElement = this.driver.findElement(webdriver.By.css(elementSelector));
                    var self = this;

                    webElement
                        .click()
                        .then(function () {
                            webElement.sendKeys(text).then(function() {
                                self.driver.sleep(5000).then(function () {self.done();})
                            });
                        });


                })
                .then('I close the browser', function () {
                    var self = this;
                    this.driver.quit().then(function () {
                        self.done();
                    });
                });

	}
};

exports.steps = Steps;
