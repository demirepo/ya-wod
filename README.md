# YaWod

Tool for parsing Yandex translator's Word of the Day with Puppeteer and logging it to
PostgresQL DB.
Also provides small Express js server for getting DB entries.

Utilises node-cron for fetching WoDs on schedule.

## Installation & usage

1. Clone:

```bash
  git clone https://github.com/demirepo/ya-wod.git
```

2. Install modules and build:

```bash
  npm i && npm run build
```

3. (Optional) Set required schedule in /src/constants/cron.ts
   For instance, every day at 8.00 (set by default):

```bash
  '0 8 * * *'
```

4. Make .env file in root directory of project and put inside settings for DB,
   edit according to your actual values:

```bash
PGUSER=postgres
PGHOST=localhost
PGPASSWORD=12345678
PGDATABASE=my_db
PGPORT=5432
```

5. Run:

```bash
  $ npm start
```

## API Reference

#### To get all WoDs make request:

```http
  GET /api/wods
```

## Known issues

When run on Raspberry Pi, Ubuntu 20.04, won't work with Chromium shipped with Puppeteer.
Got to install Chromium separately:

```bash
  sudo snap install chromium
```

Path to browser should be put in /src/getWods.ts and
/src/services/getCookies.ts like this:

```js
const browser = await Puppeteer.launch({
  ignoreHTTPSErrors: true,
  executablePath: '/snap/bin/chromium', // <---
});
```

If Raspberry Pi is not the case, remove executablePath key.
