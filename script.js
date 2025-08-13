// Inicializar o sistema
const LUGARES_KEY = 'casamento_locais';

// Carregar dados do localStorage ou criar array vazio
let locais = JSON.parse(localStorage.getItem(LUGARES_KEY)) || [];

// Status possíveis
const STATUS = [
    { value: 'nao_visitado', label: 'Não visitado' },
    { value: 'visitado', label: 'Visitado' },
    { value: 'pre_selecionado', label: 'Pré-selecionado' },
    { value: 'descartado', label: 'Descartado' }
];

// Função para salvar no localStorage
function salvarLocais() {
    localStorage.setItem(LUGARES_KEY, JSON.stringify(locais));
}

// Função para adicionar novo local
function adicionarLocal(local) {
    locais.push(local);
    salvarLocais();
    renderizarLocais();
}

// Função para atualizar status
function atualizarStatus(id, novoStatus) {
    const local = locais.find(l => l.id === id);
    if (local) {
        local.status = novoStatus;
        salvarLocais();
        renderizarLocais();
    }
}

// Função para renderizar os locais
function renderizarLocais() {
    const container = document.getElementById('locais');
    container.innerHTML = '';

    locais.forEach(local => {
        const card = document.createElement('div');
        card.className = 'local-card';

        // Adicionar imagem ou placeholder
        if (local.imagem) {
            card.innerHTML += `<img src="${local.imagem}" alt="${local.nome}">`;
        } else {
            card.innerHTML += '<div class="placeholder">Sem imagem</div>';
        }

        // Adicionar informações do local
        card.innerHTML += `
            <h3>${local.nome}</h3>
            ${local.endereco ? `<p class="endereco">${local.endereco}</p>` : ''}
            ${local.link ? `<a href="${local.link}" target="_blank" class="link">${local.link}</a>` : ''}
            <select class="status-select" onchange="atualizarStatus(${local.id}, this.value)">
                ${STATUS.map(s => `
                    <option value="${s.value}" ${s.value === local.status ? 'selected' : ''}>
                        ${s.label}
                    </option>
                `).join('')}
            </select>
        `;

        container.appendChild(card);
    });
}

// Funções do modal
const modal = document.getElementById('modal');
const btnAbrir = document.getElementById('abrirModal');
const btnFechar = document.getElementById('fecharModal');
const spanFechar = document.getElementsByClassName('close')[0];

// Abrir modal
btnAbrir.onclick = function() {
    modal.style.display = 'block';
}

// Fechar modal com botão "X"
spanFechar.onclick = function() {
    modal.style.display = 'none';
}

// Fechar modal com botão "Cancelar"
btnFechar.onclick = function() {
    modal.style.display = 'none';
}

// Fechar modal ao clicar fora
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Event listener para o formulário
document.getElementById('localForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const endereco = document.getElementById('endereco').value;
    const link = document.getElementById('link').value;
    const imagemInput = document.getElementById('imagem');
    let imagem = null;

    // Se houver imagem selecionada, converter para base64
    if (imagemInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagem = e.target.result;
            salvarLocal();
        };
        reader.readAsDataURL(imagemInput.files[0]);
    } else {
        salvarLocal();
    }

    function salvarLocal() {
        const novoLocal = {
            id: Date.now(),
            nome,
            endereco,
            link,
            imagem,
            status: 'nao_visitado'
        };

        adicionarLocal(novoLocal);
        this.reset();
        modal.style.display = 'none'; // Fechar modal após salvar
    }
});

// Inicializar a aplicação
renderizarLocais();
