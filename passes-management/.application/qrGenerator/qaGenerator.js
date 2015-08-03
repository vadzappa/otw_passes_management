/**
 * Author: Vadim
 * Date: 7/28/2015
 */
var _ = require('lodash'),
    qr = require('qr-image');

_.mixin(require('underscore.deferred'));

var QaGeneratorFeature = {
    generateSvgPath: function generateSvgPath(qrContent) {
        return qr.svgObject(qrContent, {type: 'svg'}).path;
    }
};

module.exports = QaGeneratorFeature;