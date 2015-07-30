var Confidence = require('confidence'),
    fs = require('fs');


var store = new Confidence.Store();

fs.readFile('config.json', function(error, data) {
    store.load(JSON.parse(data));

    var production = store.get('/', {
        system: {
            env: 'production'
        }
    });

    var development = store.get('/');

    fs.writeFileSync('production.json', JSON.stringify(production));
    fs.writeFileSync('development.json', JSON.stringify(development));

});