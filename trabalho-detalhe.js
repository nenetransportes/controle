// --- trabalho-detalhe.js ---
import { supabase } from './supabase-client.js';

// Pega o ID do trabalho da URL (ex: ...?id=ABC-123)
const urlParams = new URLSearchParams(window.location.search);
const trabalhoId = urlParams.get('id');

// Se não houver ID, volta para a página de trabalhos
if (!trabalhoId) {
    window.location.href = '/trabalhos.html';
}

// Função 1: Carregar os dados do Trabalho (o cabeçalho)
async function carregarDetalhesTrabalho() {
    const { data, error } = await supabase
        .from('trabalhos')
        .select('*')
        .eq('id', trabalhoId)
        .single(); // .single() pega apenas um registro

    if (error || !data) {
        console.error('Erro ao buscar trabalho:', error);
        document.getElementById('titulo-trabalho').textContent = 'Trabalho não encontrado';
    } else {
        document.getElementById('titulo-trabalho').textContent = data.nome_projeto;
        document.getElementById('cliente-trabalho').textContent = data.produtora_cliente;
    }
}

// Função 2: Carregar os Dropdowns (Veículos e Motoristas)
async function carregarDropdowns() {
    const selectVeiculo = document.getElementById('select-veiculo');
    const selectMotorista = document.getElementById('select-motorista');

    // Busca todos os veículos
    const { data: veiculos, error: veiculosError } = await supabase.from('veiculos').select('id, nome_veiculo');
    if (veiculos) {
        selectVeiculo.innerHTML = '<option value="">Selecione um veículo</option>'; // Limpa o "A carregar..."
        veiculos.forEach(v => {
            selectVeiculo.innerHTML += `<option value="${v.id}">${v.nome_veiculo}</option>`;
        });
    }

    // Busca todos os motoristas
    const { data: motoristas, error: motoristasError } = await supabase.from('motoristas').select('id, nome_completo');
    if (motoristas) {
        selectMotorista.innerHTML = '<option value="">Selecione um motorista</option>'; // Limpa o "A carregar..."
        motoristas.forEach(m => {
            selectMotorista.innerHTML += `<option value="${m.id}">${m.nome_completo}</option>`;
        });
    }
}

// Função 3: Carregar Alocações Existentes (a tabela)
async function carregarAlocacoes() {
    const tableBody = document.getElementById('tabela-alocacoes-body');
    tableBody.innerHTML = '<tr><td colspan="3" class="p-4 text-center text-gray-400">A carregar alocações...</td></tr>';

    // Busca na tabela 'alocacoes_veiculos'
    // Esta é uma query complexa: ela busca dados em tabelas relacionadas!
    const { data, error } = await supabase
        .from('alocacoes_veiculos')
        .select(`
            id,
            valor_diaria_negociado,
            veiculos ( nome_veiculo ), 
            motoristas ( nome_completo )
        `)
        .eq('trabalho_id', trabalhoId); // Filtra SÓ para este trabalho

    if (error) {
        console.error('Erro ao buscar alocações:', error);
        tableBody.innerHTML = '<tr><td colspan="3" class="p-4 text-center text-red-400">Erro ao carregar dados.</td></tr>';
        return;
    }

    if (data.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="3" class="p-4 text-center text-gray-400">Nenhum veículo alocado neste trabalho.</td></tr>';
        return;
    }

    tableBody.innerHTML = '';
    data.forEach(alocacao => {
        const tr = `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">${alocacao.veiculos.nome_veiculo}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${alocacao.motoristas.nome_completo}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">R$ ${parseFloat(alocacao.valor_diaria_negociado).toFixed(2)}</td>
            </tr>
        `;
        tableBody.innerHTML += tr;
    });
}

// Função 4: Salvar uma Nova Alocação
async function handleNovaAlocacao(event) {
    event.preventDefault();
    const formMessage = document.getElementById('form-message');
    
    const veiculoId = document.getElementById('select-veiculo').value;
    const motoristaId = document.getElementById('select-motorista').value;
    const valorDiaria = document.getElementById('valor_diaria').value;

    // Insere na tabela 'alocacoes_veiculos'
    const { error } = await supabase
        .from('alocacoes_veiculos')
        .insert([
            {
                trabalho_id: trabalhoId, // O ID que pegamos da URL
                veiculo_id: veiculoId,
                motorista_id: motoristaId,
                valor_diaria_negociado: valorDiaria
            }
        ]);
    
    if (error) {
        console.error('Erro ao salvar alocação:', error);
        formMessage.textContent = 'Erro ao salvar alocação. Tente novamente.';
        formMessage.classList.remove('text-green-400');
        formMessage.classList.add('text-red-400');
    } else {
        formMessage.textContent = 'Alocação salva com sucesso!';
        formMessage.classList.add('text-green-400');
        formMessage.classList.remove('text-red-400');
        
        // Limpa (parcialmente) o formulário e recarrega a tabela
        document.getElementById('form-nova-alocacao').reset();
        carregarAlocacoes(); 
    }
    
    setTimeout(() => { formMessage.textContent = ''; }, 3000);
}

// Roda tudo quando a página carrega
document.getElementById('form-nova-alocacao').addEventListener('submit', handleNovaAlocacao);
carregarDetalhesTrabalho();
carregarDropdowns();
carregarAlocacoes();
