import moment from 'moment';
import { LastDayStrategy } from './types';
export declare class LastDayBeforeEOMStrategy implements LastDayStrategy {
    getLastDayForGregorianLastDay(lastDayOfGregorianYear: moment.Moment, lastDayOfIsoWeek: number): moment.Moment;
}
