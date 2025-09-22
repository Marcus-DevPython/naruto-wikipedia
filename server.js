// Importando as bibliotecas necessárias
const express = require('express');
const cors = require('cors');
const fs = require('fs'); // Módulo para interagir com o sistema de arquivos
const path = require('path'); // Módulo para lidar com caminhos de arquivos

// Inicializando o aplicativo Express
const app = express();
const PORT = 3000;

// Habilitando o CORS
app.use(cors());

// Caminho para o nosso banco de dados local
const dbPath = path.join(__dirname, '/db_characters/characters-db.json');
let charactersData = [];

// Tenta carregar os dados do banco de dados na inicialização do servidor
try {
    const rawData = fs.readFileSync(dbPath, 'utf8');
    charactersData = JSON.parse(rawData);
    console.log(`Banco de dados local carregado com sucesso. ${charactersData.length} personagens disponíveis.`);
} catch (error) {
    console.error('------------------------------------------------------------------');
    console.error('ERRO: Não foi possível carregar o banco de dados "characters-db.json".');
    console.error('--> Por favor, execute o comando "node scrape-and-save.js" primeiro para criar o arquivo.');
    console.error('------------------------------------------------------------------');
}

// Rota principal para buscar os personagens do arquivo local
app.get('/characters', (req, res) => {
    if (charactersData.length === 0) {
        return res.status(500).json({ error: 'Nenhum dado de personagem disponível. Execute o script de busca primeiro.' });
    }
    res.json(charactersData);
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log('Servindo dados a partir do banco de dados local.');
});

