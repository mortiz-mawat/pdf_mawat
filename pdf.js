const puppeteer = require('puppeteer');
const micro = require('micro')
const queue = require('async/queue');


async function aa() {
  const html = 'PGRpdj5hYWFhPC9kaXY+';
  const browser = await puppeteer.launch();
  const result = { status: true };

  try {
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

  console.log(result);
}

aa();
