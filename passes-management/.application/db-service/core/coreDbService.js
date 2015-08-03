/**
 * Created by Vadim on 7/30/2015.
 */

var _ = require('lodash'),
    mongoose = require('mongoose'),
    db = mongoose.connection,
    Vocabulary = require('../models/vocabulary'),
    SystemRole = require('../models/systemRole'),
    SystemUser = require('../models/systemUser');

_.mixin(require('underscore.deferred'));

var handleSavingErrors = function handleSavingErrors(next, err, doc, numberAffected) {
        if (err) {
            console.error(err);
        }
        next();
    },
    populateVocabularies = function populateVocabularies(vocabularies) {
        var deferred = new _.Deferred(),
            doneController = _.after(vocabularies.length, function () {
                deferred.resolve();
            }),
            saveCb = _.partial(handleSavingErrors, doneController);

        _.each(vocabularies, function (info) {
            Vocabulary.findOne(info, function (err, result) {
                if (!err && !result) {
                    new Vocabulary(info).save(saveCb);
                } else {
                    doneController();
                }
            });
        });

        return deferred.promise();
    },
    populateRoles = function populateRoles(roles) {
        var deferred = new _.Deferred(),
            doneController = _.after(roles.length, function () {
                deferred.resolve();
            }),
            saveCb = _.partial(handleSavingErrors, doneController);

        _.each(roles, function (role) {
            SystemRole.findOne({
                roleName: role.roleName
            }, function (err, result) {
                if (!err && !result) {
                    new SystemRole(role).save(saveCb);
                } else {
                    doneController();
                }
            });
        });

        return deferred.promise();
    },
    populateUsers = function populateUsers(users) {
        var deferred = new _.Deferred(),
            doneController = _.after(users.length, function () {
                deferred.resolve();
            }),
            saveCb = _.partial(handleSavingErrors, doneController);

        _.each(users, function (user) {
            SystemUser.findOne({
                username: user.username
            }, function (err, result) {
                if (!err && !result) {
                    SystemRole.findOne({
                        roleName: user.roleName
                    }, function (err, result) {
                        if (!err && result) {
                            new SystemUser(user).save(saveCb);
                        } else {
                            doneController();
                        }
                    });
                } else {
                    doneController();
                }
            });
        });

        return deferred.promise();
    };

var populateDatabase = function (dbDataDefaults) {
    return function () {
        populateVocabularies(dbDataDefaults.vocabularies);
        _.when(populateRoles(dbDataDefaults.roles))
            .then(function () {
                populateUsers(dbDataDefaults.users);
            })
            .fail(function (error) {
                console.error(error);
            });
    }
};

module.exports = {
    initialize: function initialize(options) {
        mongoose.connect(options['connection-string']);
        db.once('open', populateDatabase(options['db-data']));
        return db;
    }
};