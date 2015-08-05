/**
 * Author: Vadim
 * Date: 8/5/2015
 */

var _ = require('lodash'),
    fs = require('fs'),
    path = require('path'),
    nodemailer = require('nodemailer'),
    wellknown = require('nodemailer-wellknown'),
    smtpTransport = require('nodemailer-smtp-transport'),
    handlebars = require('handlebars'),
    emailTemplate = fs.readFileSync(path.join(__dirname, 'template.html')).toString(),
    transporter,
    mailService;

_.mixin(require('underscore.deferred'));

var MailServiceSingleton = function (options) {
    options = options || {};
    var smtpOptions = _.extend({}, wellknown('Gmail'), {
        auth: {
            user: options.username,
            pass: options.password
        }
    });
    transporter = nodemailer.createTransport(smtpTransport(smtpOptions));
    this.from = options.sender;
    this.template = handlebars.compile(emailTemplate);
};

_.extend(MailServiceSingleton.prototype, {
    prepareAndSendMail: function prepareAndSendMail(options) {
        var deferred = new _.Deferred();
        var mailOptions = {
            from: this.from,
            to: options.to,
            subject: options.subject,
            html: this.template(options.data)
        };
        if (options.attachments) {
            mailOptions.attachments = options.attachments;
        }

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                deferred.reject(error);
            } else {
                deferred.resolve(info.response);
            }
        });
        return deferred.promise();
    }
});

module.exports = {
    getInstance: function (options) {
        if (!mailService) {
            mailService = new MailServiceSingleton(options);
        }
        return mailService;
    }
};

