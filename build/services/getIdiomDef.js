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
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();
const sid = process.env.SID;
const yu = process.env.YU;
export function getIdiomDefinition(text) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`https://dictionary.yandex.net/dicservice.json/lookupMultiple?sid=${sid}&ui=ru&srv=tr-text&text=${text}&type=regular%2Csyn%2Cant%2Cderiv&lang=en-ru&flags=15782&dict=en-ru.regular%2Cen.syn%2Cen.ant%2Cen.deriv&yu=${yu}`);
            const json = (yield response.json());
            // выбираем из ответа сервера первое определение с пометкой "идиома"
            const def = (_b = (_a = json["en-ru"]) === null || _a === void 0 ? void 0 : _a.def[0]) === null || _b === void 0 ? void 0 : _b.tr.filter((el) => el.idiom === true)[0].def;
            return def;
        }
        catch (error) {
            console.log(chalk.whiteBright.bgRed("Ошибка API при запросе вторичного перевода:\n"), error);
        }
    });
}
