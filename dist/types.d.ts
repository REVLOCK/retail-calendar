export declare enum WeekGrouping {
    Group445 = 0,
    Group544 = 1,
    Group454 = 2,
    Group444 = 3
}
export declare enum LastDayOfWeek {
    Monday = 1,
    Tuesday = 2,
    Wednesday = 3,
    Thursday = 4,
    Friday = 5,
    Saturday = 6,
    Sunday = 7
}
export declare enum LastMonthOfYear {
    January = 0,
    February = 1,
    March = 2,
    April = 3,
    May = 4,
    June = 5,
    July = 6,
    August = 7,
    September = 8,
    October = 9,
    November = 10,
    December = 11
}
export declare enum WeekCalculation {
    LastDayBeforeEOM = 0,
    LastDayBeforeEomExceptLeapYear = 1,
    LastDayNearestEOM = 2,
    FirstBOWOfFirstMonth = 3,
    ISO_8601 = 4
}
export declare enum LeapYearStrategy {
    Restated = 0,
    DropLastWeek = 1,
    AddToPenultimateMonth = 2,
    AddToLastMonth = 3
}
export interface RetailCalendarOptions {
    weekGrouping: WeekGrouping;
    lastDayOfWeek: LastDayOfWeek;
    lastMonthOfYear: LastMonthOfYear | number;
    weekCalculation: WeekCalculation;
    /**
     * If LeapYearStrategy.Restated, 53rd week will belong to last month in year. First week won't belong to any month.
     * If LeapYearStrategy.DropLastWeek, 53rd week won't belong to any month in year. First week will belong to the first month.
     * Note: restated: true is a deprecated option that is replaced by LeapYearStrategy.Restated
     */
    leapYearStrategy?: LeapYearStrategy;
    /** @deprecated use leapYearStrategy field instead */
    restated?: boolean;
    beginningMonthIndex?: number;
}
export declare const NRFCalendarOptions: RetailCalendarOptions;
export declare type RetailCalendarConstructor = new (calendarOptions: RetailCalendarOptions, year: number) => RetailCalendar;
export interface RetailCalendar {
    leapYearStrategy: LeapYearStrategy;
    year: number;
    numberOfWeeks: number;
    months: RetailCalendarMonth[];
    weeks: RetailCalendarWeek[];
}
export interface RetailCalendarWeek {
    weekOfYear: number;
    weekOfMonth: number;
    weekOfQuarter: number;
    monthOfYear: number;
    quarterOfYear: number;
    gregorianStartDate: Date;
    gregorianEndDate: Date;
}
export interface RetailCalendarMonth {
    monthOfYear: number;
    quarterOfYear: number;
    numberOfWeeks: number;
    weeks: RetailCalendarWeek[];
    gregorianStartDate: Date;
    gregorianEndDate: Date;
}
export interface LastDayStrategy {
    getLastDayForGregorianLastDay(lastDayOfGregorianYear: moment.Moment, isoLastDayOfWeek: number): moment.Moment;
}
export declare type WeekOfCalendar = {
    calendar: RetailCalendar;
    week: RetailCalendarWeek;
};
