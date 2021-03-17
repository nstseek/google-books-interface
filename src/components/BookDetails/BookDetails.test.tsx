let mockBook = MockBook;

const mockAxios = jest.fn();
jest.mock('axios', () => ({
  get: (url) => mockAxios(url)
}));

const mockUiCtx = {
  pushLoading: jest.fn(),
  popLoading: jest.fn(),
  addModal: jest.fn()
};
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: () => mockUiCtx
}));

const mockHistory = {
  push: jest.fn()
};
jest.mock('react-router', () => ({
  useHistory: () => mockHistory,
  useParams: () => ({
    id: mockBook.id
  })
}));

const mockWindow = {
  open: jest.fn()
};
jest.mock('utils/window', () => ({
  open: (url) => mockWindow.open(url)
}));

const mockAddFavorite = jest.fn();
const mockRemoveFavorite = jest.fn();
jest.mock('utils/favorites', () => ({
  addFavorite: (book) => mockAddFavorite(book),
  removeFavorite: (book) => mockRemoveFavorite(book)
}));

import { mount, ReactWrapper } from 'enzyme';
import MockBook from 'mocks/books';
import moment from 'moment';
import { act } from 'react-dom/test-utils';
import routes from 'routes';
import BookDetails from './BookDetails';

describe('<BookDetails />', () => {
  let component: ReactWrapper<typeof BookDetails>;

  const buildComponent = async () => {
    component = mount(<BookDetails />);
    await act(async () => {
      await Promise.resolve(component);
      await new Promise((resolve) => setImmediate(resolve));
      component.update();
    });
  };

  beforeEach(async () => {
    localStorage.clear();
    mockBook = MockBook;
    mockAxios.mockResolvedValue({ data: mockBook });
    jest.clearAllMocks();
    await buildComponent();
  });

  it('deve montar', () => {
    expect(component.length).toBe(1);
  });

  describe('Layout', () => {
    it('deve ter a thumb do livro utilizando os dados recebidos', () => {
      const imgEl: HTMLImageElement = component
        .find('img#book-thumb')
        .getDOMNode();
      expect(imgEl).toBeTruthy();
      expect(imgEl.src).toEqual(MockBook.volumeInfo.imageLinks.thumbnail);
    });

    it('não deve ter a thumb do livro caso a mesma não esteja disponível', async () => {
      mockBook.volumeInfo.imageLinks = null;
      await buildComponent();
      const imgEl: ReactWrapper = component.find('img#book-thumb');
      const h3El: HTMLHeadingElement = component
        .find('h3#thumb-not-found')
        .getDOMNode();
      expect(imgEl.length).toBeFalsy();
      expect(h3El).toBeTruthy();
      expect(h3El.textContent).toEqual('Imagem não disponível');
    });

    it('deve mostrar o título do livro utilizando os dados recebidos', () => {
      const h3El: HTMLHeadingElement = component
        .find('h3.book-title')
        .getDOMNode();
      expect(h3El).toBeTruthy();
      expect(h3El.textContent).toEqual(mockBook.volumeInfo.title);
    });

    it('deve mostrar os autores do livro utilizando os dados recebidos', () => {
      const h5El: HTMLHeadingElement = component
        .find('h5.book-authors')
        .getDOMNode();
      expect(h5El).toBeTruthy();
      expect(h5El.textContent).toEqual(mockBook.volumeInfo.authors.join(', '));
    });

    it('deve mostrar a data de lançamento do livro utilizando os dados recebidos', () => {
      const h6El: HTMLHeadingElement = component
        .find('h6.book-year')
        .getDOMNode();
      expect(h6El).toBeTruthy();
      expect(h6El.textContent).toEqual(
        moment(mockBook.volumeInfo.publishedDate).format('MMMM [de] YYYY')
      );
    });

    it('deve mostrar o preço do livro utilizando os dados recebidos', () => {
      const h4El: HTMLHeadingElement = component.find('h4.price').getDOMNode();
      expect(h4El).toBeTruthy();
      expect(h4El.textContent).toEqual(
        'R$ ' + mockBook.saleInfo.retailPrice.amount.toFixed(2).toLocaleString()
      );
    });

    it('deve mostrar o livro como gratuito utilizando os dados recebidos', async () => {
      mockBook.saleInfo.retailPrice.amount = 0;
      await buildComponent();
      const h4El: HTMLHeadingElement = component.find('h4.price').getDOMNode();
      expect(h4El).toBeTruthy();
      expect(h4El.textContent).toEqual('Grátis');
    });

    it('deve mostrar o livro indisponível utilizando os dados recebidos', async () => {
      mockBook.saleInfo.saleability = 'NOT_FOR_SALE';
      await buildComponent();
      const h4El: HTMLHeadingElement = component.find('h4.price').getDOMNode();
      expect(h4El).toBeTruthy();
      expect(h4El.textContent).toEqual('Indisponível');
    });

    it('deve mostrar o idioma do livro utilizando os dados recebidos', async () => {
      const divEl: ReactWrapper = component.find('div#info-idioma');
      const titleEl: HTMLSpanElement = divEl
        .find('span.info-title')
        .getDOMNode();
      const contentEl: HTMLSpanElement = divEl
        .find('span.info-content')
        .getDOMNode();

      expect(titleEl.textContent).toEqual('Idioma');
      expect(contentEl.textContent).toEqual(
        mockBook.volumeInfo.language.toUpperCase()
      );
    });

    it('deve mostrar a editora do livro utilizando os dados recebidos', async () => {
      const divEl: ReactWrapper = component.find('div#info-editora');
      const titleEl: HTMLSpanElement = divEl
        .find('span.info-title')
        .getDOMNode();
      const contentEl: HTMLSpanElement = divEl
        .find('span.info-content')
        .getDOMNode();

      expect(titleEl.textContent).toEqual('Editora');
      expect(contentEl.textContent).toEqual(mockBook.volumeInfo.publisher);
    });

    it('deve mostrar o número de páginas do livro utilizando os dados recebidos', async () => {
      const divEl: ReactWrapper = component.find('div#info-paginas');
      const titleEl: HTMLSpanElement = divEl
        .find('span.info-title')
        .getDOMNode();
      const contentEl: HTMLSpanElement = divEl
        .find('span.info-content')
        .getDOMNode();

      expect(titleEl.textContent).toEqual('Páginas');
      expect(contentEl.textContent).toEqual(
        mockBook.volumeInfo.pageCount.toString()
      );
    });

    it('deve mostrar a descrição do livro utilizando os dados recebidos', async () => {
      const pEl: HTMLParagraphElement = component
        .find('p.book-desc')
        .getDOMNode();
      expect(pEl.textContent.trim()).toEqual(mockBook.volumeInfo.description);
    });

    it('deve mostrar os botões de controle', async () => {
      const backBtn: HTMLButtonElement = component
        .find('button#go-back')
        .getDOMNode();
      const moreBtn: HTMLButtonElement = component
        .find('button#see-more')
        .getDOMNode();
      const favBtn: HTMLButtonElement = component
        .find('button#toggle-favorite')
        .getDOMNode();
      expect(backBtn).toBeTruthy();
      expect(moreBtn).toBeTruthy();
      expect(favBtn).toBeTruthy();
      expect(backBtn.textContent).toEqual('Voltar');
      expect(moreBtn.textContent).toEqual('Ver mais');
    });

    it('deve mostrar o coração dentro do botão de favorito', () => {
      const favBtn: HTMLButtonElement = component
        .find('button#toggle-favorite')
        .getDOMNode();
      expect(favBtn.childNodes.length).toEqual(1);
      const iEl: HTMLSpanElement = favBtn.childNodes[0] as HTMLSpanElement;
      expect(iEl.tagName).toEqual('I');
      expect(
        iEl.classList[0] === 'far' ||
          iEl.classList[0] === 'fas' ||
          iEl.classList[1] === 'far' ||
          iEl.classList[1] === 'fas'
      ).toBeTruthy();
      expect(
        iEl.classList[0] === 'fa-heart' || iEl.classList[1] === 'fa-heart'
      ).toBeTruthy();
    });

    it('deve mostrar o coração preenchido quando o livro é favorito', async () => {
      localStorage[MockBook.id] = JSON.stringify(MockBook);
      await buildComponent();
      const favBtn: HTMLButtonElement = component
        .find('button#toggle-favorite')
        .getDOMNode();
      const iEl: HTMLSpanElement = favBtn.childNodes[0] as HTMLSpanElement;
      expect(iEl.classList.contains('fas')).toBeTruthy();
    });

    it('deve mostrar o coração vazio quando o livro não é favorito', () => {
      const favBtn: HTMLButtonElement = component
        .find('button#toggle-favorite')
        .getDOMNode();
      const iEl: HTMLSpanElement = favBtn.childNodes[0] as HTMLSpanElement;
      expect(iEl.classList.contains('far')).toBeTruthy();
    });

    it('deve mostrar o coração vazio quando o livro não é favorito', () => {
      const favBtn: HTMLButtonElement = component
        .find('button#toggle-favorite')
        .getDOMNode();
      const iEl: HTMLSpanElement = favBtn.childNodes[0] as HTMLSpanElement;
      expect(iEl.classList.contains('far')).toBeTruthy();
    });

    it('deve mostrar loading enquanto o livro não estiver presente', async () => {
      mockAxios.mockResolvedValue({ data: null });
      await buildComponent();
      expect(component.find('div.loading').length).toEqual(1);
      expect(component.find('div.book-content').length).toBeFalsy();
    });
  });

  describe('Funcionalidade', () => {
    it('deve chamar o loading e a API ao inicializar', () => {
      expect(mockUiCtx.pushLoading).toHaveBeenCalledTimes(1);
      expect(mockAxios).toHaveBeenNthCalledWith(
        1,
        'https://www.googleapis.com/books/v1/volumes/' + mockBook.id
      );
      expect(mockUiCtx.popLoading).toHaveBeenCalledTimes(1);
    });

    it('deve chamar modal de erro caso o request falhe', async () => {
      mockAxios.mockRejectedValue('test error');
      jest.clearAllMocks();
      await buildComponent();
      expect(mockUiCtx.pushLoading).toHaveBeenCalledTimes(1);
      expect(mockUiCtx.addModal).toHaveBeenNthCalledWith(1, {
        desc: 'Erro ao baixar os dados do livro',
        title: 'Erro na API',
        type: 'error'
      });
      expect(mockUiCtx.popLoading).toHaveBeenCalledTimes(1);
    });

    it('deve redirecionar para a home ao clicar no botão de voltar', () => {
      component.find('button#go-back').simulate('click');
      expect(mockHistory.push).toHaveBeenNthCalledWith(1, routes.home);
    });

    it('deve abrir o link para o livro em outra página', () => {
      component.find('button#see-more').simulate('click');
      expect(mockWindow.open).toHaveBeenNthCalledWith(
        1,
        mockBook.volumeInfo.infoLink
      );
    });

    it('deve chamar a função para adicionar favorito quando o livro ainda não é favorito', () => {
      component.find('button#toggle-favorite').simulate('click');
      expect(mockAddFavorite).toHaveBeenNthCalledWith(1, MockBook);
    });

    it('deve chamar a função para remover favorito quando o livro é favorito', async () => {
      localStorage[MockBook.id] = JSON.stringify(MockBook);
      await buildComponent();
      component.find('button#toggle-favorite').simulate('click');
      expect(mockRemoveFavorite).toHaveBeenNthCalledWith(1, MockBook);
    });

    it('deve alterar o estado de favorito do livro adequadamente quantas vezes for necessário', () => {
      component.find('button#toggle-favorite').simulate('click');
      expect(mockAddFavorite).toHaveBeenNthCalledWith(1, MockBook);
      expect(mockRemoveFavorite).not.toHaveBeenCalled();
      component.update();
      jest.resetAllMocks();
      component.find('button#toggle-favorite').simulate('click');
      expect(mockRemoveFavorite).toHaveBeenNthCalledWith(1, MockBook);
      expect(mockAddFavorite).not.toHaveBeenCalled();
    });
  });
});
