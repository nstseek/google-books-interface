import { ReactUIContext } from '@nstseek/react-ui/context';
import axios, { CancelTokenSource } from 'axios';
import Book from 'components/Book/Book';
import _ from 'lodash';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router';
import routes from 'routes';
import { Book as BookModel, BookParams, BookQueryResponse } from 'typings/api';
import generateId from 'utils/generateId';
import './BookList.scss';

const cancelMessage = 'refresh-cancel';

/**
 * Renderiza a lista de livros encontrados baseado na pesquisa feita
 */
const BookList: React.FC = () => {
  const [books, setBooks] = useState<BookQueryResponse>(null);
  const [query, setQuery] = useState(sessionStorage.query || 'HTML');
  const [actualPage, setActualPage] = useState({
    value: Number(sessionStorage.actualPage) || 1
  });
  const [totalPages, setTotalPages] = useState(0);
  const [pageLoading, setPageLoading] = useState(false);
  const [onlyFavorites, setOnlyFavorites] = useState(
    sessionStorage.onlyFavorites === 'true'
  );
  const latestFetch = useRef<CancelTokenSource>(null);
  const listContainer = useRef<HTMLDivElement>(null);
  const uiCtx = useContext(ReactUIContext);
  const history = useHistory();
  const pageSize = 20;

  useEffect(() => {
    if (onlyFavorites) {
      fetchFavorites();
    } else {
      fetchBooks();
    }
    return onlyFavorites
      ? null
      : () => latestFetch.current.cancel(cancelMessage);
  }, [actualPage]);

  useEffect(() => {
    sessionStorage.actualPage = actualPage.value;
    sessionStorage.onlyFavorites = onlyFavorites;
  }, [actualPage, onlyFavorites]);

  const fetchBooks = async () => {
    if (!query) {
      setBooks({
        items: [],
        kind: '',
        totalItems: 0
      });
      setPageLoading(false);
      setTotalPages(0);
      return;
    }
    latestFetch.current = axios.CancelToken.source();
    uiCtx.pushLoading();
    try {
      const params: BookParams = {
        startIndex: pageSize * (actualPage.value - 1),
        maxResults: pageSize,
        q: query
      };
      const response = await axios.get<BookQueryResponse>(
        'https://www.googleapis.com/books/v1/volumes',
        {
          params,
          cancelToken: latestFetch.current.token
        }
      );
      setBooks(response.data);
      setTotalPages(Math.ceil(response.data.totalItems / pageSize));
      if (listContainer.current.scrollTo) {
        listContainer.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
      setPageLoading(false);
    } catch (err) {
      if (err?.message !== cancelMessage) {
        uiCtx.addModal({
          desc: 'Erro ao atualizar lista de livros',
          title: 'Erro na API',
          type: 'error'
        });
      }
    } finally {
      uiCtx.popLoading();
    }
  };

  const fetchFavorites = () => {
    const getBooks = (limit: number, offset: number): [BookModel[], number] => {
      const localStorageKeys = Object.keys(localStorage);
      let books: BookModel[] = localStorageKeys
        .filter((key) => !!localStorage[key])
        .map((key) => JSON.parse(localStorage[key]));
      const totalItems = books.length;
      if (query) {
        books = books
          .filter((book) => {
            return (
              _.toLower(_.deburr(book.volumeInfo.title.trim())).lastIndexOf(
                _.toLower(_.deburr(query.trim()))
              ) >= 0
            );
          })
          .slice(offset, offset + limit);
      } else {
        books = books.slice(offset, offset + limit);
      }
      return [books, totalItems];
    };
    const [items, totalItems] = getBooks(
      pageSize,
      (actualPage.value - 1) * pageSize
    );
    const booksResponse: BookQueryResponse = {
      items,
      kind: '',
      totalItems
    };
    setBooks(booksResponse);
    setTotalPages(Math.ceil(booksResponse.totalItems / pageSize));
    if (listContainer.current.scrollTo) {
      listContainer.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setPageLoading(false);
  };

  return (
    <div className='BookList'>
      <div className='query'>
        <input
          id='book-query'
          type='text'
          value={query}
          onChange={(event) => {
            setActualPage({ value: 1 });
            setQuery(event.target.value);
          }}
          placeholder='Digite um título para pesquisar por livros'
        />
        {uiCtx.state.loading.length ? (
          <i className='fas fa-spinner fa-spin loading' />
        ) : (
          <i className='fas fa-search' />
        )}
      </div>
      <div
        className={'list' + (books?.items?.length ? ' has-items' : '')}
        ref={listContainer}>
        {pageLoading ||
        (!books?.items?.length && uiCtx.state.loading.length) ? (
          <div className='loading'>
            <i className='fas fa-spinner fa-spin loading' />
          </div>
        ) : books?.items?.length ? (
          <>
            {books.items.map((book) => (
              <Book
                key={generateId(book.id)}
                book={book}
                openBook={(book) => {
                  sessionStorage.query = query;
                  sessionStorage.onlyFavorites = onlyFavorites;
                  sessionStorage.actualPage = actualPage.value;
                  history.push(routes.livro + book.id);
                }}
                refreshList={() => {
                  if (onlyFavorites) {
                    fetchFavorites();
                  }
                }}
              />
            ))}
          </>
        ) : (
          <h3 id='query-msg'>
            {query
              ? 'Nenhum livro encontrado'
              : 'Digite algo no campo de pesquisa para ver livros relacionados'}
          </h3>
        )}
      </div>
      {books?.items ? (
        <h5 className='result-info'>
          {books.totalItems}{' '}
          {books.totalItems !== 1 ? 'livros encontrados' : 'livro encontrado'} -
          Página {actualPage.value} de {totalPages || 1}
        </h5>
      ) : null}
      <div className='controls'>
        {books?.items ? (
          <div className='navigators'>
            <button
              className='page-switcher'
              id='previous-page'
              disabled={actualPage.value === 1}
              title='Página anterior'
              onClick={() => {
                setPageLoading(true);
                setActualPage((previousState) => {
                  if (previousState.value === 1) {
                    return previousState;
                  } else {
                    return { value: previousState.value - 1 };
                  }
                });
              }}>
              {'<'}
              <span className='desc'>Página anterior</span>
            </button>
            <button
              className={`filter${onlyFavorites ? ' active' : ''}`}
              title='Filtrar por favoritos'
              onClick={() => {
                setActualPage({ value: 1 });
                setOnlyFavorites(!onlyFavorites);
                setPageLoading(true);
              }}>
              <i className='fas fa-filter' />
              <span className='desc'>
                {onlyFavorites
                  ? 'Filtrando por favoritos'
                  : 'Filtrar por favoritos'}
              </span>
            </button>
            <button
              className='page-switcher'
              disabled={actualPage.value === totalPages}
              title='Próxima página'
              id='next-page'
              onClick={() => {
                setPageLoading(true);
                setActualPage((previousState) => {
                  if (previousState.value === totalPages) {
                    return previousState;
                  } else {
                    return { value: previousState.value + 1 };
                  }
                });
              }}>
              <span className='desc'>Próxima página</span>
              {'>'}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default BookList;
