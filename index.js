const puppeteer = require('puppeteer');
const micro = require('micro')
const { json, send } = micro;

const server = micro(async (req, res) => {
  if (req.method !== 'POST') {
    return send(res, 404, { status: false });
  }

  const body = await json(req);
  const html = body.base64 ? String(Buffer.from(body.base64, 'base64')) : body.text;

  if (!html) {
    return send(res, 400, { status: false, error: 'no field' });
  }

  const browser = await puppeteer.launch();
  const result = { status: true };

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    // await page.pdf({ path: 'example.pdf', format: 'A4', printBackground: true }); //? Debug (gen pdf on project folder);
    result.result = (await page.pdf({ format: 'A4', printBackground: true })).toString('base64');
  } catch (error) {
    result.status = false;
    result.error = JSON.stringify(error);
  } finally {
    await browser.close();
  }

  if (!result.status) {
    return send(res, 500, result);
  }

  return result;
})

server.listen(3003);
console.log('Server ON');
