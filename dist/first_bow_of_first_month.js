"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var moment_1 = __importDefault(require("moment"));
var FirstBOWOfFirstMonth = /** @class */ (function () {
    function FirstBOWOfFirstMonth() {
    }
    FirstBOWOfFirstMonth.prototype.getLastDayForGregorianLastDay = function (lastDayOfGregorianYear, lastDayOfIsoWeek) {
        var firstDayOfIsoWeek = lastDayOfIsoWeek === 7 ? 1 : lastDayOfIsoWeek + 1;
        var lastMonth = lastDayOfGregorianYear.month();
        var mutableLastDay = moment_1.default(lastDayOfGregorianYear);
        // Go to the next month, i.e start month of next year
        mutableLastDay.add(1, 'day');
        // Find the first day which is a start of the week
        while (mutableLastDay.isoWeekday() !== firstDayOfIsoWeek) {
            mutableLastDay.add(1, 'day');
        }
        // That was the start of next year
        // Go back by one day and find end of this year.
        mutableLastDay.add(-1, 'day');
        return mutableLastDay;
    };
    return FirstBOWOfFirstMonth;
}());
exports.FirstBOWOfFirstMonth = FirstBOWOfFirstMonth;
