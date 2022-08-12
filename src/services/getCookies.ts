import Puppeteer from 'puppeteer-core';
import { saveCookies } from './saveCookies.js';
import chalk from 'chalk';
import puppeteerOptions from './puppeteerOptions.js';

export async function getCookies() {
  console.log('Обновляю куки...');
  const browser = await Puppeteer.launch(puppeteerOptions);
  const page = await browser.newPage();

  if (process.platform === 'win32' && process.env.PUP_VISIBLE) {
    page.setViewport({ width: 1920, height: 1080 });
  }

  page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.115 Safari/537.36 OPR/88.0.4412.74 (Edition Yx 03)'
  );

  try {
    await page.goto('https://yandex.ru/', {
      waitUntil: ['networkidle0', 'domcontentloaded'],
    });
    await saveCookies(page, 'cookies.json');
    console.log('Куки перезаписаны');
  } catch (error) {
    console.log(chalk.whiteBright.bgRed('Ошибка при обновлении кук:\n'), error);
  }
  browser.close();
}
