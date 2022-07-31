import { schedule } from 'node-cron';
import { getWods } from './services/getWods.js';
import pgdb from './services/postgres.js';
import { cronjob as CRON_JOB } from './constants/cron.js';

import express from 'express';
import wodsRouter from './routes/wods.router.js';
import dotenv from 'dotenv';

process.stdout.write('\x1Bc'); // clear screen

//------------------------------------------------------------------ server
dotenv.config();

const PORT = process.env.APP_PORT || 5000;

const app = express();

app.use(express.json());
app.use('/api', wodsRouter);

//----------------------------------------------------------------- wods2db

const wods2db = async () => {
  let wods;

  try {
    wods = await getWods();
  } catch (error) {
    console.log('Ошибка при пролучении wods', error);
  }

  try {
    if (wods) {
      for (let wod of wods) {
        await pgdb.query(
          'INSERT INTO wods(src,dst,dst_extended,date) values($1,$2,$3,$4)',
          [wod.wod, wod.tr, wod.tr2, wod.date]
        );
        console.log('Добавлено в БД: ', wod.wod);
      }
    }
  } catch (error) {
    console.log('Ошибка записи в БД', error);
  }
};

//------------------------------------------------------------------ init

const init = () => {
  schedule(CRON_JOB, wods2db);
  console.log(
    "Started watching Yandex translator's wod on schedule: ",
    CRON_JOB
  );

  try {
    app.listen(PORT, () => {
      console.log(`Started server at ${PORT} port`);
    });
  } catch (error) {
    console.log('Ошибка запуска сервера', error);
  }
};

init();
