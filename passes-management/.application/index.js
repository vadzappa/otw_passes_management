/**
 * Author: Vadim
 * Date: 7/29/2015
 */

var _ = require('lodash'),
    fs = require('fs'),
    path = require('path'),
    indexFileLocation = '../static/index.html',
    errorWrapper = require('./errors/errorWrapper'),
    loginFileLocation = '../static/login.html',
    staticFilesPath = path.join(__dirname, '../static'),
    systemUsersService = require('./db-service/services/users'),
    usersManagement = new require('./web-services/user-management/userManagementFeature'),
    vocabularyManagement = new require('./web-services/vocabulary-management/vocabularyManagementFeature'),
    ticketsManagement = new require('./web-services/tickets-management/ticketsManagementFeature'),
    loggingFeature = require('./logging/loggingFeature'),
    dayCache = {
        expiresIn: 24 * 60 * 60 * 1000,
        privacy: 'public'
    },
    noCache = {
        expiresIn: 0,
        privacy: 'public'
    },
    coreDb = require('./db-service/core/coreDbService'),
    AccessControl = require('./access-control-service');

_.mixin(require('underscore.deferred'));

var PassesManagementPlugin = {
    register: function (server, options, next) {

        loggingFeature.bindToServer(server);

        var accessControl = new AccessControl(options['access-control']);
        server.ext('onPreAuth', accessControl.checkAccess);
        server.ext('onPreResponse', errorWrapper.wrapError);

        coreDb.initialize(options.mongoose);

        server.route({
            method: 'GET',
            path: '/validator/{ticketNumber}/',
            handler: ticketsManagement.validateTicket,
            config: {
                cache: noCache
            }
        });

        server.route({
            method: 'GET',
            path: '/generate/{personId}/',
            handler: ticketsManagement.downloadTicket.bind(options),
            config: {
                cache: noCache
            }
        });

        server.route({
            method: 'GET',
            path: '/email/{personId}/',
            handler: ticketsManagement.emailTicket,
            config: {
                cache: noCache
            }
        });

        server.route({
            method: 'GET',
            path: '/login/',
            handler: function (request, reply) {
                return reply(fs.createReadStream(path.join(__dirname, loginFileLocation)));
            },
            config: {
                cache: dayCache
            }
        });

        server.route({
            method: 'POST',
            path: '/login/',
            handler: function (request, reply) {
                _.when(systemUsersService.findByLoginAndPassword(request.payload))
                    .done(function (user) {
                        request.session.set('user', user);
                        reply().redirect('/');
                    })
                    .fail(function (error) {
                        console.error(error);
                        reply(fs.createReadStream(path.join(__dirname, loginFileLocation)));
                    });
            },
            config: {
                cache: dayCache
            }
        });

        server.route({
            method: 'GET',
            path: '/',
            handler: function (request, reply) {
                return reply(fs.createReadStream(path.join(__dirname, indexFileLocation)));
            },
            config: {
                cache: noCache
            }
        });

        server.route({
            method: 'GET',
            path: '/static/{path*}',
            handler: function (request, reply) {
                var fullFilePath = path.join(staticFilesPath, request.params.path);
                return reply(fs.createReadStream(fullFilePath));
            }
        });

        server.route({
            method: 'GET',
            path: '/people/',
            handler: usersManagement.listAllUsers,
            config: {
                cache: noCache
            }
        });

        server.route({
            method: 'GET',
            path: '/people/{personId}/',
            handler: usersManagement.personDetails,
            config: {
                cache: noCache
            }
        });

        server.route({
            method: 'POST',
            path: '/people/{personId}/',
            handler: usersManagement.savePerson,
            config: {
                cache: noCache
            }
        });

        server.route({
            method: 'GET',
            path: '/passTypes/',
            handler: vocabularyManagement.listPassesTypes,
            config: {
                cache: noCache
            }
        });

        server.route({
            method: 'GET',
            path: '/genders/',
            handler: vocabularyManagement.listGenders,
            config: {
                cache: noCache
            }
        });

        server.route({
            method: 'GET',
            path: '/statusesTypes/',
            handler: vocabularyManagement.listStatusesTypes,
            config: {
                cache: noCache
            }
        });


        return next();
    }

};

_.extend(PassesManagementPlugin.register, {
    attributes: {
        pkg: require('../package.json')
    }
});

module.exports = PassesManagementPlugin;