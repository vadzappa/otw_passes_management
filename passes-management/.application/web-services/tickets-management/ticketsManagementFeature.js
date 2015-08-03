/**
 * Author: Vadim
 * Date: 8/3/2015
 */

var _ = require('lodash'),
    Boom = require('boom'),
    ParticipantsService = require('../../db-service/services/participant'),
    PDFGenerator = require('../../pdfGenerator/pdfGenerator'),
    QRGenerator = require('../../qrGenerator/qaGenerator');

_.mixin(require('underscore.deferred'));

var TicketsManagementFeature = {
    downloadTicket: function downloadTicket(request, reply) {
        var svgPath = QRGenerator.generateSvgPath('http://www.google.com/' + request.params.personId);
        var pdfDoc = PDFGenerator.preparePdfFile({
            svgPath: svgPath,
            documentTitle: 'OTW 2016 Ticket',
            ticketNumber: request.params.personId,
            userDetails: 'Some User'
        });

        reply(pdfDoc);
        pdfDoc.end();
    }
};

module.exports = TicketsManagementFeature;