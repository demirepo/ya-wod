import fsPromises from 'fs/promises';
import fs from 'fs';
import { path } from './../constants/paths.js';

export async function saveCookies(page: any, file: string) {
  const cookies2save = await page.cookies();

  if (!fs.existsSync(path.wod)) {
    fs.mkdirSync(path.wod);
  }

  await fsPromises.writeFile(
    `${path.wod}/${file}`,
    JSON.stringify(cookies2save, null, 2)
  );
}
