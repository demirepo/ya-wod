var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Puppeteer from "puppeteer";
import { saveCookies } from "./saveCookies.js";
import chalk from "chalk";
export const getCookies = () => __awaiter(void 0, void 0, void 0, function* () {
    const browser = yield Puppeteer.launch({
        // headless: false,
        ignoreHTTPSErrors: true,
        // args: ["--start-maximized", "--window-size=1920x1080"],
    });
    const page = yield browser.newPage();
    //   page.setViewport({ width: 1920, height: 1080 });
    page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.115 Safari/537.36 OPR/88.0.4412.74 (Edition Yx 03)");
    try {
        yield page.goto("https://yandex.ru/", {
            waitUntil: ["networkidle0", "domcontentloaded"],
        });
        yield saveCookies(page, "cookies.json");
    }
    catch (error) {
        console.log(chalk.whiteBright.bgRed("Ошибка при обновлении кук:\n"), error);
    }
    browser.close();
});
