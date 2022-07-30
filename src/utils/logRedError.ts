import chalk from 'chalk';
import { getTimedString } from './getTimedString.js';

export function logRedError(text: string, error: unknown) {
  console.log(chalk.whiteBright.bgRed(getTimedString(text)), error);
}
