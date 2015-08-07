/**
 * Author: Vadim
 * Date: 8/3/2015
 */

var _ = require('lodash'),
    CommonManagementFeature = require('../common/managementFeature'),
    ParticipantsService = require('../../db-service/services/participant'),
    PDFGenerator = require('../../utils/pdfGenerator/pdfGenerator'),
    QRGenerator = require('../../utils/qrGenerator/qrGenerator'),
    MailService = require('../../utils/mailer/mailService');

_.mixin(require('underscore.deferred'));

var TicketsManagementFeature = _.extend({
    validateTicket: function validateTicket(request, reply) {
        _.when(ParticipantsService.byTicket(request.params.ticketNumber))
            .then(ParticipantsService.useTicket)
            .done(function (participant) {
                reply().code(200);
            })
            .fail(TicketsManagementFeature.failure(request, reply));
    },
    generateUserPdfFile: function generateUserPdfFile(host, participant) {
        var svgPath = QRGenerator.generateSvgPath('http://' + host + '/validator/' + participant.ticketNumber + '/');

        return PDFGenerator.preparePdfFile({
            svgPath: svgPath,
            documentTitle: 'Your ticket for 5th Latvian Sensual Dance festival - On The Wave 2016',
            ticketNumber: participant.ticketNumber,
            userDetails: participant.name + ' ' + participant.surname
        });
    },
    emailTicket: function emailTicket(request, reply) {
        var mailService = MailService.getInstance(),
            serverHost = this.server.host,
            wrapParticipantData = function (participant) {
                var deferred = new _.Deferred();
                var pdfDoc = TicketsManagementFeature.generateUserPdfFile(serverHost, participant);
                process.nextTick(function () {
                    deferred.resolve({
                        subject: 'Your ticket for 5th Latvian Sensual Dance festival - On The Wave 2016',
                        to: participant.email,
                        attachments: [
                            {
                                filename: 'OTW_ticket_' + participant.ticketNumber + '.pdf',
                                content: pdfDoc,
                                contentType: 'application/pdf'
                            }
                        ],
                        data: participant.toObject()
                    });
                    pdfDoc.end();
                });
                return deferred.promise();
            };

        _.when(ParticipantsService.byId(request.params.personId))
            .then(wrapParticipantData)
            .then(mailService.prepareAndSendMail.bind(mailService))
            .done(function () {
                reply().code(200);
                // TODO update participant stauts to SENT
            })
            .fail(TicketsManagementFeature.failure(request, reply));
    },
    downloadTicket: function downloadTicket(request, reply) {
        var serverHost = this.server.host;
        _.when(ParticipantsService.byId(request.params.personId))
            .done(function (participant) {

                var pdfDoc = TicketsManagementFeature.generateUserPdfFile(serverHost, participant);

                reply(pdfDoc)
                    .header('Content-Disposition', 'attachment; filename="OTW_ticket_' + participant.ticketNumber + '.pdf"');
                pdfDoc.end();
            })
            .fail(TicketsManagementFeature.failure(request, reply));
    }
}, CommonManagementFeature);

module.exports = TicketsManagementFeature;