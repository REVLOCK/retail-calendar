import { RetailCalendarWeek } from './types';
export declare class CalendarWeek implements RetailCalendarWeek {
    weekOfYear: number;
    weekOfMonth: number;
    weekOfQuarter: number;
    monthOfYear: number;
    quarterOfYear: number;
    gregorianStartDate: Date;
    gregorianEndDate: Date;
    constructor(weekOfYear: number, weekOfMonth: number, weekOfQuarter: number, monthOfYear: number, quarterOfYear: number, gregorianStartDate: Date, gregorianEndDate: Date);
}
