var Confidence = require('confidence'),
    _ = require('lodash'),
    fs = require('fs');


var store = new Confidence.Store();

fs.readFile('config.json', function (error, data) {
    store.load(JSON.parse(data));
    var environmentSet = _.extend({}, process.env),
        applyEnvironment = function applyEnvironment(value, key, object) {
            if (_.isObject(value)) {
                _.forIn(value, applyEnvironment);
            } else if (_.isArray(value)) {
                _.each(value, function (arrObject) {
                    _.forIn(arrObject, applyEnvironment);
                });
            } else if (_.isString(value)) {
                if (value.indexOf('$$') === 0) {
                    var envKey = value.substr(2);
                    object[key] = environmentSet[envKey];
                }
            }
        };

    var production = store.get('/', {
            system: {
                env: 'production'
            }
        }),
        development = store.get('/');

    _.forIn(production, applyEnvironment);
    _.forIn(development, applyEnvironment);

    fs.writeFileSync('production.json', JSON.stringify(production));
    fs.writeFileSync('development.json', JSON.stringify(development));

});