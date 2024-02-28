let food = 50;
let water = 50;
let shelter = false;
let health = 100;
let energy = 100;
let fatigue = 0;
let inventory = [];
let level = 1;
let experience = 0;

// Definir craftings disponíveis
const craftings = {
    'faca': { name: 'Faca', resources: ['Pedra', 'Galho'] },
    'arco': { name: 'Arco', resources: ['Corda', 'Madeira'] },
    'abrigo_simples': { name: 'Abrigo Simples', resources: ['Madeira'] },
    'abrigo_duplo': { name: 'Abrigo Duplo', resources: ['Madeira', 'Folhas'] }
    // Adicione mais craftings conforme necessário
};

function updateStatus() {
    document.getElementById('food').innerText = food.toFixed(2);
    document.getElementById('water').innerText = water.toFixed(2);
    document.getElementById('shelter').innerText = shelter ? 'Construído' : 'Não Construído';
    document.getElementById('energy').innerText = energy.toFixed(2);
    document.getElementById('fatigue').innerText = fatigue.toFixed(2);
    document.getElementById('health').innerText = getHealthStatus();
    document.getElementById('inventory').innerText = inventory.length > 0 ? inventory.join(', ') : 'Nenhum item';
    document.getElementById('level').innerText = level;
    document.getElementById('experience').innerText = experience;
    
    // Verifica se o jogador está morto
    if (health <= 0) {
        gameOver();
    }
}

function getHealthStatus() {
    if (health >= 80) {
        return "Saudável";
    } else if (health >= 50) {
        return "Machucado";
    } else if (health >= 20) {
        return "Ferido";
    } else {
        return "Gravemente Ferido";
    }
}

function gatherFood() {
    if (energy <= 0) {
        alert("Você está muito cansado para procurar comida!");
        return;
    }
    const foundFood = Math.random() * 10 + 1;
    food += foundFood;
    updateStatus();
    alert(`Você encontrou ${foundFood.toFixed(2)}% de comida!`);
    decreaseEnergy();
}

function gatherWater() {
    if (energy <= 0) {
        alert("Você está muito cansado para procurar água!");
        return;
    }
    const foundWater = Math.random() * 10 + 1;
    water += foundWater;
    updateStatus();
    alert(`Você encontrou ${foundWater.toFixed(2)}% de água!`);
    decreaseEnergy();
}

function buildShelter() {
    if (energy <= 0) {
        alert("Você está muito cansado para construir um abrigo!");
        return;
    }
    if (shelter) {
        alert("Você já tem um abrigo!");
        return;
    }
    if (inventory.includes('Madeira') && inventory.includes('Folhas')) {
        shelter = true;
        // Remova os recursos usados para a construção do abrigo
        inventory.splice(inventory.indexOf('Madeira'), 1);
        inventory.splice(inventory.indexOf('Folhas'), 1);
        updateStatus();
        alert("Você construiu um abrigo!");
        decreaseEnergy();
    } else {
        alert("Você não tem os recursos necessários para construir um abrigo!");
    }
}

function hunt() {
    if (energy <= 0) {
        alert("Você está muito cansado para caçar!");
        return;
    }
    if (!shelter) {
        alert("Você precisa de um abrigo para caçar com segurança!");
        return;
    }
    const animals = ['Coelho', 'Veado', 'Urso', 'Lobo']; // Lista de animais possíveis para caçar
    const huntedAnimal = animals[Math.floor(Math.random() * animals.length)];
    const success = Math.random() < 0.5; // 50% chance de sucesso na caça
    if (success) {
        const foodGained = Math.random() * 20 + 5;
        food += foodGained;
        updateStatus();
        alert(`Você teve sucesso na caça e conseguiu ${foodGained.toFixed(2)}% de comida! Você caçou um ${huntedAnimal}.`);
        gainExperience(10); // Ganha experiência pela caça bem-sucedida
        decreaseEnergy();
    } else {
        alert("Você não teve sucesso na caça desta vez.");
    }
}

