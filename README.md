# Google Books Interface

[![CI/CD](https://github.com/nstseek/google-books-interface/actions/workflows/gh-pages.cicd.yml/badge.svg)](https://github.com/nstseek/google-books-interface/actions/workflows/gh-pages.cicd.yml)

Essa aplicação foi desenvolvida para completar o teste técnico proposto para a vaga de desenvolvedor front-end. Você pode visualizar a aplicação funcionando em [https://gb-interface.web.app](https://gb-interface.web.app). Você também pode visualizar o estado das builds e deploys de cada commit visualizando o histórico de commits [aqui](https://github.com/nstseek/google-books-interface/commits/master) ou vendo o estado dos workflows do repositório [aqui](https://github.com/nstseek/google-books-interface/actions).

## Tecnologias

Esse projeto foi desenvolvido utilizando algumas das mais recentes tecnologias com o React (como React Hooks), TypeScript, Jest, Enzyme, SCSS, Axios, Puppeteer e algumas outras bibliotecas de minha autoria, como [@nstseek/react-ui](https://www.npmjs.com/package/@nstseek/react-ui).

### Redux

A decisão de não utilizar Redux nesse projeto se deve ao tamanho da aplicação. O Redux não se fez necessário aqui, os recursos que o framework(React) nos proporciona são mais do que suficientes para o desenvolvimento da aplicação. A aplicação não possui um gerenciamento de estado complexo nem possui vários níveis de componentes trocando dados entre si, a profundidade máxima de componentes que trocam dados é de 1. Uma ferramenta de gerenciamento de estado como Redux ou Context API não seria adequado nesse projeto, pois o benefício seria nulo e a complexidade do projeto aumentaria. Sempre torne o seu código o mais simples possível. 

## Documentação

O projeto possui uma cobertura de documentação razoável utilizando [JSDOC](https://jsdoc.app/) em cada componente e interface relevante da aplicação. Caso a sua IDE suporte, basta você passar o mouse sobre um componente e verá uma descrição a respeito do mesmo, explicando qual o propósito daquele componente/variável/interface. Segue um exemplo no link abaixo para demonstrar a funcionalidade funcionando no Visual Studio Code

![JSDOC example](src/assets/Screenshot_1.png?raw=true 'JSDOC example')

Caso a sua IDE não suporte a notação [JSDOC](https://jsdoc.app/), basta ler o comentário sobre a declaração do componente/váriavel/interface. A documentação foi escrita em inglês por costume próprio e porque a aplicação está disponível no meu perfil do GitHub, o qual é voltado mais pra área internacional(inglês) do que nacional(português).

## Continuous Integration and Continuous Deployment (CI/CD)

Um [processo de CI/CD simples](https://github.com/nstseek/google-books-interface/actions?query=workflow%3ACI%2FCD) foi implementado nesse projeto utilizando as Actions do GitHub. Toda vez que algum commit é adicionado a master, o projeto passa por sua bateria de testes, é buildado e deployado no Firebase, podendo ser visualizado no [endereço mencionado acima](https://github.com/nstseek/google-books-interface/actions).

## Testes

A cobertura de testes unitários está bem precária por falta de tempo para desenvolvê-la. Como é um projeto de teste apenas, não vejo necessidade de cobrir o projeto inteiro com testes unitários pois demandaria tempo que não tenho disponível.

O resultado dos testes de cada commit é publicado utilizando o GitHub Actions logo após rodarem, como você pode ver [aqui](https://github.com/nstseek/google-books-interface/runs/1804083211).

O projeto também possui uma cobertura superficial de testes end-to-end apenas para demonstração de conhecimento utilizando [Puppeteer](https://pptr.dev/).

## Flow de trabalho

O projeto possui uma série de filtros para garantir a qualidade do código criado, como [linters](https://eslint.org/), [formatters](https://prettier.io/) e [testes unitários](https://jestjs.io/en/) com um [wrapper específico](https://enzymejs.github.io/enzyme/) que rodam toda vez que o desenvolvedor tenta realizar o push para o repositório através dos git hooks. Esse projeto utiliza o pacote [husky](https://www.npmjs.com/package/husky) que torna muito simples a configuração de git hooks em qualquer repositório Git. Toda vez que o desenvolvedor tenta realizar o push, o script [npm run check](https://github.com/nstseek/google-books-interface/blob/0a1278989bf1a95ad667fe4e06ca02cf585d25c4/package.json#L41) [roda antes que o push seja efetuado](https://github.com/nstseek/google-books-interface/blob/0a1278989bf1a95ad667fe4e06ca02cf585d25c4/package.json#L92), garantindo que o código que está sendo enviado passa em todos os testes e builda corretamente.

## Scripts disponíveis

### npm start

Inicia o projeto na sua máquina local.

### npm run build

Cria um build do projeto para ser servido.

### npm run eject

Ejeta toda a articulação do create-react-app que não é totalmente visível/manipulável para o desenvolvedor final.

### npm test

Executa todos os testes unitários do projeto.

### npm run test:watch

Executa todos os testes unitários do projeto em modo de observação.

### npm run test:report

Executa todos os testes unitários do projeto e gera um report para ser publicado com o GitHub Actions.

### npm run prettier

Executa o [formatter](https://prettier.io/) instalado no projeto para verificar os arquivos existentes.

### npm run prettier:fix

Executa o [formatter](https://prettier.io/) instalado no projeto para corrigir os erros nos arquivos existentes.

### npm run lint

Executa o [linter](https://eslint.org/) instalado no projeto para verificar os arquivos existentes.

### npm run lint:fix

Executa o [linter](https://eslint.org/) instalado no projeto para corrigir os erros nos arquivos existentes.

### npm run check

Executa uma verificação completa no projeto, incluindo o linter, formatter, os testes unitários e o build.

### npm run check:ci

Executa uma verificação completa no projeto destinada para um ambiente CI, incluindo o linter, formatter, os testes unitários (gerando um report para publicação) e o build.

### npm run check:fix

Executa uma verificação completa no projeto, incluindo o linter, formatter, os testes unitários e o build, corrigindo os erros passíveis de correção automática com o linter e o formatter.
