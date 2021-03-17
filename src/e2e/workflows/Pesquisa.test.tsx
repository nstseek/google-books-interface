import puppeteer, { Browser, Page } from 'puppeteer';

describe('test', () => {
  jest.setTimeout(60000);
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto('http://localhost:5000', { waitUntil: 'networkidle2' });
  });

  it('deve renderizar o HTML', async () => {
    expect(await page.$('html')).toBeTruthy();
  });

  afterEach(async () => {
    await page.close();
  });

  afterAll(async () => {
    await browser.close();
  });
});
