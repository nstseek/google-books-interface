const mockAxios = {
  get: jest.fn(),
  CancelToken: {
    source: jest.fn()
  }
};
jest.mock('axios', () => ({
  get: (...args) => mockAxios.get(...args),
  CancelToken: {
    source: () => mockAxios.CancelToken.source()
  }
}));

const mockHistory = {
  push: jest.fn()
};
jest.mock('react-router', () => ({
  useHistory: () => mockHistory
}));

const mockUiCtx = {
  pushLoading: jest.fn(),
  popLoading: jest.fn(),
  addModal: jest.fn(),
  state: {
    loading: []
  }
};
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: () => mockUiCtx
}));

let mockBookProps: {
  openBook?: (book: BookModel) => void;
  refreshList?: (book: BookModel) => void;
} = {};
jest.mock('components/Book/Book', () => (props) => {
  mockBookProps = { ...props };
  return 'book-component-test';
});

import Book from 'components/Book/Book';
import { mount, ReactWrapper } from 'enzyme';
import MockBook from 'mocks/books';
import { act } from 'react-dom/test-utils';
import routes from 'routes';
import { Book as BookModel } from 'typings/api';
import BookList from './BookList';

describe('<BookList />', () => {
  let component: ReactWrapper<typeof BookList>;

  const buildComponent = async () => {
    component = mount(<BookList />);
    await act(async () => {
      component = await Promise.resolve(component);
      await new Promise((resolve) => setImmediate(resolve));
      component.update();
    });
  };

  beforeEach(async () => {
    localStorage.clear();
    sessionStorage.clear();
    mockUiCtx.state.loading = [];
    mockAxios.CancelToken.source.mockReturnValue({
      token: '',
      cancel: () => null
    });
    mockAxios.get.mockResolvedValue({
      data: {
        items: [MockBook],
        kind: '',
        totalItems: 1
      }
    });
    jest.clearAllMocks();
    await buildComponent();
  });

  it('deve montar', () => {
    expect(component.length).toBe(1);
  });

  describe('Layout', () => {
    it('deve mostrar a barra de pesquisa', () => {
      expect(component.find('input#book-query').length).toEqual(1);
    });

    it('deve mostrar um placeholder para a barra de pesquisa', () => {
      const inputEl: HTMLInputElement = component
        .find('input#book-query')
        .getDOMNode();
      expect(inputEl.placeholder).toEqual(
        'Digite um título para pesquisar por livros'
      );
    });

    it('deve mostrar uma lupa na barra de pesquisa caso o sistema esteja não carregando', async () => {
      await buildComponent();
      expect(component.find('div.query i.fas.fa-search').length).toEqual(1);
      expect(component.find('div.query i.loading').length).toBeFalsy();
    });

    it('deve mostrar um spinner na barra de pesquisa caso o sistema esteja carregando', async () => {
      mockUiCtx.state.loading = [true];
      await buildComponent();
      expect(component.find('div.query i.fas.fa-search').length).toBeFalsy();
      expect(component.find('div.query i.loading').length).toEqual(1);
    });

    it('deve mostrar o botão de favoritos', async () => {
      const favBtn = component.find('button.filter');
      expect(favBtn.length).toEqual(1);
      const iEl: HTMLSpanElement = favBtn.find('i').getDOMNode();
      expect(iEl).toBeTruthy();
      expect(iEl.className).toEqual('fas fa-filter');
    });

    it('deve ativar o botão de favoritos ao clicar nele', async () => {
      const favBtn = component.find('button.filter');
      act(() => {
        favBtn.simulate('click');
      });
      expect(favBtn.getDOMNode().classList.contains('active')).toBeTruthy();
    });

    it('deve mostrar os livros que retornaram da query', async () => {
      const BookComponent = Book as any;
      expect(
        component.find('div.list').containsMatchingElement(<BookComponent />)
      ).toBeTruthy();
      expect(component.find('div.list').children().length).toEqual(1);
    });

    it('deve mostrar uma mensagem informando que nenhum livro foi encontrado', async () => {
      mockAxios.get.mockResolvedValue({
        data: {
          items: [],
          kind: '',
          totalItems: 0
        }
      });
      await buildComponent();
      const h3El: HTMLHeadingElement = component
        .find('h3#query-msg')
        .getDOMNode();
      expect(h3El).toBeTruthy();
      expect(h3El.textContent).toEqual('Nenhum livro encontrado');
    });

    it('deve mostrar uma mensagem informando que o usuário deve preencher o campo de pesquisa', async () => {
      mockAxios.get.mockResolvedValue({
        data: {
          items: [],
          kind: '',
          totalItems: 0
        }
      });
      await buildComponent();
      act(() => {
        component
          .find('input#book-query')
          .simulate('change', { target: { value: '' } });
      });
      const h3El: HTMLHeadingElement = component
        .find('h3#query-msg')
        .getDOMNode();
      expect(h3El).toBeTruthy();
      expect(h3El.textContent).toEqual(
        'Digite algo no campo de pesquisa para ver livros relacionados'
      );
    });
  });

  describe('Navegação de páginas', () => {
    it('deve mostrar o número de páginas e livros encontrados no singular', () => {
      expect(component.find('h5.result-info').getDOMNode().textContent).toEqual(
        '1 livro encontrado - Página 1 de 1'
      );
    });

    it('deve mostrar o número de páginas e livros encontrados no plural', async () => {
      mockAxios.get.mockResolvedValue({
        data: {
          items: [MockBook, { ...MockBook, id: 'test' }],
          kind: '',
          totalItems: 2
        }
      });
      await buildComponent();
      expect(component.find('h5.result-info').getDOMNode().textContent).toEqual(
        '2 livros encontrados - Página 1 de 1'
      );
    });

    it('deve mostrar o número de páginas e livros encontrados corretamente quando tivermos mais de uma página', async () => {
      const books = [];
      for (let i = 0; i < 21; i++) {
        books.push({ ...MockBook, id: 'test-' + i });
      }
      mockAxios.get.mockResolvedValue({
        data: {
          items: books,
          kind: '',
          totalItems: 21
        }
      });
      await buildComponent();
      expect(component.find('h5.result-info').getDOMNode().textContent).toEqual(
        '21 livros encontrados - Página 1 de 2'
      );
    });

    it('deve mostrar o número de páginas e livros encontrados corretamente quando resultados não forem encontrados', async () => {
      mockAxios.get.mockResolvedValue({
        data: {
          items: [],
          kind: '',
          totalItems: 0
        }
      });
      await buildComponent();
      expect(component.find('h5.result-info').getDOMNode().textContent).toEqual(
        '0 livros encontrados - Página 1 de 1'
      );
    });

    it('deve mostrar os botões de navegação', async () => {
      const books = [];
      for (let i = 0; i < 21; i++) {
        books.push({ ...MockBook, id: 'test-' + i });
      }
      mockAxios.get.mockResolvedValue({
        data: {
          items: books,
          kind: '',
          totalItems: 21
        }
      });
      await buildComponent();
      const nextBtn: HTMLButtonElement = component
        .find('button#next-page')
        .getDOMNode();
      const prevBtn: HTMLButtonElement = component
        .find('button#previous-page')
        .getDOMNode();
      expect(nextBtn).toBeTruthy();
      expect(nextBtn.textContent).toEqual('Próxima página>');
      expect(prevBtn).toBeTruthy();
      expect(prevBtn.textContent).toEqual('<Página anterior');
    });

    it('deve desabilitar o botão de página anterior quando estivermos na primeira página', async () => {
      const books = [];
      for (let i = 0; i < 21; i++) {
        books.push({ ...MockBook, id: 'test-' + i });
      }
      mockAxios.get.mockResolvedValue({
        data: {
          items: books,
          kind: '',
          totalItems: 21
        }
      });
      await buildComponent();
      const nextBtn: HTMLButtonElement = component
        .find('button#next-page')
        .getDOMNode();
      const prevBtn: HTMLButtonElement = component
        .find('button#previous-page')
        .getDOMNode();
      expect(nextBtn.disabled).toBeFalsy();
      expect(prevBtn.disabled).toBeTruthy();
    });

    it('deve desabilitar o botão de próxima página quando estivermos na última página', async () => {
      const books = [];
      for (let i = 0; i < 21; i++) {
        books.push({ ...MockBook, id: 'test-' + i });
      }
      mockAxios.get.mockResolvedValue({
        data: {
          items: books,
          kind: '',
          totalItems: 21
        }
      });
      await buildComponent();
      act(() => {
        component.find('button#next-page').simulate('click');
      });
      const nextBtn: HTMLButtonElement = component
        .find('button#next-page')
        .getDOMNode();
      const prevBtn: HTMLButtonElement = component
        .find('button#previous-page')
        .getDOMNode();
      expect(nextBtn.disabled).toBeTruthy();
      expect(prevBtn.disabled).toBeFalsy();
    });

    it('deve desabilitar ambos botões de navegação quando tivermos apenas uma página', async () => {
      mockAxios.get.mockResolvedValue({
        data: {
          items: [MockBook],
          kind: '',
          totalItems: 1
        }
      });
      await buildComponent();
      const nextBtn: HTMLButtonElement = component
        .find('button#next-page')
        .getDOMNode();
      const prevBtn: HTMLButtonElement = component
        .find('button#previous-page')
        .getDOMNode();
      expect(nextBtn.disabled).toBeTruthy();
      expect(prevBtn.disabled).toBeTruthy();
    });

    it('deve mostrar o número de páginas corretamente ao navegar', async () => {
      const books = [];
      for (let i = 0; i < 21; i++) {
        books.push({ ...MockBook, id: 'test-' + i });
      }
      mockAxios.get.mockResolvedValue({
        data: {
          items: books,
          kind: '',
          totalItems: 21
        }
      });
      await buildComponent();
      act(() => {
        component.find('button#next-page').simulate('click');
      });
      expect(component.find('h5.result-info').getDOMNode().textContent).toEqual(
        '21 livros encontrados - Página 2 de 2'
      );
    });
  });

  describe('Funcionalidades', () => {
    it('deve chamar a API com a frase colocada na barra de pesquisa e reiniciar a paginação', async () => {
      const books = [];
      for (let i = 0; i < 21; i++) {
        books.push({ ...MockBook, id: 'test-' + i });
      }
      mockAxios.get.mockResolvedValue({
        data: {
          items: books,
          kind: '',
          totalItems: 21
        }
      });
      await buildComponent();
      expect(component.find('h5.result-info').getDOMNode().textContent).toEqual(
        '21 livros encontrados - Página 1 de 2'
      );
      act(() => {
        component.find('button#next-page').simulate('click');
      });
      expect(component.find('h5.result-info').getDOMNode().textContent).toEqual(
        '21 livros encontrados - Página 2 de 2'
      );
      jest.clearAllMocks();
      act(() => {
        component
          .find('input#book-query')
          .simulate('change', { target: { value: 'test' } });
      });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.googleapis.com/books/v1/volumes',
        {
          params: {
            startIndex: 0,
            maxResults: 20,
            q: 'test'
          },
          cancelToken: ''
        }
      );
      expect(component.find('h5.result-info').getDOMNode().textContent).toEqual(
        '21 livros encontrados - Página 1 de 2'
      );
    });
    it('deve reiniciar a paginação e listar apenas os favoritos ao ativar o modo de filtragem por favoritos', async () => {
      const books = [];
      for (let i = 0; i < 21; i++) {
        books.push({ ...MockBook, id: 'test-' + i });
      }
      for (let i = 0; i < 42; i++) {
        localStorage['test-' + i] = JSON.stringify({
          ...MockBook,
          id: 'test-' + i
        });
      }
      mockAxios.get.mockResolvedValue({
        data: {
          items: books,
          kind: '',
          totalItems: 21
        }
      });
      await buildComponent();
      expect(component.find('h5.result-info').getDOMNode().textContent).toEqual(
        '21 livros encontrados - Página 1 de 2'
      );
      act(() => {
        component.find('button#next-page').simulate('click');
      });
      expect(component.find('h5.result-info').getDOMNode().textContent).toEqual(
        '21 livros encontrados - Página 2 de 2'
      );
      act(() => {
        component.find('button.filter').simulate('click');
      });
      expect(component.find('h5.result-info').getDOMNode().textContent).toEqual(
        '42 livros encontrados - Página 1 de 3'
      );
    });
    it('deve salvar o estado no sessionStorage e redirecionar o usuário ao clicar no livro', () => {
      sessionStorage.clear();
      mockBookProps.openBook(MockBook);
      expect(sessionStorage.query).toEqual('HTML');
      expect(sessionStorage.onlyFavorites).toEqual('false');
      expect(sessionStorage.actualPage).toEqual('1');
      expect(mockHistory.push).toHaveBeenNthCalledWith(
        1,
        routes.livro + MockBook.id
      );
    });
    it('deve recuperar o estado do sessionStorage ao carregar a página', async () => {
      const books = [];
      for (let i = 0; i < 21; i++) {
        books.push({ ...MockBook, id: 'test-' + i });
        localStorage['test-' + i] = JSON.stringify({
          ...MockBook,
          id: 'test-' + i
        });
      }
      mockAxios.get.mockResolvedValue({
        data: {
          items: books,
          kind: '',
          totalItems: 21
        }
      });
      sessionStorage.query = 'test';
      sessionStorage.onlyFavorites = 'true';
      sessionStorage.actualPage = '2';
      await buildComponent();
      const inputEl: HTMLInputElement = component
        .find('input#book-query')
        .getDOMNode();
      expect(inputEl.value).toEqual('test');
      expect(
        component
          .find('button.filter')
          .getDOMNode()
          .classList.contains('active')
      ).toBeTruthy();
      expect(component.find('h5.result-info').getDOMNode().textContent).toEqual(
        '21 livros encontrados - Página 2 de 2'
      );
    });
  });
});
