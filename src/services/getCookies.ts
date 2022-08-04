import Puppeteer from 'puppeteer';
import { saveCookies } from './saveCookies.js';
import chalk from 'chalk';

export async function getCookies() {
  console.log('Обновляю куки...');
  const browser = await Puppeteer.launch({
    // headless: false,
    ignoreHTTPSErrors: true,
    // executablePath: '/snap/bin/chromium',
    // args: ['--start-maximized', '--window-size=1920x1080'],
  });
  const page = await browser.newPage();
  //   page.setViewport({ width: 1920, height: 1080 });
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
