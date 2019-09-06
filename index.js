const puppeteer = require('puppeteer');
const micro     = require('micro')
const queue     = require('async/queue');

const { json, send } = micro;
const REQUESTQUEUELIMIT = 2;

const q = queue(async ({ res, html }, callback) => {
  try {
    const browser = await puppeteer.launch({ args: ['--no-sandbox --disable-setuid-sandbox'] });
    const result = { status: true };

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.pdf({ path: 'example.pdf', format: 'A4', printBackground: true }); //? Debug (gen pdf on project folder);
    result.result = (await page.pdf({ format: 'A4', printBackground: true })).toString('base64');
  } catch (error) {
    console.log(error);
    result.status = false;
    result.error = JSON.stringify(error);
  } finally {
    await browser.close();
  }

  if (!result.status) {
    send(res, 500, result);
    return callback();
  }

  send(res, 200, result);
  return callback();
}, REQUESTQUEUELIMIT);

const server = micro(async (req, res) => {
  if (req.method !== 'POST') {
    return send(res, 404, { status: false });
  }

  const body = await json(req);
  const html = body.base64 ? String(Buffer.from(body.base64, 'base64')) : body.text;

  if (!html) {
    return send(res, 400, { status: false, error: 'no field' });
  }

  q.push({ req, res, html });
})

server.listen(3003);
console.log('Server ON');
