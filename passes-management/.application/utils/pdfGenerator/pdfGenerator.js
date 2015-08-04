/**
 * Author: Vadim
 * Date: 8/3/2015
 */

var _ = require('lodash'),
    fs = require('fs'),
    path = require('path'),
    PDFDocument = require('pdfkit'),
    logoFile = path.join(__dirname, 'home-top-banner.jpg');

_.mixin(require('underscore.deferred'));

var PdfGeneratorFeature = {
    preparePdfFile: function preparePdfFile(options, writeStream) {
        var svgPath = options.svgPath,
            documentTitle = options.documentTitle,
            ticketNumber = options.ticketNumber,
            userDetails = options.userDetails;

        var doc = new PDFDocument({
                size: 'A4',
                info: {
                    Title: documentTitle
                }
            }), headerRightAligned = {
                width: 400,
                align: 'right'
            },
            bodyLeftAligned = {
                width: 550,
                align: 'left'
            };

        // Header image
        doc.image(logoFile, 0, 0, {
            width: 594
        });

        doc.fontSize(28);
        doc.font('Helvetica')
            .text('Ticket Number: ' + ticketNumber, 175, 230, headerRightAligned);

        doc.fontSize(16);
        doc.font('Helvetica')
            .text('Hello ' + userDetails + '!', 20, 340, bodyLeftAligned)
            .moveDown()
            .text('This is your E-Ticket for', bodyLeftAligned)
            .moveDown()
            .text('Latvian Sensual Dance Festival On The Wave 2016', bodyLeftAligned);

        // QR Code
        doc.path(svgPath).translate(15, 175).scale(4.5).fill();

        return doc;

    }
};

module.exports = PdfGeneratorFeature;