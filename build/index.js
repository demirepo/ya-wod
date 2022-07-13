var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import chalk from "chalk";
import { existsSync } from "fs";
import fs from "fs/promises";
import Puppeteer from "puppeteer";
import { getTimedString } from "./utils/getTimedString.js";
import { loadCookies } from "./utils/loadCookies.js";
import { saveCookies } from "./utils/saveCookies.js";
import { getCookies } from "./utils/getCookies.js";
const getWods = () => __awaiter(void 0, void 0, void 0, function* () {
    //--------------------------------------------------------- инициализация
    const browser = yield Puppeteer.launch({
        headless: false,
        ignoreHTTPSErrors: true,
        args: ["--start-maximized", "--window-size=1920x1080"],
        devtools: true,
    });
    const page = yield browser.newPage();
    page.setViewport({ width: 1368, height: 1080 });
    page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.115 Safari/537.36 OPR/88.0.4412.74 (Edition Yx 03)");
    yield loadCookies(page, "cookies.json");
    //------------------------------------------------------ парсинг слов дня
    try {
        yield page.goto("https://translate.yandex.ru/", {
            waitUntil: ["networkidle0", "domcontentloaded"],
        });
    }
    catch (error) {
        console.log(chalk.whiteBright.bgRed(getTimedString("Ошибка загрузки страницы:\n")), error);
    }
    try {
        // обработка капчи: получить новые куки, выход, перезапуск через pm2
        const captcha = yield page.$("span.CheckboxCaptcha-LabelText");
        if (captcha)
            throw Error;
    }
    catch (error) {
        console.log(chalk.whiteBright.bgRed(getTimedString("Ошибка загрузки: капча\n")), error);
        getCookies();
        process.exit();
    }
    let wods = [];
    try {
        yield page.waitForSelector(".dailyPhrase-cardContent", { timeout: 20000 });
        wods = yield page.$$eval(".dailyPhrase-cardContent", (arr) => arr.map((el) => {
            var _a;
            const date = new Date().toLocaleDateString("ru-Ru", {
                dateStyle: "short",
            });
            return {
                wod: el.children[1].innerText,
                tr: el.children[2].innerText,
                tr2: (_a = el.children[3]) === null || _a === void 0 ? void 0 : _a.innerText,
                date: date,
            };
        }));
    }
    catch (error) {
        console.log(chalk.whiteBright.bgRed(getTimedString("На найдены селекторы словарных карточек:\n")), error);
    }
    //----------------------------------------------------- обновление записей
    if (existsSync(`./assets/wods`)) {
        const prevWodString = yield fs.readFile(`./assets/wods`);
        let prevWod = JSON.parse(prevWodString + "");
        if (wods) {
            wods = [...prevWod, ...wods];
        }
    }
    yield fs.writeFile(`./assets/wods`, JSON.stringify(wods, null, 2));
    yield saveCookies(page, "cookies.json");
    // browser.close();
});
//------------------------------------------------------------------- запуск
// schedule("0 00 8 * * *", getWods);
// console.log("Отслеживание word of the day Яндекс-переводчика начато");
getWods();
// getCookies();
