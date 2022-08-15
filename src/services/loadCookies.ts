import { existsSync } from 'fs';
import fsPromises from 'fs/promises';
import { paths } from './../constants/paths.js';

export async function loadCookies(page: any, file: string) {
  if (existsSync(file)) {
    const cookiesString: any = await fsPromises.readFile(
      `${paths.assets}/${file}`
    );
    const cookies2load = JSON.parse(cookiesString);
    await page.setCookie(...cookies2load);
  }
}
