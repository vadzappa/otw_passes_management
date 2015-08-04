/**
 * Created by Vadim on 7/30/2015.
 */

var _ = require('lodash'),
    Vocabulary = require('../models/vocabulary');

_.mixin(require('underscore.deferred'));

var VocabularyService = {
    byType: function byType(type) {
        var deferred = new _.Deferred();
        Vocabulary.find({type: type}).exec(function (error, personsList) {
            if (error) {
                deferred.reject(error);
            } else {
                deferred.resolve(personsList);
            }
        });
        return deferred.promise();
    }
};

module.exports = VocabularyService;