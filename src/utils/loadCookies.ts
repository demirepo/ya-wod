import { existsSync } from "fs";
import fs from "fs/promises";

export async function loadCookies(page: any, file: string) {
  if (existsSync(file)) {
    const cookiesString: any = await fs.readFile(`./assets/${file}`);
    const cookies2load = JSON.parse(cookiesString);
    await page.setCookie(...cookies2load);
  }
}
