const puppeteer = require('puppeteer');
const micro     = require('micro')
const queue     = require('async/queue');

const { json, send } = micro;
const REQUESTQUEUELIMIT = 2;

const q = queue(async ({ res, html, req_options }, callback) => {
  const browser = await puppeteer.launch();
  const result = { status: true };

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    // await page.pdf({ path: 'example.pdf', format: 'A4', printBackground: true }); //? Debug (gen pdf on project folder);
    const options = {
      format: req_options.format || 'A4',
      printBackground: req_options.printBackground || true,
      displayHeaderFooter: req_options.displayHeaderFooter || false,
      headerTemplate: req_options.headerTemplate || undefined,
      footerTemplate: req_options.footerTemplate || undefined,
      scale: req_options.scale || 1,
      landscape: req_options.landscape || false,
      pageRanges: req_options.pageRanges || '',
      margin: req_options.margin || undefined,
      width: req_options.width || undefined,
      height: req_options.height || undefined,
    };
    result.result = (await page.pdf(options)).toString('base64');
  } catch (error) {
    console.log(error);
    result.status = false;
    result.error = JSON.stringify(error);
  }

  await browser.close();

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

  const req_options = body.options || {};

  q.push({ req, res, html, req_options });
})

server.listen(3003);
console.log('Server ON');
