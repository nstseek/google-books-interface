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
    await page.evaluate(() => sessionStorage.clear());
    await page.evaluate(() => localStorage.clear());
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

  describe('Detalhes', () => {
    it('deve abrir o primeiro livro para ver mais detalhes e voltar a tela principal', async () => {
      await page.click('div.Book');
      expect(await page.url()).toContain('http://localhost:5000/livro/');
      await page.waitForFunction(() => !document.querySelector('div.loading'));
      await page.waitForSelector('img#book-thumb');
      await page.waitForSelector('h3.book-title');
      await page.waitForSelector('h5.book-authors');
      await page.waitForSelector('h6.book-year');
      await page.waitForSelector('h4.price');
      await page.waitForSelector('p.book-desc');
      await page.click('button#go-back');
      expect(await page.url()).toEqual('http://localhost:5000/home');
    });

    it('deve abrir o primeiro livro para ver mais detalhes e ir até a pagina do livro no Google Books', async () => {
      await page.click('div.Book');
      expect(await page.url()).toContain('http://localhost:5000/livro/');
      await page.waitForFunction(() => !document.querySelector('div.loading'));
      await page.click('button#see-more');
    });

    it('deve favoritar o livro e ver o mesmo na tela de consulta com filtro ativado', async () => {
      await page.click('div.Book');
      expect(await page.url()).toContain('http://localhost:5000/livro/');
      await page.waitForFunction(() => !document.querySelector('div.loading'));
      await page.click('button#toggle-favorite');
      const bookTitle = await page.$eval(
        'h3.book-title',
        (h3El) => h3El.textContent
      );
      await page.click('button#go-back');
      await page.waitForFunction(() => window.location.pathname === '/home');
      await page.waitForSelector('button.filter');
      await page.click('button.filter');
      await page.waitForSelector('h3.book-title');
      expect(await page.$$('h3.book-title')).toHaveLength(1);
      expect(
        await page.$eval('div.Book h3.book-title', (h3El) => h3El.textContent)
      ).toEqual(bookTitle);
    });
  });
});