function useItem() {
    if (inventory.length === 0) {
        alert("Seu inventário está vazio!");
        return;
    }

    let itemToUse = prompt("Digite o nome do item que deseja usar:\n\n" + inventory.join(', '));
    itemToUse = itemToUse.trim().toLowerCase();

    if (inventory.includes(itemToUse)) {
        const itemIndex = inventory.indexOf(itemToUse);
        const usedItem = inventory.splice(itemIndex, 1)[0];

        switch (usedItem) {
            case 'Faca':
                alert("Você usou a faca!");
                break;
            case 'Arco':
                alert("Você usou o arco!");
                break;
            // Adicione mais casos para outros itens conforme necessário
            default:
                alert(`Você usou o ${usedItem}!`);
                break;
        }

        updateStatus();
    } else {
        alert(`Você não possui o item "${itemToUse}" no inventário.`);
    }
}

function craftItem() {
    if (energy <= 0) {
        alert("Você está muito cansado para fazer crafting!");
        return;
    }
    const selectedItem = prompt("Digite o nome do item que deseja craftar:");
    if (selectedItem) {
        switch (selectedItem.toLowerCase()) {
            case 'faca':
                if (inventory.includes('Pedra') && inventory.includes('Galho')) {
                    inventory.push('Faca');
                    // Remova os recursos usados para a criação
                    inventory.splice(inventory.indexOf('Pedra'), 1);
                    inventory.splice(inventory.indexOf('Galho'), 1);
                    updateStatus();
                    alert("Você criou uma faca!");
                    decreaseEnergy();
                } else {
                    alert("Você não tem os recursos necessários para criar uma faca!");
                }
                break;
            case 'arco':
                if (inventory.includes('Corda') && inventory.includes('Madeira')) {
                    inventory.push('Arco');
                    // Remova os recursos usados para a criação
                    inventory.splice(inventory.indexOf('Corda'), 1);
                    inventory.splice(inventory.indexOf('Madeira'), 1);
                    updateStatus();
                    alert("Você criou um arco!");
                    decreaseEnergy();
                } else {
                    alert("Você não tem os recursos necessários para criar um arco!");
                }
                break;
            case 'abrigo_simples':
                if (inventory.includes('Madeira')) {
                    shelter = true;
                    inventory.splice(inventory.indexOf('Madeira'), 1);
                    updateStatus();
                    alert("Você construiu um abrigo simples!");
                    decreaseEnergy();
                } else {
                    alert("Você não tem os recursos necessários para construir um abrigo simples!");
                }
                break;
            case 'abrigo_duplo':
                if (inventory.includes('Madeira') && inventory.includes('Folhas')) {
                    shelter = true;
                    inventory.splice(inventory.indexOf('Madeira'), 1);
                    inventory.splice(inventory.indexOf('Folhas'), 1);
                    updateStatus();
                    alert("Você construiu um abrigo duplo!");
                    decreaseEnergy();
                } else {
                    alert("Você não tem os recursos necessários para construir um abrigo duplo!");
                }
                break;
            // Adicione mais casos conforme necessário
            default:
                alert("Item de crafting desconhecido!");
                break;
        }
    }
}

function gainExperience(amount) {
    experience += amount;
    // Verifica se o jogador subiu de nível
    if (experience >= 100) {
        levelUp();
    }
}

function levelUp() {
    level++;
    experience = 0; // Zera a experiência necessária para o próximo nível
    // Implemente as recompensas de nível aqui (por exemplo, desbloqueio de habilidades)
    alert("Você subiu de nível!");
}

function consumeResources() {
    // Verifica se o jogador está morto e encerra o consumo de recursos se o jogo terminou
    if (health <= 0 || food <= 0 || water <= 0) {
        return;
    }

    food -= Math.random() * 5 + 1;
    water -= Math.random() * 5 + 1;
    updateStatus();
    updateHealth();
    if (food <= 0 || water <= 0) {
        alert("Você morreu de fome ou desidratação!");
        gameOver(); // Chama a função de fim de jogo se o jogador morrer
    }
}

