import React, { useState } from 'react';
import { removeFavorite, addFavorite } from 'utils/favorites';
import { Book as BookModel } from '../../typings/api';
import './Book.scss';

interface Props {
  book: BookModel;
  openBook(book: BookModel);
  refreshList();
}

/**
 * Renderiza um card com dados básicos sobre um livro na view de consulta, permitindo clicar para abrir mais detalhes
 * @param book - O livro que será mostrado
 * @param openBook - Função para chamar quando o livro for clicado
 */
const Book: React.FC<Props> = ({ book, openBook, refreshList }) => {
  const [favorite, setFavorite] = useState(!!localStorage[book.id]);
  return (
    <div className='Book' onClick={() => openBook(book)}>
      <img
        className='book-thumb'
        src={book.volumeInfo.imageLinks?.thumbnail}
        alt={book.volumeInfo.title + ' thumbnail'}
      />
      <h3 className='book-title'>{book.volumeInfo.title}</h3>
      <button
        className='favorite-book-btn'
        onClick={(event) => {
          event.stopPropagation();
          if (favorite) {
            removeFavorite(book);
          } else {
            addFavorite(book);
          }
          setFavorite(!favorite);
          refreshList();
        }}>
        {favorite ? (
          <i className='fas fa-heart'></i>
        ) : (
          <i className='far fa-heart'></i>
        )}
      </button>
    </div>
  );
};

export default Book;
