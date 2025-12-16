import cron from 'node-cron';
import { cronJobsOnEveryMinute } from './oneMinuteJobs';

cron.schedule('* * * * *', () => cronJobsOnEveryMinute());
