const mockAddFavorite = jest.fn();
const mockRemoveFavorite = jest.fn();
jest.mock('utils/favorites', () => ({
  addFavorite: (book) => mockAddFavorite(book),
  removeFavorite: (book) => mockRemoveFavorite(book)
}));

import { mount, ReactWrapper } from 'enzyme';
import MockBook from 'mocks/books';
import Book from './Book';

describe('<Book />', () => {
  let component: ReactWrapper<typeof Book>;
  const mockRefresh = jest.fn();
  const mockOpen = jest.fn();

  const buildComponent = () => {
    component = mount(
      <Book book={MockBook} refreshList={mockRefresh} openBook={mockOpen} />
    );
  };

  beforeEach(() => {
    localStorage.clear();
    buildComponent();
  });

  it('deve montar', () => {
    expect(component.length).toBe(1);
  });

  describe('Layout', () => {
    it('deve ter a div base com o nome do componente', () => {
      const divEl: HTMLDivElement = component.find('div.Book').getDOMNode();
      expect(divEl).toBeTruthy();
      expect(divEl.classList[0]).toEqual('Book');
    });

    it('deve ter a thumb do livro utilizando os dados recebidos', () => {
      const imgEl: HTMLImageElement = component
        .find('img.book-thumb')
        .getDOMNode();
      expect(imgEl).toBeTruthy();
      expect(imgEl.src).toEqual(MockBook.volumeInfo.imageLinks.thumbnail);
      expect(imgEl.alt).toEqual(MockBook.volumeInfo.title + ' thumbnail');
    });

    it('deve ter o título do livro utilizando os dados recebidos', () => {
      const h3El: HTMLHeadingElement = component
        .find('h3.book-title')
        .getDOMNode();
      expect(h3El).toBeTruthy();
      expect(h3El.textContent).toEqual(MockBook.volumeInfo.title);
    });

    it('deve ter o botão de favorito', () => {
      const btnEl: HTMLButtonElement = component
        .find('button.favorite-book-btn')
        .getDOMNode();
      expect(btnEl).toBeTruthy();
      expect(btnEl.childNodes.length).toEqual(1);
      const iEl: HTMLSpanElement = btnEl.childNodes[0] as HTMLSpanElement;
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

    it('deve mostrar o coração preenchido quando o livro é favorito', () => {
      localStorage[MockBook.id] = JSON.stringify(MockBook);
      buildComponent();
      const btnEl: HTMLButtonElement = component
        .find('button.favorite-book-btn')
        .getDOMNode();
      const iEl: HTMLSpanElement = btnEl.childNodes[0] as HTMLSpanElement;
      expect(iEl.classList.contains('fas')).toBeTruthy();
    });

    it('deve mostrar o coração vazio quando o livro não é favorito', () => {
      const btnEl: HTMLButtonElement = component
        .find('button.favorite-book-btn')
        .getDOMNode();
      const iEl: HTMLSpanElement = btnEl.childNodes[0] as HTMLSpanElement;
      expect(iEl.classList.contains('far')).toBeTruthy();
    });
  });

  describe('Funcionalidade', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('deve abrir o livro ao clicar na div, passando o livro', () => {
      component.find('div.Book').simulate('click');
      expect(mockOpen).toHaveBeenNthCalledWith(1, MockBook);
    });

    it('deve chamar a função de atualização ao alterar o estado do favorito', () => {
      component.find('button.favorite-book-btn').simulate('click');
      expect(mockRefresh).toHaveBeenCalledTimes(1);
    });

    it('não deve chamar a função para abrir o livro ao clicar no botão de favorito', () => {
      component.find('button.favorite-book-btn').simulate('click');
      expect(mockOpen).not.toHaveBeenCalled();
    });

    it('deve chamar a função para adicionar favorito quando o livro ainda não é favorito', () => {
      component.find('button.favorite-book-btn').simulate('click');
      expect(mockAddFavorite).toHaveBeenNthCalledWith(1, MockBook);
    });

    it('deve chamar a função para remover favorito quando o livro é favorito', () => {
      localStorage[MockBook.id] = JSON.stringify(MockBook);
      buildComponent();
      component.find('button.favorite-book-btn').simulate('click');
      expect(mockRemoveFavorite).toHaveBeenNthCalledWith(1, MockBook);
    });

    it('deve alterar o estado de favorito do livro adequadamente quantas vezes for necessário', () => {
      component.find('button.favorite-book-btn').simulate('click');
      expect(mockAddFavorite).toHaveBeenNthCalledWith(1, MockBook);
      expect(mockRemoveFavorite).not.toHaveBeenCalled();
      component.update();
      jest.resetAllMocks();
      component.find('button.favorite-book-btn').simulate('click');
      expect(mockRemoveFavorite).toHaveBeenNthCalledWith(1, MockBook);
      expect(mockAddFavorite).not.toHaveBeenCalled();
    });
  });
});
