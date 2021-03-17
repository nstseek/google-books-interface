import puppeteer, { Browser, Page } from 'puppeteer';

describe('Workflow - Pesquisa por livros', () => {
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

  afterEach(async () => {
    await page.close();
  });

  afterAll(async () => {
    await browser.close();
  });

  describe('Básico', () => {
    it('deve ser redirecionado para a rota home', async () => {
      const { pathname } = await page.evaluate(() => {
        return { pathname: window.location.pathname };
      });
      expect(pathname).toEqual('/home');
    });

    it('deve renderizar o componente base', async () => {
      await page.waitForSelector('div.App');
    });
  });

  describe('Pesquisa', () => {
    it('deve iniciar a página com o campo de pesquisa preenchido com o texto "HTML" e alguns resultados na tela', async () => {
      const value = await page.$eval(
        'input#book-query',
        (inputEl: HTMLInputElement) => inputEl.value
      );
      expect(value).toEqual('HTML');
      await page.waitForSelector('div.Book');
    });

    it('deve pesquisar pela frase inserida no campo de pesquisa', async () => {
      await page.focus('input#book-query');
      const inputValue = await page.$eval(
        'input#book-query',
        async (inputEl: HTMLInputElement) => inputEl.value
      );
      for (let i = 0; i < inputValue.length; i++) {
        await page.keyboard.press('Backspace');
      }
      await page.waitForFunction(() => !document.querySelector('div.Book'));
      await page.type('input#book-query', 'TypeScript');
      await page.waitForSelector('div.Book');
    });

    it('deve navegar pelos resultados normalmente', async () => {
      await page.waitForFunction(
        () =>
          document
            .querySelector('h5.result-info')
            .textContent.indexOf(' - Página 1 de ') >= 0
      );
      await page.click('button#next-page');
      await page.waitForSelector('div.loading');
      await page.waitForFunction(() => !document.querySelector('div.loading'));
      await page.waitForSelector('div.Book');
      await page.waitForFunction(
        () =>
          document
            .querySelector('h5.result-info')
            .textContent.indexOf(' - Página 2 de ') >= 0
      );
      await page.click('button#previous-page');
      await page.waitForSelector('div.loading');
      await page.waitForFunction(() => !document.querySelector('div.loading'));
      await page.waitForFunction(
        () =>
          document
            .querySelector('h5.result-info')
            .textContent.indexOf(' - Página 1 de ') >= 0
      );
    });
  });
});
