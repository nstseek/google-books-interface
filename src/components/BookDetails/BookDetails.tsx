import { Backdrop } from '@nstseek/react-ui/components';
import moment from 'moment';
import React from 'react';
import { Book } from 'typings/api';
import './BookDetails.scss';

interface Props {
  book: Book;
  close();
}

/**
 * Renderiza um campo simples de título e conteúdo
 * @param label - O título do conteúdo a ser mostrado
 * @param content - O conteúdo a ser mostrado
 * @returns Um elemento <p> com a estrutura HTML desejada (apenas se o valor de content for verdadeiro, caso contrário, retorna null)
 */
const Field = (label, content) =>
  content ? (
    <p className='field'>
      <span className='title'>{label}</span>
      {content}
    </p>
  ) : null;

/**
 * Renderiza uma view detalhada de um livro
 * @param book - O livro que será renderizado
 * @param close - Função para chamar ao fechar/sair da view detalhada
 */
const BookDetails: React.FC<Props> = ({ book, close }) => (
  <Backdrop onBackdropClick={close}>
    <div className='BookDetails'>
      <div className='book-content'>
        <img src={book.volumeInfo.imageLinks?.thumbnail} />
        <h3 className='book-title'>{book.volumeInfo.title}</h3>
        {Field('Autores: ', book.volumeInfo.authors?.join(', '))}
        {Field('Descrição: ', book.volumeInfo.description)}
        {Field(
          'Data de publicação: ',
          moment(book.volumeInfo.publishedDate).format('LL')
        )}
        {book.volumeInfo.infoLink ? (
          <a target='_blank' rel='noreferrer' href={book.volumeInfo.infoLink}>
            Clique aqui para ver mais detalhes
          </a>
        ) : null}
      </div>
      <button className='close-details' onClick={close}>
        Fechar
      </button>
    </div>
  </Backdrop>
);

export default BookDetails;
