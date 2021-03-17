/**
 * Gera um ID númerico a partir de uma string
 *
 * O algorítmo utilizado para gerar o ID número é uma **função bijetora**, ou seja
 *
 * *Para cada valor de X existe um, apenas e obrigatoriamente um, valor de Y*
 *
 * Em outras palavras, toda string diferente terá um ID númerico diferente, nunca igual
 *
 * Serve para criar uma key em um array de elementos React gerando keys a partir dos string IDs dos livros da API do Google Books,
 * garantindo assim a eficácia do React ao renderizar arrays de elementos
 *
 * Veja mais sobre funções bijetoras em https://www.todamateria.com.br/funcao-bijetora/
 *
 * @param strId - ID como string
 * @returns ID númerico
 */
const generateId = (strId: string): number => {
  let id = 1;
  strId.split('').forEach((char, index) => {
    id += char.charCodeAt(0) * Math.pow(10, index);
  });
  return id;
};

export default generateId;
