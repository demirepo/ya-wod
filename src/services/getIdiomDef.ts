import chalk from "chalk";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const sid = process.env.SID;
const yu = process.env.YU;

export async function getIdiomDefinition(text: string) {
  console.log(text);
  try {
    const response = await fetch(
      `https://dictionary.yandex.net/dicservice.json/lookupMultiple?sid=${sid}&ui=ru&srv=tr-text&text=${text}&type=regular%2Csyn%2Cant%2Cderiv&lang=en-ru&flags=15782&dict=en-ru.regular%2Cen.syn%2Cen.ant%2Cen.deriv&yu=${yu}`
    );

    const json = (await response.json()) as Translation;

    // выбираем из ответа сервера первое определение с пометкой "идиома"
    const def = json["en-ru"]?.def;

    if (def !== undefined) {
      return def[0].tr.filter((el) => el.idiom === true)[0].def as string;
    }
  } catch (error) {
    console.log(
      chalk.whiteBright.bgRed("Ошибка API при запросе вторичного перевода:\n"),
      error
    );
  }
}
