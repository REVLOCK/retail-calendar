import moment from 'moment';
import { LastDayStrategy } from './types';
export declare class LastDayISO8601Strategy implements LastDayStrategy {
    getLastDayForGregorianLastDay(lastDayOfGregorianYear: moment.Moment, lastDayOfIsoWeek: number): moment.Moment;
}
