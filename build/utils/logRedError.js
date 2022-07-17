import chalk from "chalk";
import { getTimedString } from "./getTimedString.js";
export function logRedError(text, error) {
    console.log(chalk.whiteBright.bgRed(getTimedString(text)), error);
}
