var fs = require('fs');
var Yadda = require('yadda');
var glob = require('glob');
var _ = require('underscore');
var config = require('../yadda-watch.json');
var featureParser = new Yadda.parsers.FeatureParser();

var language = Yadda.localisation[config.yadda_language];
var library = language.library();

Yadda.plugins.mocha.StepLevelPlugin.init();

webdriver = require('selenium-webdriver');

var driver = new webdriver.Builder()
    .usingServer()
    .withCapabilities(webdriver.Capabilities.firefox())
    .build();

driver.manage().timeouts().implicitlyWait(15000);

var context = {
    getElementFromView: function (element) {
        if (context.views && context.views[element]) {
            return context.views[element];
        } else {
            //If we can not find it maybe the given string was a selector itself
            return element;
        }
    },
    views: {},
    driver: driver
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
new Yadda.FeatureFileSearch('./test/features').each(function(file) {
  featureFile(file, function(feature) {
    scenarios(feature.scenarios, function(scenario) {
      steps(scenario.steps, function(step, done) {
        yadda.yadda(step, done);
      });
    });
  });
});

// driver.quit();
