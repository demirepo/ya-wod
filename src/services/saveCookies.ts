import fs from "fs/promises";

export async function saveCookies(page: any, file: string) {
  const cookies2save = await page.cookies();
  await fs.writeFile(`./assets/${file}`, JSON.stringify(cookies2save, null, 2));
}
