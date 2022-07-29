import { schedule } from 'node-cron';
import { getWods } from './services/getWods.js';
import pgdb from './services/postgres.js';
import { cronjob as CRON_JOB} from './constants/cron.js';

//------------------------------------------------------------------ launch

const wods2db = async () => {
  const wods = await getWods();

  for (let wod of wods) {
    await pgdb.query(
      'INSERT INTO wods(src,dst,dst_extended,date) values($1,$2,$3,$4)',
      [wod.wod, wod.tr, wod.tr2, wod.date]
    );
    console.log('Добавлено в БД: ', wod.wod);
  }
};

schedule(CRON_JOB, wods2db);
console.log('Отслеживание word of the day Яндекс-переводчика начато с расписанием cron: ', CRON_JOB);
