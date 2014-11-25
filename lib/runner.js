/* global before, afterEach, after, featureFile, scenarios, steps */
var fs = require('fs');
var Yadda = require('yadda');
var glob = require('glob');
var _ = require('underscore');
var config = require('../yadda-watch.json');
var featureParser = new Yadda.parsers.FeatureParser();

var language = Yadda.localisation[config.yadda_language];
var library = language.library();

Yadda.plugins.mocha.StepLevelPlugin.init();

var webdriver = require('selenium-webdriver');

var context = {
    getElementFromView: function (element) {
        if (context.views && context.views[element]) {
            return context.views[element];
        } else {
            //If we can not find it maybe the given string was a selector itself
            return element;
        }
    },
    views: {}
};

if (config.views_path) {
    glob.sync(config.views_path).forEach(loadView);
}

glob.sync(config.stepdefs_path).forEach(loadStepDef);

var yadda = new Yadda.Yadda(library);

function loadView(view) {
    var viewData = require('../' + view);

    _.each(viewData, function (item, key) {
        if(context.views[key]) {
            console.warn('Warning: duplicate view element identifier found ' + key + ' in file ' + view);
        }
        context.views[key] = item;
    });
}

function loadStepDef(stepdef) {
    var fileName = stepdef.replace('.js', '');
    require('../' + fileName).steps.using(library, context);
}

//TODO: Figure out why i cant use config.features_path
//
var featureFiles = new Yadda.FeatureFileSearch('./test/features').list();

console.log(featureFiles);

var flows = _.map(featureFiles, function(file) {
    return webdriver.promise.createFlow(function(flow) {
        featureFile(file, function(feature) {
            var driver;

            before(function(done) {
                driver = new webdriver.Builder()
                    .usingServer('http://localhost:4444/wd/hub')
                    .withCapabilities(webdriver.Capabilities.firefox())
                    .build();
                done();

            });

            scenarios(feature.scenarios, function(scenario) {
                steps(scenario.steps, function(step, done) {
                    console.log(step);
                    yadda.yadda(step, { done: done, driver: driver});
                });
            });

            afterEach(function () {
                takeScreenshotOnFailure(this.currentTest, driver);
            });

            after(function (done) {
                driver.quit().then(done);
            });
        });
    });
});
describe('Async wait', function () {
    it('Should wait for all flows to finish', function (done) {
        this.timeout(500000);
        webdriver.promise.fullyResolved(flows).then(function(done) {
            console.log('All tests passed!');
            done();
        });
    });
});



function takeScreenshotOnFailure(test, driver) {
    if (test.state != 'passed') {
        var path = 'screenshots/' + test.title.replace(/\W+/g, '_').toLowerCase() + '.png';
        driver.takeScreenshot().then(function(data) {
            fs.writeFile(path, data, 'base64', function () {});
        });
    }
}
