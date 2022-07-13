import chalk from "chalk";
import { existsSync } from "fs";
import fs from "fs/promises";
import { schedule } from "node-cron";
import Puppeteer from "puppeteer";
import { getTimedString } from "./utils/getTimedString.js";
import { loadCookies } from "./utils/loadCookies.js";
import { saveCookies } from "./utils/saveCookies.js";
import { getCookies } from "./utils/getCookies.js";

const getWods = async () => {
  //--------------------------------------------------------- инициализация

  const browser = await Puppeteer.launch({
    headless: false,
    ignoreHTTPSErrors: true,
    args: ["--start-maximized", "--window-size=1920x1080"],
    devtools: true,
  });
  const page = await browser.newPage();
  page.setViewport({ width: 1368, height: 1080 });
  page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.115 Safari/537.36 OPR/88.0.4412.74 (Edition Yx 03)"
  );
  await loadCookies(page, "cookies.json");

  //------------------------------------------------------ парсинг слов дня

  try {
    await page.goto("https://translate.yandex.ru/", {
      waitUntil: ["networkidle0", "domcontentloaded"],
    });
  } catch (error) {
    console.log(
      chalk.whiteBright.bgRed(getTimedString("Ошибка загрузки страницы:\n")),
      error
    );
  }

  try {
    // обработка капчи: получить новые куки, выход, перезапуск через pm2
    const captcha = await page.$("span.CheckboxCaptcha-LabelText");
    if (captcha) throw Error;
  } catch (error) {
    console.log(
      chalk.whiteBright.bgRed(getTimedString("Ошибка загрузки: капча\n")),
      error
    );
    getCookies();
    process.exit();
  }

  let wods: Wod[] = [];

  try {
    await page.waitForSelector(".dailyPhrase-cardContent", { timeout: 20000 });
    wods = await page.$$eval(".dailyPhrase-cardContent", (arr) =>
      arr.map((el) => {
        const date = new Date().toLocaleDateString("ru-Ru", {
          dateStyle: "short",
        });
        return {
          wod: (el.children[1] as HTMLElement).innerText,
          tr: (el.children[2] as HTMLElement).innerText,
          tr2: (el.children[3] as HTMLElement)?.innerText,
          date: date,
        };
      })
    );
  } catch (error) {
    console.log(
      chalk.whiteBright.bgRed(
        getTimedString("На найдены селекторы словарных карточек:\n")
      ),
      error
    );
  }

  //----------------------------------------------------- обновление записей
  if (existsSync(`./assets/wods`)) {
    const prevWodString: Buffer = await fs.readFile(`./assets/wods`);
    let prevWod = JSON.parse(prevWodString + "");
    if (wods) {
      wods = [...prevWod, ...wods];
    }
  }
  await fs.writeFile(`./assets/wods`, JSON.stringify(wods, null, 2));

  await saveCookies(page, "cookies.json");

  // browser.close();
};

//------------------------------------------------------------------- запуск

// schedule("0 00 8 * * *", getWods);
// console.log("Отслеживание word of the day Яндекс-переводчика начато");

getWods();
// getCookies();
