var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { existsSync } from "fs";
import fs from "fs/promises";
export function loadCookies(page, file) {
    return __awaiter(this, void 0, void 0, function* () {
        if (existsSync(file)) {
            const cookiesString = yield fs.readFile(`./assets/${file}`);
            const cookies2load = JSON.parse(cookiesString);
            yield page.setCookie(...cookies2load);
        }
    });
}
