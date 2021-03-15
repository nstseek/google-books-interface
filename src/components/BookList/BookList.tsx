import { ReactUIContext } from '@nstseek/react-ui/context';
import axios, { CancelTokenSource } from 'axios';
import Book from 'components/Book/Book';
import BookDetails from 'components/BookDetails/BookDetails';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Book as BookModel, BookParams, BookResponse } from 'typings/api';
import './BookList.scss';

const cancelMessage = 'refresh-cancel';

/**
 * Renderiza a lista de livros encontrados baseado na pesquisa feita
 */
const BookList: React.FC = () => {
  const [books, setBooks] = useState<BookResponse>(null);
  const [query, setQuery] = useState('HTML');
  const [openBook, setOpenBook] = useState<BookModel>(null);
  const uiCtx = useContext(ReactUIContext);
  const latestFetch = useRef<CancelTokenSource>(null);
  const pageSize = 20;
  const listContainer = useRef<HTMLDivElement>(null);
  const [actualPage, setActualPage] = useState({ value: 1 });
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchBooks();
    return () => latestFetch.current.cancel(cancelMessage);
  }, [actualPage]);

  useEffect(() => {
    setActualPage({ value: 1 });
  }, [query]);

  const fetchBooks = async () => {
    latestFetch.current = axios.CancelToken.source();
    uiCtx.pushLoading();
    try {
      const params: BookParams = {
        startIndex: pageSize * (actualPage.value - 1),
        maxResults: pageSize,
        q: query
      };
      const response = await axios.get<BookResponse>(
        'https://www.googleapis.com/books/v1/volumes',
        {
          params,
          cancelToken: latestFetch.current.token
        }
      );
      setBooks(response.data);
      setTotalPages(Math.ceil(response.data.totalItems / pageSize));
      listContainer.current.scrollTo({ top: 0, behavior: 'smooth' });
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

  return (
    <div className='BookList'>
      {openBook ? (
        <BookDetails book={openBook} close={() => setOpenBook(null)} />
      ) : null}
      <div className='query'>
        <input
          type='text'
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder='Digite um título para pesquisar por livros'
        />
      </div>
      <div
        className={'list' + (books?.items?.length ? ' has-items' : '')}
        ref={listContainer}>
        {books?.items?.length ? (
          <>
            {books.items.map((book) => (
              <Book
                key={book.id}
                book={book}
                openBook={(book) => setOpenBook(book)}
              />
            ))}
          </>
        ) : (
          <h3>
            {uiCtx.state.loading.length
              ? 'Carregando...'
              : 'Nenhum livro encontrado.'}
          </h3>
        )}
      </div>
      {books?.items ? (
        <h5 className='result-info'>
          {books.totalItems} livros encontrados - Página {actualPage.value} de{' '}
          {totalPages}
        </h5>
      ) : null}
      <div className='controls'>
        {books?.items ? (
          <div className='navigators'>
            <button
              className={`${
                actualPage.value === 1 ? 'hidden ' : ''
              }page-switcher`}
              title='Página anterior'
              onClick={() =>
                setActualPage((previousState) => {
                  if (previousState.value === 1) {
                    return previousState;
                  } else {
                    return { value: previousState.value - 1 };
                  }
                })
              }>
              {'<'}
            </button>
            <button
              className={`${
                actualPage.value === totalPages ? 'hidden ' : ''
              }page-switcher`}
              title='Próxima página'
              onClick={() =>
                setActualPage((previousState) => {
                  if (previousState.value === totalPages) {
                    return previousState;
                  } else {
                    return { value: previousState.value + 1 };
                  }
                })
              }>
              {'>'}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default BookList;
