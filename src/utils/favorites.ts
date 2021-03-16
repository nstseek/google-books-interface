import { Book } from 'typings/api';

/**
 * Utilizar um objeto indexado por um ID ao invés de um array de IDs é mais eficaz computacionalmente
 *
 * Utilizando um objeto indexado por IDs dispensará a iteração pelo array para procurar um objeto para remover da lista
 * Você poderá acessar diretamente o objeto utilizando seu ID, sem ter que iterar pelo array para procurar o objeto desejado
 */

/**
 * Adiciona um novo favorito ao localStorage
 * @param book - O livro a ser adicionado
 */
export const addFavorite = (book: Book) => {
  localStorage[book.id] = JSON.stringify(book);
};

/**
 * Remove um favorito do localStorage
 * @param book - O livro a ser removido
 */
export const removeFavorite = (book: Book) => {
  localStorage[book.id] = '';
};
