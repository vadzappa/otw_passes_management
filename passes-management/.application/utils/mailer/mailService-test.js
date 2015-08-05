/**
 * Author: Vadim
 * Date: 8/5/2015
 */

var _ = require('lodash'),
    path = require('path'),
    featureName = _.last(__filename.split(path.sep)).replace('-test', ''),
    featurePath = path.join(__dirname, featureName),
    options = {
        username: 'bachatakizombalv@gmail.com',
        password: 'alwaysebachata',
        sender: 'mail@mail.com'
    },
    PDFGenerator = require('../pdfGenerator/pdfGenerator'),
    QRGenerator = require('../qrGenerator/qrGenerator');

_.mixin(require('underscore.deferred'));

var MailService = require(featurePath),
    assert = require('assert');

describe(featureName, function () {
    describe('#getInstance', function () {
        it('should init instance', function (done) {
            var result = MailService.getInstance(options);
            assert.ok(result, 'Should return instance');
            done();
        });
    });

    describe('#prepareAndSendMail', function () {
        it('should prepare and send mail', function (done) {
            var mailInstance = MailService.getInstance(options);
            var promise = mailInstance.prepareAndSendMail({
                data: {
                    emailTitle: 'OTW Ticket',
                    name: 'Vadim',
                    surname: 'Zapolski'
                },
                to: 'v.zapolskydovnar@gmail.com',
                subject: 'test from OTW'
            });
            _.when(promise)
                .done(function (response) {
                    assert.ok(response, 'Should return some response');
                    done();
                })
                .fail(function (error) {
                    assert.ifError(error);
                    done();
                });

        });
    });

    describe('#prepareAndSendMail', function () {
        it('should prepare and send mail with attachment', function (done) {
            var mailInstance = MailService.getInstance(options),
                participant = {
                    ticketNumber: '000',
                    name: 'Vadim',
                    surname: 'Zapolski'
                };
            var svgPath = QRGenerator.generateSvgPath('http://google.com/validator/' + participant.ticketNumber + '/');

            var pdfDoc = PDFGenerator.preparePdfFile({
                svgPath: svgPath,
                documentTitle: 'OTW 2016 Ticket',
                ticketNumber: participant.ticketNumber,
                userDetails: participant.name + ' ' + participant.surname
            });

            var promise = mailInstance.prepareAndSendMail({
                data: {
                    emailTitle: 'OTW Ticket',
                    name: participant.name,
                    surname: participant.surname
                },
                to: 'v.zapolskydovnar@gmail.com',
                subject: 'test from OTW',
                attachments: [
                    {
                        filename: 'OTW_ticket_' + participant.ticketNumber + '.pdf',
                        content: pdfDoc,
                        contentType: 'application/pdf'
                    }
                ]
            });
            pdfDoc.end();
            _.when(promise)
                .done(function (response) {
                    assert.ok(response, 'Should return some response');
                    done();
                })
                .fail(function (error) {
                    assert.ifError(error);
                    done();
                });

        });
    });
});