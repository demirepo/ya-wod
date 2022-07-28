import fs from "fs/promises";
import fsSync from "fs";
import { path } from "./../constants/paths.js";

export async function saveCookies(page: any, file: string) {
  const cookies2save = await page.cookies();

  if (!fsSync.existsSync(path.wod)) {
    fsSync.mkdirSync(path.wod);
  }

  await fs.writeFile(
    `${path.wod}/${file}`,
    JSON.stringify(cookies2save, null, 2)
  );
}
