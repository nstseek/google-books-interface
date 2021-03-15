import React from 'react';
import { Book as BookModel } from '../../typings/api';
import './Book.scss';

interface Props {
  book: BookModel;
  openBook(book: BookModel);
}

/**
 * Renderiza um card com dados básicos sobre um livro na view de consulta, permitindo clicar para abrir mais detalhes
 * @param book - O livro que será mostrado
 * @param openBook - Função para chamar quando o livro for clicado
 */
const Book: React.FC<Props> = ({ book, openBook }) => (
  <div className='Book' onClick={() => openBook(book)}>
    <img
      className='book-thumb'
      src={book.volumeInfo.imageLinks?.thumbnail}
      alt={book.volumeInfo.title + ' thumbnail'}
    />
    <h3 className='book-title'>{book.volumeInfo.title}</h3>
  </div>
);

export default Book;
