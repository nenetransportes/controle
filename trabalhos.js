// --- trabalhos.js ---
import { supabase } from './supabase-client.js';

// Função 1: Carregar a lista de trabalhos do banco
async function carregarTrabalhos() {
    const tableBody = document.getElementById('tabela-trabalhos-body');
    tableBody.innerHTML = '<tr><td colspan="4" class="p-4 text-center text-gray-400">A carregar trabalhos...</td></tr>'; // Limpa a tabela

    // Busca dados na tabela 'trabalhos'
    const { data, error } = await supabase
        .from('trabalhos')
        .select('*')
        .order('created_at', { ascending: false }); // Mais novos primeiro

    if (error) {
        console.error('Erro ao buscar trabalhos:', error);
        tableBody.innerHTML = '<tr><td colspan="4" class="p-4 text-center text-red-400">Erro ao carregar dados.</td></tr>';
        return;
    }

    if (data.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4" class="p-4 text-center text-gray-400">Nenhum trabalho cadastrado.</td></tr>';
        return;
    }

    // Limpa a tabela antes de adicionar novas linhas
    tableBody.innerHTML = '';
    
    // Cria uma linha <tr> para cada trabalho
    data.forEach(trabalho => {
        const tr = `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">${trabalho.nome_projeto}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${trabalho.produtora_cliente}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    ${new Date(trabalho.created_at).toLocaleDateString('pt-BR')}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-800 text-green-100">
                        ${trabalho.status_trabalho}
                    </span>
                </td>
            </tr>
        `;
        tableBody.innerHTML += tr;
    });
}

// Função 2: Salvar um novo trabalho
async function handleNovoTrabalho(event) {
    event.preventDefault(); // Impede o recarregamento da página

    const form = event.target;
    const formMessage = document.getElementById('form-message');
    const nomeProjeto = document.getElementById('nome_projeto').value;
    const produtoraCliente = document.getElementById('produtora_cliente').value;
    
    // Pega o ID do usuário logado (para o campo 'criado_por')
    const { data: { user } } = await supabase.auth.getUser();

    // Insere os dados na tabela 'trabalhos'
    const { error } = await supabase
        .from('trabalhos')
        .insert([
            { 
                nome_projeto: nomeProjeto, 
                produtora_cliente: produtoraCliente,
                status_trabalho: 'Agendado', // Define um status padrão
                criado_por: user.id
            }
        ]);

    if (error) {
        console.error('Erro ao salvar trabalho:', error);
        formMessage.textContent = 'Erro ao salvar o trabalho. Tente novamente.';
        formMessage.classList.remove('text-green-400');
        formMessage.classList.add('text-red-400');
    } else {
        formMessage.textContent = 'Trabalho salvo com sucesso!';
        formMessage.classList.add('text-green-400');
        formMessage.classList.remove('text-red-400');
        
        form.reset(); // Limpa o formulário
        carregarTrabalhos(); // Atualiza a lista de trabalhos na tela
    }

    // Limpa a mensagem após 3 segundos
    setTimeout(() => { formMessage.textContent = ''; }, 3000);
}

// Ouve o envio do formulário
const formNovoTrabalho = document.getElementById('form-novo-trabalho');
formNovoTrabalho.addEventListener('submit', handleNovoTrabalho);

// Carrega os trabalhos assim que a página é aberta
carregarTrabalhos();
