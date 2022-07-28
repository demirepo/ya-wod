import { schedule } from 'node-cron';
import { getWods } from './services/getWods.js';
import pgdb from './services/postgres.js';

//------------------------------------------------------------------ launch

const wods2db = async () => {
  const wods = await getWods();

  for (let wod of wods) {
    await pgdb.query(
      'INSERT INTO wods(src,dst,dst_extended,date) values($1,$2,$3,$4)',
      [wod.wod, wod.tr, wod.tr2, wod.date]
    );
  }
};

schedule('0 8 * * *', wods2db);
console.log('Отслеживание word of the day Яндекс-переводчика начато');
