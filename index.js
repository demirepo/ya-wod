import Puppeteer from "puppeteer";
import fs from "fs/promises";
import { existsSync } from "fs";
import { schedule } from "node-cron";
import chalk from "chalk";

//------------------------------------------------------ получение кукиз
const getCookies = async () => {
  const browser = await Puppeteer.launch({
    headless: false,
    ignoreHTTPSErrors: true,
    args: ["--start-maximized", "--window-size=1920x1080"],
  });
  const page = await browser.newPage();
  page.setViewport({ width: 1920, height: 1080 });
  page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.115 Safari/537.36 OPR/88.0.4412.74 (Edition Yx 03)"
  );

  try {
    await page.goto("https://yandex.ru/", {
      waitUntil: ["networkidle0", "domcontentloaded"],
    });
    await saveCookies(page, "cookies.json");
  } catch (error) {
    console.log(chalk.whiteBright.bgRed("Ошибка загрузки страницы:\n"), error);
  }
  browser.close();
};

//-------------------------------------------- получение слов дня Яндекса

const getWods = async () => {
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
    const captcha = await page.$("span.CheckboxCaptcha-LabelText");
    if (captcha) throw Error;
  } catch (error) {
    console.log(
      chalk.whiteBright.bgRed(getTimedString("Ошибка загрузки: капча\n")),
      error
    );
    // process.exit();
  }

  let wod;
  try {
    await page.waitForSelector(".dailyPhrase-cardContent", { timeout: 20000 });
    wod = await page.$$eval(".dailyPhrase-cardContent", (arr) =>
      arr.map((el) => {
        const date = new Date().toLocaleDateString("ru-Ru", {
          dateStyle: "short",
        });
        return {
          wod: el.children[1].innerText,
          tr: el.children[2].innerText,
          tr2: el.children[3]?.innerText,
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
    const prevWodString = await fs.readFile(`./assets/wods`);
    let prevWod = JSON.parse(prevWodString);
    wod = [...prevWod, ...wod];
  }
  await fs.writeFile(`./assets/wods`, JSON.stringify(wod, null, 2));

  await saveCookies(page, "cookies.json");

  // browser.close();
};

//------------------------------------------------ вспомогательные функции

async function loadCookies(page, file) {
  if (existsSync(file)) {
    const cookiesString = await fs.readFile(`./assets/${file}`);
    const cookies2load = JSON.parse(cookiesString);
    await page.setCookie(...cookies2load);
  }
}

async function saveCookies(page, file) {
  const cookies2save = await page.cookies();
  await fs.writeFile(`./assets/${file}`, JSON.stringify(cookies2save, null, 2));
}

function getTimedString(str) {
  const timedate = new Date();
  const time = timedate.toLocaleTimeString("ru-Ru");
  const date = timedate.toLocaleDateString("ru-Ru", { dateStyle: "long" });
  return `${date} ${time}   ${str}`;
}

//------------------------------------------------------------------- запуск

// schedule("0 00 8 * * *", getWods);
// console.log("Отслеживание word of the day Яндекс-переводчика начато");

getWods();
// getCookies();

// const now = new Date().toLocaleTimeString("ru-Ru", {
//   dateStyle: "short",
// });
// console.log(now);
