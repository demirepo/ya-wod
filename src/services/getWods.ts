import Puppeteer from 'puppeteer';
import { loadCookies } from './loadCookies.js';
import { saveCookies } from './saveCookies.js';
import { getCookies } from './getCookies.js';
import { getIdiomDefinition } from './getIdiomDef.js';
import { logRedError } from '../utils/logRedError.js';

export const getWods = async () => {
  //-------------------------------------------------------- initialization

  const browser = await Puppeteer.launch({
    //    headless: false,
    ignoreHTTPSErrors: true,
    executablePath: 'chromium-browser',
    //    args: ["--start-maximized", "--window-size=1920x1080"],
    //    devtools: true,
  });
  const page = await browser.newPage();
  page.setViewport({ width: 1368, height: 1080 });
  page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.115 Safari/537.36 OPR/88.0.4412.74 (Edition Yx 03)'
  );
  await loadCookies(page, 'cookies.json');

  //---------------------------------------------- word of the day parsing

  try {
    await page.goto('https://translate.yandex.ru/', {
      waitUntil: ['networkidle0', 'domcontentloaded'],
    });
  } catch (error) {
    logRedError('Ошибка загрузки страницы:\n', error);
  }

  try {
    // handling captcha: get new cookies, exit (pm2 will restart app)
    const captcha = await page.$('span.CheckboxCaptcha-LabelText');
    if (captcha) throw Error;
  } catch (error) {
    logRedError('Ошибка загрузки: капча\n', error);

    await getCookies();
    process.exit();
  }

  let wods: Wod[] = [];

  try {
    // creating and filling wod obj
    await page.waitForSelector('.dailyPhrase-cardContent', { timeout: 30000 });

    wods = await page.$$eval('.dailyPhrase-cardContent', (arr) =>
      arr.map((el) => {
        const wod = (el.children[1] as HTMLElement).textContent?.trim() || '';

        const tr = (el.children[2] as HTMLElement).textContent?.trim() || '';

        const date = new Date().toLocaleDateString('ru-Ru', {
          dateStyle: 'short',
        });

        return {
          wod: wod,
          tr: tr,
          tr2: '',
          date: date,
        };
      })
    );
  } catch (error) {
    logRedError('Ошибка при парсинге словарных карточек:\n', error);
  }

  const capitalize = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  try {
    // getting second translation and capitalizing 'wod' and 'tr'
    for await (let wod of wods) {
      let tr2 = await getIdiomDefinition(wod.wod);
      if (tr2 !== undefined) wod.tr2 = tr2;

      wod.tr = capitalize(wod.tr);
      wod.wod = capitalize(wod.wod);
    }
  } catch (error) {
    logRedError('Ошибка запроса вторичного перевода:\n', error);
  }

  await saveCookies(page, 'cookies.json');

  browser.close();

  return wods;
};
