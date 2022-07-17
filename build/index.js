var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
import { existsSync } from "fs";
import fs from "fs/promises";
import { schedule } from "node-cron";
import Puppeteer from "puppeteer";
import { loadCookies } from "./services/loadCookies.js";
import { saveCookies } from "./services/saveCookies.js";
import { getCookies } from "./services/getCookies.js";
import { getIdiomDefinition } from "./services/getIdiomDef.js";
import { logRedError } from "./utils/logRedError.js";
function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}
const getWods = () => __awaiter(void 0, void 0, void 0, function* () {
    //-------------------------------------------------------- initialization
    var e_1, _a;
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
    //---------------------------------------------- word of the day parsing
    try {
        yield page.goto("https://translate.yandex.ru/", {
            waitUntil: ["networkidle0", "domcontentloaded"],
        });
    }
    catch (error) {
        logRedError("Ошибка загрузки страницы:\n", error);
    }
    try {
        // handling captcha: get new cookies, exit (pm2 will restart app)
        const captcha = yield page.$("span.CheckboxCaptcha-LabelText");
        if (captcha)
            throw Error;
    }
    catch (error) {
        logRedError("Ошибка загрузки: капча\n", error);
        yield getCookies();
        process.exit();
    }
    let wods = [];
    try {
        // creating and filling wod obj
        yield page.waitForSelector(".dailyPhrase-cardContent", { timeout: 30000 });
        wods = yield page.$$eval(".dailyPhrase-cardContent", (arr) => arr.map((el) => {
            var _a, _b;
            const wod = ((_a = el.children[1].textContent) === null || _a === void 0 ? void 0 : _a.trim()) || "";
            const tr = ((_b = el.children[2].textContent) === null || _b === void 0 ? void 0 : _b.trim()) || "";
            const date = new Date().toLocaleDateString("ru-Ru", {
                dateStyle: "short",
            });
            return {
                wod: wod,
                tr: tr,
                tr2: "",
                date: date,
            };
        }));
    }
    catch (error) {
        logRedError("Ошибка при парсинге словарных карточек:\n", error);
    }
    try {
        try {
            // getting second translation and capitalizing 'wod' and 'tr'
            for (var wods_1 = __asyncValues(wods), wods_1_1; wods_1_1 = yield wods_1.next(), !wods_1_1.done;) {
                let wod = wods_1_1.value;
                let tr2 = yield getIdiomDefinition(wod.wod);
                if (tr2 !== undefined)
                    wod.tr2 = tr2;
                wod.tr = capitalize(wod.tr);
                wod.wod = capitalize(wod.wod);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (wods_1_1 && !wods_1_1.done && (_a = wods_1.return)) yield _a.call(wods_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    catch (error) {
        logRedError("Ошибка запроса вторичного перевода:\n", error);
    }
    //----------------------------------------------------- updating log file
    if (existsSync(`./assets/wods`)) {
        const prevWodString = yield fs.readFile(`./assets/wods`);
        let prevWod = JSON.parse(String(prevWodString));
        if (wods) {
            wods = [...prevWod, ...wods];
        }
    }
    yield fs.writeFile(`./assets/wods`, JSON.stringify(wods, null, 2));
    yield saveCookies(page, "cookies.json");
    browser.close();
});
//------------------------------------------------------------------ launch
schedule("0 57 18 * * *", getWods);
console.log("Отслеживание word of the day Яндекс-переводчика начато");
