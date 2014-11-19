var webdriver = require('selenium-webdriver');
var chai = require('chai');
var expect = chai.expect;

var Steps = {
	using: function(library, ctx) {
        library
                .when("I open the test enviroment", function (next) {
                    ctx.driver.get('http://www.duckduckgo.com').then(function () {
                        next();
                    });

                })
                .when("I open $URL", function(url, next) {
                    ctx.driver.get(url).then(function () {
                        next();
                    });
                })
                .then("the title should be $TITLE", function(expected, next){
                    ctx.driver.getTitle().then(function(title) {
                        expect(expected).to.equal(title);
                        next();
                    });
                })
                .then("I should see a $element", function (element, next) {
                    next();

                })
                .then("I should see $text in the $element", function (expected, element, next) {
                    var elementSelector = ctx.getElementFromView(element);
                    ctx.driver.findElement(webdriver.By.css(elementSelector)).getText().then(function(text) {
        				expect(text).to.contain(title);
        				next();
        			});
                })
                .when('I type $text in the $element', function (text, element, next) {
                    var elementSelector = ctx.getElementFromView(element),
                        webElement = ctx.driver.findElement(webdriver.By.css(elementSelector));

                    webElement
                        .click()
                        .then(function () {
                            webElement.sendKeys(text).then(function() {
                                ctx.driver.sleep(5000).then(function () {next();})
                            });
                        });


                });

	}
};

exports.steps = Steps;
