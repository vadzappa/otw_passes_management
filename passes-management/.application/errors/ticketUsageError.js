/**
 * Author: Vadim
 * Date: 8/4/2015
 */


var TicketUsageError = function (message, code) {
    this.name = 'TicketUsageError';
    this.message = message;
    this.ticketUsageErrorCode = code;
    this.stack = (new Error()).stack;
};

TicketUsageError.prototype = new Error();

module.exports = TicketUsageError;