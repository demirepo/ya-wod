import fsPromises from 'fs/promises';
import fs from 'fs';
import { paths } from './../constants/paths.js';

export async function saveCookies(page: any, file: string) {
  const cookies2save = await page.cookies();

  if (!fs.existsSync(paths.assets)) {
    fs.mkdirSync(paths.assets);
  }

  await fsPromises.writeFile(
    `${paths.assets}/${file}`,
    JSON.stringify(cookies2save, null, 2)
  );
}
