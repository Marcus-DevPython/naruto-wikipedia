Naruto Wikipedia é uma aplicação web interativa para fãs do universo Naruto. Ela permite que os usuários pesquisem por seus personagens favoritos em uma vasta enciclopédia, visualizem informações e vejam a interface se adaptar com imagens temáticas.
O projeto utiliza uma arquitetura full-stack moderna com um frontend dinâmico e um backend Node.js para servir os dados dos personagens.
**/////////////////////////////////////////////////**

Script de Coleta de Dados (scrape-and-save.js):
Este é um script independente que você executa apenas uma vez (ou quando quiser atualizar os dados).
Ele navega pela Naruto Fandom Wiki, passando por todas as páginas de personagens.
Extrai o nome e o link de cada personagem e salva tudo em um arquivo local chamado characters-db.json, que funciona como nosso banco de dados.
**/////////////////////////////////////////////////**

1. Instalar as Dependências:
   Abra o terminal na pasta do projeto e execute o comando para instalar as bibliotecas necessárias (Express, Axios, etc.) -> npm install

2. Criar o Banco de Dados:
   Agora, vamos executar o script de coleta para criar nosso banco de dados local. Este comando pode demorar um pouco, pois está acessando várias páginas na internet. -> node scrape-and-save.js

3. Com o banco de dados criado, inicie o servidor local. -> npm start

**/////////////////////////////////////////////////**

by:
DC: mxrcus.\_
