/**
 * Author: Vadim
 * Date: 7/29/2015
 */

var _ = require('lodash'),
    Boom = require('boom'),
    usersStaticList = [
        {
            'id': new Date().getTime(),
            'name': 'Vadim',
            'surname': 'Zapolski',
            'gender': {
                id: 1
            },
            'email': 'v.zapolsky@mail.com',
            'passType': {
                id: 1
            },
            'paymentStatus': {
                id: 1
            }
        },
        {
            'id': new Date().getTime(),
            'name': 'Nataly',
            'surname': 'Hristolubova',
            'gender': {
                id: 2
            },
            'email': 'nataly@mail.com',
            'passType': {
                id: 2
            },
            'paymentStatus': {
                id: 2
            }
        },
        {
            'id': new Date().getTime(),
            'name': 'Ivan',
            'surname': 'Dulin',
            'gender': {
                id: 1
            },
            'email': 'dulin@mail.com',
            'passType': {
                id: 3
            },
            'paymentStatus': {
                id: 3
            }
        }
    ];

var UserManagementFeature = {
    savePerson: function savePerson(request, reply) {
        var payloadUser = request.payload,
            existingUser = _.find(usersStaticList, function (user) {
                return user.id === parseInt(payloadUser.id);
            });

        if (existingUser) {
            _.extend(existingUser, payloadUser);
        } else {
            payloadUser.id = new Date().getTime();
            usersStaticList = usersStaticList.concat(payloadUser);
        }
        return reply();
    },
    personDetails: function personDetails(request, reply) {
        var userId = request.params.personId,
            user = _.find(usersStaticList, function (user) {
                return user.id === parseInt(userId);
            });

        if (!user) {
            return reply().code(201);
        }

        return reply(user);
    },
    listAllUsers: function listAllUsers(request, reply) {
        return reply(usersStaticList);
    }
};

module.exports = UserManagementFeature;