const puppeteer = require('puppeteer');
const micro     = require('micro')
const queue     = require('async/queue');
const config = require('./config');

const { json, send } = micro;
const REQUESTQUEUELIMIT = 2;

async function digestQueue({ res, html, options }, callback) {
  const browser = await puppeteer.launch();
  const result = { status: true };

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    // await page.pdf({ path: 'example.pdf', format: 'A4', printBackground: true }); //? Debug (gen pdf on project folder);

    const pdfOptions = {
      format: "A4",
      printBackground: true,
      displayHeaderFooter: false,
      scale: 1,
      landscape: false,
      pageRanges: "",
      ...options
    };

    result.result = (await page.pdf(pdfOptions)).toString("base64");
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
}

const printPdfQueue = queue(digestQueue, REQUESTQUEUELIMIT);

const server = micro(async (req, res) => {
  if (req.method !== 'POST') {
    return send(res, 404, { status: false });
  }

  const body = await json(req, { limit: '30mb' }).catch(() => ({}));

  const html = body.base64 ? String(Buffer.from(body.base64, 'base64')) : body.text;
  if (!html) {
    return send(res, 400, { status: false, error: 'HTML base64 not provided' });
  }

  const options = body.options || {};

  printPdfQueue.push({ req, res, html, options });
})

server.listen(config.port, () => {
  console.log(`Server ON: http://localhost:${config.port}`);
});
