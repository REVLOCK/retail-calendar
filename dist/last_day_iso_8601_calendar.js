"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var moment_1 = __importDefault(require("moment"));
var LastDayISO8601Strategy = /** @class */ (function () {
    function LastDayISO8601Strategy() {
    }
    LastDayISO8601Strategy.prototype.getLastDayForGregorianLastDay = function (lastDayOfGregorianYear, lastDayOfIsoWeek) {
        // Step 1: Get Jan 4 of the *next* Gregorian year
        var jan4NextYear = moment_1.default(lastDayOfGregorianYear.year() + 1 + "-01-04");
        // Step 2: Go to ISO week 1 of next year, then subtract 1 week to get the *last week* of current ISO year
        var lastIsoWeek = jan4NextYear.isoWeek(1).subtract(1, 'week');
        // Step 3: Move to the desired ISO weekday (default is Sunday = 7)
        return lastIsoWeek.isoWeekday(lastDayOfIsoWeek);
    };
    return LastDayISO8601Strategy;
}());
exports.LastDayISO8601Strategy = LastDayISO8601Strategy;
