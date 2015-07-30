/**
 * Created by Vadim on 7/30/2015.
 */

var _ = require('lodash'),
    mongoose = require('mongoose'),
    db = mongoose.connection,
    Vocabulary = require('../models/vocabulary'),
    vocabularyDefaults = [
        {type: 'passType', value: 'Full'},
        {type: 'passType', value: 'Party'},
        {type: 'passType', value: 'Saturday'},
        {type: 'passType', value: 'Sunday'},
        {type: 'gender', value: 'M'},
        {type: 'gender', value: 'F'},
        {type: 'status', value: 'PAID'},
        {type: 'status', value: 'SENT'},
        {type: 'status', value: 'USED'}
    ];
db.once('open', function () {
    _.each(vocabularyDefaults, function (info) {
        Vocabulary.find(info, function (err, result) {
            if (!result || result.length < 1) {
                new Vocabulary(info).save();
            }
        });
    });
});

mongoose.connect('mongodb://localhost/test');
module.exports = db;