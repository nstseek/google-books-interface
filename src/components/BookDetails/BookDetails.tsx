import { ReactUIContext } from '@nstseek/react-ui/context';
import axios from 'axios';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import routes from 'routes';
import { Book } from 'typings/api';
import { addFavorite, removeFavorite } from 'utils/favorites';
import './BookDetails.scss';

/**
 * Renderiza um campo simples de título e conteúdo
 * @param title - O título do conteúdo a ser mostrado
 * @param content - O conteúdo a ser mostrado
 * @returns Um elemento <p> com a estrutura HTML desejada (apenas se o valor de content for verdadeiro, caso contrário, retorna null)
 */
const Info: React.FC<{ title?: string; content?: string | number }> = ({
  title,
  content
}) =>
  content ? (
    <div className='info'>
      <span className='info-title'>{title}</span>
      <span className='info-content'>{content}</span>
    </div>
  ) : null;

/**
 * Renderiza uma view detalhada de um livro
 * @param book - O livro que será renderizado
 * @param close - Função para chamar ao fechar/sair da view detalhada
 */
const BookDetails: React.FC = () => {
  const [book, setBook] = useState<Book>(null);
  const { id } = useParams<{ id: string }>();
  const [favorite, setFavorite] = useState(!!localStorage[id]);
  const history = useHistory();
  const uiCtx = useContext(ReactUIContext);

  useEffect(() => {
    fetchBooks();
  }, [id]);

  const fetchBooks = async () => {
    uiCtx.pushLoading();
    try {
      const response = await axios.get<Book>(
        'https://www.googleapis.com/books/v1/volumes/' + id
      );
      setBook(response.data);
    } catch (err) {
      uiCtx.addModal({
        desc: 'Erro ao baixar os dados do livro',
        title: 'Erro na API',
        type: 'error'
      });
    } finally {
      uiCtx.popLoading();
    }
  };

  return (
    <div className='BookDetails'>
      {book ? (
        <>
          <div className='book-content'>
            <div className='book-cover'>
              {book.volumeInfo.imageLinks?.thumbnail ? (
                <img src={book.volumeInfo.imageLinks?.thumbnail} />
              ) : (
                <h3>Imagem não disponível</h3>
              )}
            </div>
            <div className='book-details'>
              <div className='book-header'>
                <div className='book-title-author-year'>
                  <h3 className='book-title'>{book.volumeInfo.title}</h3>
                  <h5 className='book-authors'>
                    {book.volumeInfo.authors.join(', ')}
                  </h5>
                  <h6 className='book-year'>
                    {moment(book.volumeInfo.publishedDate).format(
                      'MMMM [de] YYYY'
                    )}
                  </h6>
                </div>
                <div className='book-price'>
                  <h4 className='price'>
                    {book.saleInfo.saleability === 'FOR_SALE'
                      ? book.saleInfo.retailPrice.amount
                        ? `R$ ${book.saleInfo.retailPrice.amount
                            .toFixed(2)
                            .toLocaleString()}`
                        : 'Grátis'
                      : 'Indisponível'}
                  </h4>
                </div>
              </div>
              <div className='book-info'>
                <Info
                  title='Idioma'
                  content={book.volumeInfo.language?.toUpperCase()}
                />
                <Info title='Editora' content={book.volumeInfo.publisher} />
                <Info title='Páginas' content={book.volumeInfo.pageCount} />
              </div>
              <p className='book-desc'>&emsp;{book.volumeInfo.description}</p>
              <div className='buttons'>
                <button onClick={() => history.push(routes.home)}>
                  Voltar
                </button>
                <button onClick={() => window.open(book.volumeInfo.infoLink)}>
                  Ver mais
                </button>
                <button
                  onClick={() => {
                    if (favorite) {
                      removeFavorite(book);
                    } else {
                      addFavorite(book);
                    }
                    setFavorite(!favorite);
                  }}>
                  {favorite ? (
                    <i className='fas fa-heart'></i>
                  ) : (
                    <i className='far fa-heart'></i>
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className='loading'>
          <i className='fas fa-spin fa-spinner' />
        </div>
      )}
    </div>
  );
};

export default BookDetails;
