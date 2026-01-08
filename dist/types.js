"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WeekGrouping;
(function (WeekGrouping) {
    WeekGrouping[WeekGrouping["Group445"] = 0] = "Group445";
    WeekGrouping[WeekGrouping["Group544"] = 1] = "Group544";
    WeekGrouping[WeekGrouping["Group454"] = 2] = "Group454";
    WeekGrouping[WeekGrouping["Group444"] = 3] = "Group444";
    WeekGrouping[WeekGrouping["Custom"] = 4] = "Custom";
})(WeekGrouping = exports.WeekGrouping || (exports.WeekGrouping = {}));
var LastDayOfWeek;
(function (LastDayOfWeek) {
    LastDayOfWeek[LastDayOfWeek["Monday"] = 1] = "Monday";
    LastDayOfWeek[LastDayOfWeek["Tuesday"] = 2] = "Tuesday";
    LastDayOfWeek[LastDayOfWeek["Wednesday"] = 3] = "Wednesday";
    LastDayOfWeek[LastDayOfWeek["Thursday"] = 4] = "Thursday";
    LastDayOfWeek[LastDayOfWeek["Friday"] = 5] = "Friday";
    LastDayOfWeek[LastDayOfWeek["Saturday"] = 6] = "Saturday";
    LastDayOfWeek[LastDayOfWeek["Sunday"] = 7] = "Sunday";
})(LastDayOfWeek = exports.LastDayOfWeek || (exports.LastDayOfWeek = {}));
var LastMonthOfYear;
(function (LastMonthOfYear) {
    LastMonthOfYear[LastMonthOfYear["January"] = 0] = "January";
    LastMonthOfYear[LastMonthOfYear["February"] = 1] = "February";
    LastMonthOfYear[LastMonthOfYear["March"] = 2] = "March";
    LastMonthOfYear[LastMonthOfYear["April"] = 3] = "April";
    LastMonthOfYear[LastMonthOfYear["May"] = 4] = "May";
    LastMonthOfYear[LastMonthOfYear["June"] = 5] = "June";
    LastMonthOfYear[LastMonthOfYear["July"] = 6] = "July";
    LastMonthOfYear[LastMonthOfYear["August"] = 7] = "August";
    LastMonthOfYear[LastMonthOfYear["September"] = 8] = "September";
    LastMonthOfYear[LastMonthOfYear["October"] = 9] = "October";
    LastMonthOfYear[LastMonthOfYear["November"] = 10] = "November";
    LastMonthOfYear[LastMonthOfYear["December"] = 11] = "December";
})(LastMonthOfYear = exports.LastMonthOfYear || (exports.LastMonthOfYear = {}));
var WeekCalculation;
(function (WeekCalculation) {
    WeekCalculation[WeekCalculation["LastDayBeforeEOM"] = 0] = "LastDayBeforeEOM";
    WeekCalculation[WeekCalculation["LastDayBeforeEomExceptLeapYear"] = 1] = "LastDayBeforeEomExceptLeapYear";
    WeekCalculation[WeekCalculation["LastDayNearestEOM"] = 2] = "LastDayNearestEOM";
    WeekCalculation[WeekCalculation["FirstBOWOfFirstMonth"] = 3] = "FirstBOWOfFirstMonth";
    WeekCalculation[WeekCalculation["ISO_8601"] = 4] = "ISO_8601";
})(WeekCalculation = exports.WeekCalculation || (exports.WeekCalculation = {}));
var LeapYearStrategy;
(function (LeapYearStrategy) {
    LeapYearStrategy[LeapYearStrategy["Restated"] = 0] = "Restated";
    LeapYearStrategy[LeapYearStrategy["DropLastWeek"] = 1] = "DropLastWeek";
    LeapYearStrategy[LeapYearStrategy["AddToPenultimateMonth"] = 2] = "AddToPenultimateMonth";
    LeapYearStrategy[LeapYearStrategy["AddToLastMonth"] = 3] = "AddToLastMonth";
})(LeapYearStrategy = exports.LeapYearStrategy || (exports.LeapYearStrategy = {}));
exports.NRFCalendarOptions = {
    weekGrouping: WeekGrouping.Group454,
    lastDayOfWeek: LastDayOfWeek.Saturday,
    lastMonthOfYear: LastMonthOfYear.January,
    weekCalculation: WeekCalculation.LastDayNearestEOM,
    leapYearStrategy: LeapYearStrategy.Restated,
};
