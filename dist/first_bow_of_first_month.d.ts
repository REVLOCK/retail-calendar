import moment from 'moment';
import { LastDayStrategy } from './types';
export declare class FirstBOWOfFirstMonth implements LastDayStrategy {
    getLastDayForGregorianLastDay(lastDayOfGregorianYear: moment.Moment, lastDayOfIsoWeek: number): moment.Moment;
}