function updateHealth() {
    if (food <= 0 || water <= 0) {
        health -= 10;
    }
    if (!shelter) {
        health -= 5;
    }
}

// Função para descansar e recuperar energia
function rest() {
    const restTime = Math.random() * 10 + 5; // Tempo de descanso aleatório entre 5 e 15 minutos
    energy += 10; // Recupera 10% de energia
    fatigue -= 5; // Reduz a fadiga em 5%
    if (energy > 100) {
        energy = 100; // Limita a energia máxima a 100%
    }
    if (fatigue < 0) {
        fatigue = 0; // Garante que a fadiga não seja menor que zero
    }
    updateStatus();
    alert(`Você descansou por ${restTime.toFixed(2)} minutos e recuperou energia.`);
}

// Função para diminuir a energia gradualmente
function decreaseEnergy() {
    energy -= Math.random() * 2 + 1; // Reduz entre 1% e 3% de energia
    if (energy < 0) {
        energy = 0; // Garante que a energia não seja menor que zero
    }
    updateStatus();
}

// Função de fim de jogo
function gameOver() {
    alert("Você morreu! O jogo acabou.");
    // Desabilita todos os botões de ação
    const actionButtons = document.querySelectorAll('#actions button');
    actionButtons.forEach(button => button.disabled = true);
    // Desativa a função de crafting
    document.getElementById('crafting').disabled = true;
}

// Função para procurar itens
function searchItem() {
    if (energy <= 0) {
        alert("Você está muito cansado para procurar itens!");
        return;
    }
    const items = {
        'Pedra': 0.3,   // 30% de chance de encontrar uma pedra
        'Galho': 0.4,   // 40% de chance de encontrar um galho
        'Corda': 0.2,   // 20% de chance de encontrar uma corda
        'Madeira': 0.5, // 50% de chance de encontrar madeira
        'Folhas': 0.6   // 60% de chance de encontrar folhas
        // Adicione mais itens e suas probabilidades conforme necessário
    };

    const randomChance = Math.random();
    let foundItem = null;

    // Verifica a probabilidade de encontrar cada item
    for (const item in items) {
        if (randomChance <= items[item]) {
            foundItem = item;
            break;
        }
    }

    if (foundItem) {
        inventory.push(foundItem);
        updateStatus();
        alert(`Você encontrou ${foundItem}!`);
        decreaseEnergy();
    } else {
        alert("Você não encontrou nenhum item desta vez.");
    }
}

// Simula a adição de um item ao inventário a cada 30 segundos
setInterval(function() {
    if (energy > 0) {
        const items = ['Pedra', 'Galho', 'Corda', 'Madeira', 'Folhas']; // Adicionando Folhas como um recurso
        const randomItem = items[Math.floor(Math.random() * items.length)];
        inventory.push(randomItem);
        updateStatus();
    }
}, 30000); // 30 segundos

// Atualiza os recursos a cada 5 segundos
setInterval(consumeResources, 5000);

// Atualiza a energia gradualmente a cada 10 segundos
setInterval(decreaseEnergy, 10000);

// Função para abrir o livro de craftings
function openCraftingBook() {
    const craftingList = document.getElementById('craftingList');
    // Limpa a lista antes de adicionar novos itens
    craftingList.innerHTML = '';
    // Adiciona cada crafting à lista
    for (const key in craftings) {
        if (craftings.hasOwnProperty(key)) {
            const crafting = craftings[key];
            const listItem = document.createElement('li');
            listItem.textContent = `${crafting.name}: ${crafting.resources.join(', ')}`;
            craftingList.appendChild(listItem);
        }
    }
    // Exibe o livro de craftings
    document.getElementById('craftingBook').style.display = 'block';
}

// Função para fechar o livro de craftings
function closeCraftingBook() {
    document.getElementById('craftingBook').style.display = 'none';
}

updateStatus(); // Atualiza o status inicial
