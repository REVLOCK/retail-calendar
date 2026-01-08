"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var moment_1 = __importDefault(require("moment"));
var LastDayNearestEOMStrategy = /** @class */ (function () {
    function LastDayNearestEOMStrategy() {
    }
    LastDayNearestEOMStrategy.prototype.getLastDayForGregorianLastDay = function (lastDayOfGregorianYear, lastDayOfIsoWeek) {
        var mutableLastDay = moment_1.default(lastDayOfGregorianYear);
        // Generate 3 candidates which has the same day of week.
        // Current week, last week, next week
        var currentWeekCandidate = moment_1.default(mutableLastDay).isoWeekday(lastDayOfIsoWeek);
        var lastWeekCandidate = moment_1.default(mutableLastDay)
            .subtract(1, 'week')
            .isoWeekday(lastDayOfIsoWeek);
        var nextWeekCandidate = moment_1.default(mutableLastDay)
            .add(1, 'week')
            .isoWeekday(lastDayOfIsoWeek);
        // Calculate absolute day differences from each candidate to EOM
        var currentWeekDiff = Math.abs(mutableLastDay.diff(currentWeekCandidate, 'days'));
        var lastWeekDiff = Math.abs(mutableLastDay.diff(lastWeekCandidate, 'days'));
        var nextWeekDiff = Math.abs(mutableLastDay.diff(nextWeekCandidate, 'days'));
        // Find nearest difference
        var minDiff = Math.min(currentWeekDiff, lastWeekDiff, nextWeekDiff);
        if (minDiff === nextWeekDiff) {
            return nextWeekCandidate;
        }
        else if (minDiff === lastWeekDiff) {
            return lastWeekCandidate;
        }
        else {
            return currentWeekCandidate;
        }
    };
    return LastDayNearestEOMStrategy;
}());
exports.LastDayNearestEOMStrategy = LastDayNearestEOMStrategy;
