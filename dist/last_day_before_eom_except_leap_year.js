"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var last_day_before_eom_1 = require("./last_day_before_eom");
var moment_1 = __importDefault(require("moment"));
var LastDayBeforeEOMExceptLeapYearStrategy = /** @class */ (function () {
    function LastDayBeforeEOMExceptLeapYearStrategy() {
    }
    LastDayBeforeEOMExceptLeapYearStrategy.prototype.getLastDayForGregorianLastDay = function (lastDayOfGregorianYear, lastDayOfIsoWeek) {
        var lastDayOfNextGregorianYear = moment_1.default(lastDayOfGregorianYear)
            .add(1, 'day')
            .endOf('year');
        var lastDayOfThisYear = new last_day_before_eom_1.LastDayBeforeEOMStrategy().getLastDayForGregorianLastDay(lastDayOfGregorianYear, lastDayOfIsoWeek);
        var lastDayOfNextYear = new last_day_before_eom_1.LastDayBeforeEOMStrategy().getLastDayForGregorianLastDay(lastDayOfNextGregorianYear, lastDayOfIsoWeek);
        if (lastDayOfNextYear.diff(lastDayOfThisYear, 'week') === 53) {
            return moment_1.default(lastDayOfThisYear).add(1, 'week');
        }
        return lastDayOfThisYear;
    };
    return LastDayBeforeEOMExceptLeapYearStrategy;
}());
exports.LastDayBeforeEOMExceptLeapYearStrategy = LastDayBeforeEOMExceptLeapYearStrategy;
