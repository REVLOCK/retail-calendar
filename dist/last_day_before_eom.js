"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var moment_1 = __importDefault(require("moment"));
var LastDayBeforeEOMStrategy = /** @class */ (function () {
    function LastDayBeforeEOMStrategy() {
    }
    LastDayBeforeEOMStrategy.prototype.getLastDayForGregorianLastDay = function (lastDayOfGregorianYear, lastDayOfIsoWeek) {
        var candidate = moment_1.default(lastDayOfGregorianYear).isoWeekday(lastDayOfIsoWeek);
        if (candidate.month() !== lastDayOfGregorianYear.month()) {
            candidate.subtract(1, 'week');
        }
        return candidate;
    };
    return LastDayBeforeEOMStrategy;
}());
exports.LastDayBeforeEOMStrategy = LastDayBeforeEOMStrategy;
