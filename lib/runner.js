var fs = require('fs');
var Yadda = require('yadda');
var glob = require('glob');
var _ = require('underscore');
var config = require('../yadda-watch.json');
var featureParser = new Yadda.parsers.FeatureParser();

var language = Yadda.localisation[config.yadda_language];
var library = language.library();

var steps = {};

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

glob.sync(config.features_path).forEach(executeFeature);

function loadView(view) {
    var view = require('../' + view);
    _.extend(context.views, view);
};

function loadStepDef(stepdef) {
    var fileName = stepdef.replace('.js', '');
    require('../' + fileName).using(library, context);
};

function executeFeature(featureFile) {
    var feature = featureParser.parse(fs.readFileSync(featureFile, 'utf8'));
    var persistSession = feature.annotations.persistentSession;

    feature.scenarios.forEach(function(scenario) {
        steps[scenario.title] = function(browser) {
            _.each(scenario.steps, function (item) {
                browser.assert.stepMessage(item);

                yadda.yadda(item, { browser: browser, message: item });
            });
            if(!persistSession) {
                browser.end();
            }
        };
    });

    if(persistSession) {
        steps['Persistent feature cleanup'] = function (browser) {
            browser.end();
        }
    }
};

module.exports = steps;
