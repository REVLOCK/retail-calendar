import { RetailCalendarMonth, RetailCalendarWeek } from './types';
export declare class CalendarMonth implements RetailCalendarMonth {
    monthOfYear: number;
    quarterOfYear: number;
    numberOfWeeks: number;
    weeks: RetailCalendarWeek[];
    gregorianStartDate: Date;
    gregorianEndDate: Date;
    constructor(monthOfYear: number, quarterOfYear: number, numberOfWeeks: number, weeks: RetailCalendarWeek[], gregorianStartDate: Date, gregorianEndDate: Date);
}
