import dotenv from 'dotenv';

dotenv.config();

const winExecPath = 'C:\\Program Files\\chrome-win\\chrome.exe';
const linuxExecPath = '/snap/bin/chromium';
const withHead = {
  headless: false,
  args: ['--start-maximized', '--window-size=1920x1080'],
};

let puppeteerOptions = {
  ignoreHTTPSErrors: true,
};

switch (process.platform) {
  case 'win32':
    puppeteerOptions = {
      ...puppeteerOptions,
      ...{ executablePath: winExecPath },
    };

    if (process.env.PUP_VISIBLE) {
      console.log('выполняется слияние');

      puppeteerOptions = {
        ...puppeteerOptions,
        ...withHead,
      };
    }
    break;

  case 'linux':
    puppeteerOptions = {
      ...puppeteerOptions,
      ...{ executablePath: linuxExecPath },
    };
    break;

  default:
    break;
}

console.log('puppeteerOptions:', puppeteerOptions);

export default puppeteerOptions;
