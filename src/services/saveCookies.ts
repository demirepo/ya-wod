import fs from "fs/promises";
import fsSync from "fs";

export async function saveCookies(page: any, file: string) {
  const cookies2save = await page.cookies();

  if (!fsSync.existsSync(`./assets`)) {
    fsSync.mkdirSync(`./assets`);
  }

  await fs.writeFile(`./assets/${file}`, JSON.stringify(cookies2save, null, 2));
}
