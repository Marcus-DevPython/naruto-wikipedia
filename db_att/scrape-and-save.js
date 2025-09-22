// Importando as bibliotecas necessárias
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

/**
 * Esta função navega por todas as páginas da categoria de personagens do Fandom Wiki,
 * extrai os dados e os adiciona a um arquivo JSON local existente, evitando duplicatas.
 */
const scrapeAndSaveCharacters = async () => {
    try {
        const dbPath = path.join(__dirname, '/db_characters/characters-db.json');
        let existingCharacters = [];

        // 1. Carrega os personagens já existentes, se o arquivo existir
        if (fs.existsSync(dbPath)) {
            try {
                const rawData = fs.readFileSync(dbPath, 'utf8');
                existingCharacters = JSON.parse(rawData);
                console.log(`Encontrados ${existingCharacters.length} personagens no banco de dados existente.`);
            } catch (readError) {
                console.error('Erro ao ler o banco de dados existente. O arquivo pode estar corrompido.', readError);
                return; // Aborta a execução se não conseguir ler o arquivo
            }
        }

        // 2. Define a URL de início e prepara para a nova busca
        let currentUrl = 'https://naruto.fandom.com/pt-br/wiki/Categoria:Personagens?from=Tsunami';
        const baseUrl = 'https://naruto.fandom.com';
        const newCharacters = [];

        console.log('Iniciando busca por novos personagens para adicionar ao banco de dados...');

        // 3. Loop para navegar por todas as páginas de personagens
        while (currentUrl) {
            console.log(`Buscando em: ${currentUrl}`);
            const { data } = await axios.get(currentUrl);
            const $ = cheerio.load(data);

            // Extrai os personagens da página atual
            $('a.category-page__member-link').each((index, element) => {
                const linkElement = $(element);
                const name = linkElement.text().trim();
                const href = linkElement.attr('href');

                if (name && href) {
                    newCharacters.push({
                        name: name,
                        link: `${baseUrl}${href}`
                    });
                }
            });

            // Procura pelo link da próxima página
            const nextPageLink = $('.category-page__pagination-next a').attr('href');
            currentUrl = nextPageLink ? nextPageLink : null;
        }
        
        console.log(`\nBusca finalizada. Foram encontrados ${newCharacters.length} personagens na nova busca.`);

        // 4. Combina a lista antiga com a nova e remove duplicatas
        if (newCharacters.length > 0) {
            const combinedCharacters = [...existingCharacters, ...newCharacters];
            const uniqueCharactersMap = new Map();
            
            combinedCharacters.forEach(char => {
                // A chave do Map é o link, garantindo a unicidade de cada personagem
                uniqueCharactersMap.set(char.link, char);
            });

            const finalCharacterList = Array.from(uniqueCharactersMap.values());
            const addedCount = finalCharacterList.length - existingCharacters.length;
            
            // 5. Salva a lista final e atualizada no arquivo
            fs.writeFileSync(dbPath, JSON.stringify(finalCharacterList, null, 2), 'utf8');
            
            if (addedCount > 0) {
                console.log(`\x1b[32m%s\x1b[0m`, `${addedCount} novos personagens foram adicionados.`);
            } else {
                console.log(`\x1b[33m%s\x1b[0m`, "Nenhum personagem novo foi encontrado para adicionar.");
            }
            console.log(`\x1b[32m%s\x1b[0m`, `Banco de dados salvo com sucesso em "${dbPath}". Total de ${finalCharacterList.length} personagens.`);

        } else {
            console.log("\x1b[33m%s\x1b[0m", "AVISO: Nenhum personagem foi encontrado na busca. O banco de dados não foi modificado.");
        }
        
    } catch (error) {
        console.error('\x1b[31m%s\x1b[0m', 'Ocorreu um erro durante a busca e salvamento dos dados:', error.message); // Mensagem em vermelho
    }
};

// Executa a função principal
scrapeAndSaveCharacters();

