import puppeteer, { Browser, Page } from 'puppeteer';

describe('Workflow - Adicionando favoritos', () => {
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
    await page.evaluate(() => localStorage.clear());
    await page.evaluate(() => sessionStorage.clear());
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

  describe('Favoritos', () => {
    it('deve adicionar o primeiro livro como favorito', async () => {
      await page.click('button.favorite-book-btn');
      await page.waitForTimeout(1000);
      await page.click('button.filter');
      await page.waitForSelector('div.Book');
      expect((await page.$$('div.Book')).length).toEqual(1);
    });

    it('deve pesquisar os favoritos pela frase inserida no campo de pesquisa', async () => {
      await page.click('button.favorite-book-btn');
      await page.waitForTimeout(1000);
      await page.click('button.filter');
      await page.waitForSelector('div.Book');
      await page.focus('input#book-query');
      const inputValue = await page.$eval(
        'input#book-query',
        async (inputEl: HTMLInputElement) => inputEl.value
      );
      for (let i = 0; i < inputValue.length; i++) {
        await page.keyboard.press('Backspace');
      }
      const bookTitle = await page.$eval(
        'div.Book h3.book-title',
        (h3El) => h3El.textContent
      );
      await page.type('input#book-query', bookTitle + 'test');
      await page.waitForSelector('h3#query-msg');
      await page.waitForFunction(
        () =>
          document.querySelector('h3#query-msg').textContent ===
          'Nenhum livro encontrado'
      );
    });

    it('deve navegar pelos resultados normalmente', async () => {
      await page.waitForSelector('button.favorite-book-btn');
      let btns = await page.$$('button.favorite-book-btn');
      for (const btn of btns) {
        await btn.click();
      }
      await page.click('button#next-page');
      await page.waitForSelector('h3.book-title');
      const bookTitle = await page.$eval(
        'h3.book-title',
        (h3El) => h3El.textContent
      );
      await page.waitForSelector('button.favorite-book-btn');
      btns = await page.$$('button.favorite-book-btn');
      for (const btn of btns) {
        await btn.click();
      }
      await page.waitForSelector('div.Book');
      await page.waitForFunction(
        () =>
          document
            .querySelector('h5.result-info')
            .textContent.indexOf(' - Página 2 de ') >= 0
      );
      await page.click('button.filter');
      await page.waitForFunction(
        () =>
          document
            .querySelector('h5.result-info')
            .textContent.indexOf(' - Página 1 de 2') >= 0
      );
      await page.focus('input#book-query');
      const inputValue = await page.$eval(
        'input#book-query',
        async (inputEl: HTMLInputElement) => inputEl.value
      );
      for (let i = 0; i < inputValue.length; i++) {
        await page.keyboard.press('Backspace');
      }
      await page.type('input#book-query', bookTitle);
      await page.waitForFunction(
        () => document.querySelectorAll('div.Book').length === 1
      );
    });
  });
});
