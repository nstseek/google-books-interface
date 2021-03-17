import { Book } from 'typings/api';

const MockBook = ({
  kind: 'books#volume',
  id: 'yt1xDwAAQBAJ',
  etag: 'HuTQSM/DpOg',
  selfLink: 'https://www.googleapis.com/books/v1/volumes/yt1xDwAAQBAJ',
  volumeInfo: {
    title: 'Html',
    authors: ['Alenir Paulino Rodrigues'],
    publisher: 'Clube de Autores (managed)',
    description:
      'Códigos Simples para edição de pagina para WEB. Aprenda a fazer e editar lindas páginas para SITE, BLOG.',
    industryIdentifiers: [
      {
        type: 'OTHER',
        identifier: 'PKEY:CLDEAU21814'
      }
    ],
    readingModes: {
      text: false,
      image: true
    },
    pageCount: 26,
    printedPageCount: 26,
    printType: 'BOOK',
    maturityRating: 'NOT_MATURE',
    allowAnonLogging: false,
    contentVersion: 'preview-1.0.0',
    panelizationSummary: {
      containsEpubBubbles: false,
      containsImageBubbles: false
    },
    imageLinks: {
      smallThumbnail:
        'http://books.google.com/books/publisher/content?id=yt1xDwAAQBAJ&printsec=frontcover&img=1&zoom=5&edge=curl&imgtk=AFLRE73mts9D13xZZVKmj7EVZ2DWzE3ab_EaHYP7bwKiS2Yfy6PBYuDwCMH86FPScZU5-cphMO5Vd7a9DdqDep6v7rlMx96hpcIYfpn4PNFbvvkTBSiyuR4AfAA3FQZjcqMs92Oacd6c&source=gbs_api',
      thumbnail:
        'http://books.google.com/books/publisher/content?id=yt1xDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE70_fQZrHTpxy39kENcxcJU7P4ZAqNlJmNlxASTV3nxz2a9N911SJ8WB-oPt9opiWrTNooikdqJeEZ18k2OhSExiJ3Zre567G--BF29cGd2YbZ8YDE4mhnWvI9UDw45NC-WHa5-0&source=gbs_api',
      small:
        'http://books.google.com/books/publisher/content?id=yt1xDwAAQBAJ&printsec=frontcover&img=1&zoom=2&edge=curl&imgtk=AFLRE73gbIb74W3HiYeqqStr3tgi5gWZqjgZwj5Rn0cdaE1S3X4_p3YD3Mqncii28CZninr8PwxmhSVCw2AzBHDkuYICX56GKSvEZY1YThfBvPDXK8eagnJY8F4wXI2JRFEfWEOqLvZy&source=gbs_api',
      medium:
        'http://books.google.com/books/publisher/content?id=yt1xDwAAQBAJ&printsec=frontcover&img=1&zoom=3&edge=curl&imgtk=AFLRE73N7X7UM_OM9UmqKbJRHISID5MpdCF2tINyGYp2geJ2YvfR07YMhzh29xN6g6BgVhJ-1WUnzyehOnydPML9FX_HYGmgVFCZdrlwunA4A48j8EKhtz_XPU25ZMDFNrvWw4aAva-D&source=gbs_api',
      large:
        'http://books.google.com/books/publisher/content?id=yt1xDwAAQBAJ&printsec=frontcover&img=1&zoom=4&edge=curl&imgtk=AFLRE71lAYVx0s0IbSBx6njt6whd3AMMuXZel8cK9mKU6rEVAowoEAjYyAQV7tjxW0Omlcx9T381RM6EzG6-n-5Ryo_bxJo0ZFTAtDdUrN20g2IzRDSzrHNbd3n23p5b1KjFToa-TBir&source=gbs_api',
      extraLarge:
        'http://books.google.com/books/publisher/content?id=yt1xDwAAQBAJ&printsec=frontcover&img=1&zoom=6&edge=curl&imgtk=AFLRE71EikNjZEBtBUF9aXAGUhw9N46gMVf1XsZ-ZSD72g7RNnJ1KF7r6eMzr7DL2WvcNlq_KmumitP3aPTjXUFvWS2BY4PxNih3EJq4sdhS4atouLa5pTRWjYi9WJcP4-z30mcIOa7A&source=gbs_api'
    },
    language: 'pt',
    previewLink:
      'http://books.google.com.br/books?id=yt1xDwAAQBAJ&hl=&source=gbs_api',
    infoLink:
      'https://play.google.com/store/books/details?id=yt1xDwAAQBAJ&source=gbs_api',
    canonicalVolumeLink:
      'https://play.google.com/store/books/details?id=yt1xDwAAQBAJ'
  },
  saleInfo: {
    country: 'BR',
    saleability: 'FOR_SALE',
    isEbook: true,
    listPrice: {
      amount: 41.5,
      currencyCode: 'BRL'
    },
    retailPrice: {
      amount: 41.5,
      currencyCode: 'BRL'
    },
    buyLink:
      'https://play.google.com/store/books/details?id=yt1xDwAAQBAJ&rdid=book-yt1xDwAAQBAJ&rdot=1&source=gbs_api',
    offers: [
      {
        finskyOfferType: 1,
        listPrice: {
          amountInMicros: 41500000,
          currencyCode: 'BRL'
        },
        retailPrice: {
          amountInMicros: 41500000,
          currencyCode: 'BRL'
        },
        giftable: true
      }
    ]
  },
  accessInfo: {
    country: 'BR',
    viewability: 'PARTIAL',
    embeddable: true,
    publicDomain: false,
    textToSpeechPermission: 'ALLOWED',
    epub: {
      isAvailable: false
    },
    pdf: {
      isAvailable: true,
      acsTokenLink:
        'http://books.google.com.br/books/download/Html-sample-pdf.acsm?id=yt1xDwAAQBAJ&format=pdf&output=acs4_fulfillment_token&dl_type=sample&source=gbs_api'
    },
    webReaderLink:
      'http://play.google.com/books/reader?id=yt1xDwAAQBAJ&hl=&printsec=frontcover&source=gbs_api',
    accessViewStatus: 'SAMPLE',
    quoteSharingAllowed: false
  }
} as unknown) as Book;

export default MockBook;
