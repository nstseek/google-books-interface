/**
 * Define o modelo de wrapper utilizado pela API que contém o resultado da query
 * @param T - O tipo do conteúdo que será retornado pela API. No caso dessa aplicação, Livros.
 */
interface ApiResponse<T = any> {
  kind: string;
  /**
   * Informa o valor total de resultados encontrados
   */
  totalItems: number;
  /**
   * Contém os dados resultantes da pesquisa realizada
   */
  items: T;
}

/**
 * Define o modelo de um Livro retornado pela API
 *
 * Algumas propriedades desse modelo tem certos valores possíveis e o tipo `string` não é o melhor para ser utilizado
 *
 * Por exemplo, a propriedade language dentro do objeto volumeInfo tem certos valores possíveis, como 'pt-br | 'en-us' | etc...
 *
 * Mas por falta de tempo, vamos definir como uma simples string
 */
export interface Book {
  kind: string;
  /**
   * Define o ID que identifica o livro
   */
  id: string;
  etag: string;
  /**
   * Contém um link para si mesmo(livro)
   */
  selfLink: string;
  /**
   * Contém os dados específicos do livro
   */
  volumeInfo: {
    /**
     * Define o title do livro
     */
    title: string;
    /**
     * Define os autores do livro
     */
    authors: string[];
    /**
     * Define a data de publicação do livro
     */
    publishedDate: string;
    /**
     * Define a editora que publicou o livro
     */
    publisher: string;
    /**
     * Define a descrição do livro
     */
    description: string;
    /**
     * Contém os identificadores do livro para indústrias e distribuidoras
     */
    industryIdentifiers: {
      type: string;
      identifier: string;
    }[];
    /**
     * Contém os possíveis modos de leitura do livro
     */
    readingModes: {
      text: boolean;
      image: boolean;
    };
    /**
     * Define o número de páginas do livro
     */
    pageCount: number;
    /**
     * Define o tipo de impressão do livro
     */
    printType: string;
    /**
     * Define as categorias do livro
     */
    categories: string[];
    /**
     * Define a classificação etária do livro
     */
    maturityRating: string;
    allowAnonLogging: boolean;
    contentVersion: string;
    panelizationSummary: {
      containsEpubBubbles: boolean;
      containsImageBubbles: boolean;
    };
    /**
     * Contém links para miniaturas do livro
     */
    imageLinks: {
      smallThumbnail: string;
      thumbnail: string;
    };
    /**
     * Define o idioma do livro
     */
    language: string;
    /**
     * Contém um link para preview do livro
     */
    previewLink: string;
    /**
     * Contém um link para mais informações do livro
     */
    infoLink: string;
    canonicalVolumeLink: string;
  };
  /**
   * Contém informações de venda do livro
   */
  saleInfo: {
    /**
     * País de venda
     */
    country: string;
    /**
     * Disponibilidade do livro para venda
     */
    saleability: 'FOR_SALE' | 'NOT_FOR_SALE';
    /**
     * Define se a venda referida é como ebook ou livro físico
     */
    isEbook: boolean;
    /**
     * Define o preço do livro
     */
    retailPrice: {
      /**
       * Define o valor de venda
       */
      amount: number;
      /**
       * Define a moeda utilizada na venda
       */
      currencyCode: 'BRL' | 'USD';
    };
  };
  accessInfo: {
    country: string;
    viewability: string;
    embeddable: boolean;
    publicDomain: boolean;
    textToSpeechPermission: string;
    epub: {
      isAvailable: boolean;
    };
    pdf: {
      isAvailable: boolean;
    };
    webReaderLink: string;
    accessViewStatus: string;
    quoteSharingAllowed: boolean;
  };
  searchInfo: {
    textSnippet: string;
  };
}

/**
 * Define o modelo completo de resposta da API para uma query
 */
export type BookQueryResponse = ApiResponse<Book[]>;

/**
 * Define os query parameters aceitos pela API ao fazer a query
 *
 * Tem vários outros parâmetros que não estamos utilizando nesse momento na aplicação e não estão nessa interface
 */
export interface BookParams {
  /**
   * Define a chave de API
   */
  key?: string;
  /**
   * Define o texto que deve ser usado na busca
   */
  q?: string;
  /**
   * Define o offset da query
   */
  startIndex?: number;
  /**
   * Define o limite de resultados da query
   */
  maxResults?: number;
}
