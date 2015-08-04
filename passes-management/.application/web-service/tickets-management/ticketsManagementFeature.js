/**
 * Author: Vadim
 * Date: 8/3/2015
 */

var _ = require('lodash'),
    CommonManagementFeature = require('../common/managementFeature'),
    ParticipantsService = require('../../db-service/services/participant'),
    PDFGenerator = require('../../utils/pdfGenerator/pdfGenerator'),
    QRGenerator = require('../../utils/qrGenerator/qrGenerator');

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
    emailTicket: function emailTicket(request, reply) {
        reply().code(200);
    },
    downloadTicket: function downloadTicket(request, reply) {
        var serverHost = this.server.host;
        _.when(ParticipantsService.byId(request.params.personId))
            .done(function (participant) {

                var svgPath = QRGenerator.generateSvgPath('http://' + serverHost + '/validator/' + participant.ticketNumber + '/');

                var pdfDoc = PDFGenerator.preparePdfFile({
                    svgPath: svgPath,
                    documentTitle: 'OTW 2016 Ticket',
                    ticketNumber: participant.ticketNumber,
                    userDetails: participant.name + ' ' + participant.surname
                });

                reply(pdfDoc)
                    .header('Content-Disposition', 'attachment; filename="OTW_ticket_' + participant.ticketNumber + '.pdf"');
                pdfDoc.end();
            })
            .fail(TicketsManagementFeature.failure(request, reply));
    }
}, CommonManagementFeature);

module.exports = TicketsManagementFeature;