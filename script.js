document.addEventListener('DOMContentLoaded', () => {
    const defaultBackground = 'background.jpg'; // Fundo padrão
    const searchInput = document.getElementById('searchInput');
    const suggestionsDiv = document.getElementById('suggestions');
    const resultDiv = document.getElementById('result');
    const searchButton = document.getElementById('searchButton');
    const clearButton = document.getElementById('clearButton');
    const body = document.body;
    
    let characterData = []; // Esta lista agora será preenchida pela nossa API

    // Função para buscar os dados do nosso servidor
    async function fetchCharacters() {
        try {
            // A mágica acontece aqui! Fazemos uma requisição para o nosso servidor local.
            const response = await fetch('http://localhost:3000/characters');
            if (!response.ok) {
                throw new Error('Não foi possível conectar ao servidor.');
            }
            characterData = await response.json();
            console.log(`${characterData.length} personagens carregados!`);
        } catch (error) {
            console.error('Erro ao carregar personagens:', error);
            resultDiv.innerHTML = `
                <div class="character-card rounded-xl p-8 text-center bg-red-800 bg-opacity-80">
                    <h3 class="text-2xl font-bold text-white">Falha ao carregar dados</h3>
                    <p class="text-gray-200 mt-2">Não foi possível conectar ao servidor de dados. Certifique-se de que o servidor local está rodando.</p>
                </div>
            `;
        }
    }

    function searchCharacter() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        resultDiv.innerHTML = '';
        suggestionsDiv.innerHTML = '';

        // A lógica de busca continua a mesma, mas agora com dados dinâmicos.
        const character = characterData.find(c => c.name.toLowerCase() === searchTerm);

        if (character) {
            // A exibição do card agora mostra o nome e o link para a página da Fandom
            // Como não temos mais imagens de fundo e descrições, simplificamos o card.
            body.style.backgroundImage = `url('${defaultBackground}')`; // Usamos o fundo padrão
            const card = `
                <div class="character-card rounded-xl shadow-2xl overflow-hidden p-8">
                    <h3 class="text-3xl font-bold text-orange-400 naruto-font tracking-wider mb-3">${character.name}</h3>
                    <p class="text-white leading-relaxed">
                        Para ver mais detalhes sobre este personagem, visite a página oficial na Fandom Wiki.
                    </p>
                    <a href="${character.link}" target="_blank" rel="noopener noreferrer" 
                       class="inline-block mt-4 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                        Ver na Wiki
                    </a>
                </div>
            `;
            resultDiv.innerHTML = card;
        } else if (searchTerm) {
            resultDiv.innerHTML = `
                <div class="character-card rounded-xl p-8 text-center">
                    <h3 class="text-2xl font-bold text-white">Personagem não encontrado</h3>
                    <p class="text-gray-300 mt-2">Tente pesquisar por um nome da lista de sugestões.</p>
                </div>
            `;
            body.style.backgroundImage = `url('${defaultBackground}')`;
        }
    }

    function clearSearch() {
        searchInput.value = '';
        resultDiv.innerHTML = '';
        suggestionsDiv.innerHTML = '';
        body.style.backgroundImage = `url('${defaultBackground}')`;
    }

    searchInput.addEventListener('input', () => {
        const term = searchInput.value.toLowerCase();
        suggestionsDiv.innerHTML = '';
        if (term.length > 0 && characterData.length > 0) {
            const matches = characterData.filter(char => char.name.toLowerCase().includes(term));
            matches.slice(0, 10).forEach(character => { // Limita a 10 sugestões
                const suggestionItem = document.createElement('div');
                suggestionItem.className = 'p-2 suggestion-item text-gray-800';
                suggestionItem.textContent = character.name;
                suggestionItem.addEventListener('click', () => {
                    searchInput.value = character.name;
                    suggestionsDiv.innerHTML = '';
                    searchCharacter();
                });
                suggestionsDiv.appendChild(suggestionItem);
            });
        }
    });
    
    document.addEventListener('click', function(event) {
        if (!searchInput.contains(event.target) && !suggestionsDiv.contains(event.target)) {
            suggestionsDiv.innerHTML = '';
        }
    });
    
    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            searchCharacter();
        }
    });

    searchButton.addEventListener('click', searchCharacter);
    clearButton.addEventListener('click', clearSearch);

    // Chama a função para buscar os personagens assim que a página carregar
    fetchCharacters();
});

