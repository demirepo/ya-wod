import fs from 'fs';
import os from 'os';
import path from 'path';

/**
 * Updates value for existing key or creates a new key=value line
 *
 * This function is a modified version of https://stackoverflow.com/a/65001580/3153583
 *
 * @param {string} key Key to update/insert
 * @param {string} value Value to update/insert
 */
export function setEnvValue(key: string, value: string) {
  const envFilePath = path.resolve(__dirname, '.env');
  // read .env file & convert to array
  const envVars = fs.readFileSync(envFilePath, 'utf-8').split(os.EOL);

  const targetLine = envVars.find((line: string) => line.split('=')[0] === key);
  if (targetLine !== undefined) {
    // update existing line
    const targetLineIndex = envVars.indexOf(targetLine);
    // replace the key/value with the new value
    envVars.splice(targetLineIndex, 1, `${key}="${value}"`);
  } else {
    // create new key value
    envVars.push(`${key}="${value}"`);
  }
  // write everything back to the file system
  fs.writeFileSync(envFilePath, envVars.join(os.EOL));
}
