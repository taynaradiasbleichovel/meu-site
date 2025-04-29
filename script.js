// Carrega os produtos do arquivo JSON
async function carregarProdutos() {
    try {
        const response = await fetch('produtos/produtos.json');
        return await response.json();
    } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        return [];
    }
}

// Exibe os produtos na página
async function exibirProdutos() {
    const produtos = await carregarProdutos();
    const container = document.getElementById('produtosContainer');
    const busca = document.getElementById('busca').value.toLowerCase();
    const categoria = document.getElementById('categoria').value;
    
    container.innerHTML = '';
    
    // Filtra produtos
    const produtosFiltrados = produtos.filter(produto => {
        const matchBusca = produto.nome.toLowerCase().includes(busca) || 
                         produto.descricao.toLowerCase().includes(busca);
        const matchCategoria = categoria === 'todos' || produto.categoria === categoria;
        return matchBusca && matchCategoria;
    });
    
    // Exibe produtos filtrados
    produtosFiltrados.forEach(produto => {
        const produtoElement = document.createElement('div');
        produtoElement.className = 'produto';
        produtoElement.innerHTML = `
            <img src="imagens/${produto.imagem}" alt="${produto.nome}">
            <div class="produto-info">
                <h3>${produto.nome}</h3>
                <p>${produto.descricao}</p>
                <p class="preco">R$ ${produto.preco.toFixed(2)}</p>
                <a href="${produto.link}" class="btn-comprar" target="_blank">Comprar no Mercado Livre</a>
            </div>
        `;
        container.appendChild(produtoElement);
    });
    
    // Atualiza categorias no filtro
    atualizarFiltroCategorias(produtos);
}

// Atualiza o filtro de categorias
function atualizarFiltroCategorias(produtos) {
    const select = document.getElementById('categoria');
    const categorias = ['todos'];
    
    // Coleta categorias únicas
    produtos.forEach(produto => {
        if (!categorias.includes(produto.categoria)) {
            categorias.push(produto.categoria);
        }
    });
    
    // Limpa e recria opções
    select.innerHTML = '';
    categorias.forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria;
        option.textContent = categoria.charAt(0).toUpperCase() + categoria.slice(1);
        select.appendChild(option);
    });
}

// Funções para edição
function configurarEdicao() {
    const btnEditar = document.getElementById('btnEditar');
    const editPanel = document.getElementById('editPanel');
    const btnSalvar = document.getElementById('btnSalvar');
    const produtosData = document.getElementById('produtosData');
    
    btnEditar.addEventListener('click', async () => {
        editPanel.classList.toggle('hidden');
        if (!editPanel.classList.contains('hidden')) {
            const produtos = await carregarProdutos();
            produtosData.value = JSON.stringify(produtos, null, 2);
        }
    });
    
    btnSalvar.addEventListener('click', async () => {
        try {
            const dados = JSON.parse(produtosData.value);
            
            // Aqui você normalmente enviaria para um servidor
            // Como exemplo, vamos apenas recarregar os produtos
            localStorage.setItem('produtosEditados', produtosData.value);
            alert('Alterações salvas localmente!');
            editPanel.classList.add('hidden');
            exibirProdutos();
        } catch (e) {
            alert('Erro ao salvar: JSON inválido');
            console.error(e);
        }
    });
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    exibirProdutos();
    configurarEdicao();
    
    document.getElementById('busca').addEventListener('input', exibirProdutos);
    document.getElementById('categoria').addEventListener('change', exibirProdutos);
});
