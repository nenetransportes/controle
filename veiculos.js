// --- veiculos.js ---
import { supabase } from './supabase-client.js';

// Função 1: Carregar a lista de veículos do banco
async function carregarVeiculos() {
    const tableBody = document.getElementById('tabela-veiculos-body');
    tableBody.innerHTML = '<tr><td colspan="4" class="p-4 text-center text-gray-400">A carregar veículos...</td></tr>';

    // Busca dados na tabela 'veiculos'
    const { data, error } = await supabase
        .from('veiculos')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Erro ao buscar veículos:', error);
        tableBody.innerHTML = '<tr><td colspan="4" class="p-4 text-center text-red-400">Erro ao carregar dados.</td></tr>';
        return;
    }

    if (data.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4" class="p-4 text-center text-gray-400">Nenhum veículo cadastrado.</td></tr>';
        return;
    }

    tableBody.innerHTML = '';
    
    data.forEach(veiculo => {
        const tr = `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">${veiculo.nome_veiculo}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${veiculo.categoria || '-'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${veiculo.placa || '-'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-800 text-blue-100">
                        ${veiculo.status_atual}
                    </span>
                </td>
            </tr>
        `;
        tableBody.innerHTML += tr;
    });
}

// Função 2: Salvar um novo veículo
async function handleNovoVeiculo(event) {
    event.preventDefault();

    const form = event.target;
    const formMessage = document.getElementById('form-message');
    const nome = document.getElementById('nome_veiculo').value;
    const placa = document.getElementById('placa').value;
    const categoria = document.getElementById('categoria').value;
    
    // Insere os dados na tabela 'veiculos'
    const { error } = await supabase
        .from('veiculos')
        .insert([
            { 
                nome_veiculo: nome, 
                placa: placa,
                categoria: categoria,
                status_atual: 'Disponível' // Define um status padrão
            }
        ]);

    if (error) {
        console.error('Erro ao salvar veículo:', error);
        formMessage.textContent = 'Erro ao salvar o veículo. Tente novamente.';
        formMessage.classList.remove('text-green-400');
        formMessage.classList.add('text-red-400');
    } else {
        formMessage.textContent = 'Veículo salvo com sucesso!';
        formMessage.classList.add('text-green-400');
        formMessage.classList.remove('text-red-400');
        
        form.reset(); 
        carregarVeiculos(); // Atualiza a lista na tela
    }

    setTimeout(() => { formMessage.textContent = ''; }, 3000);
}

const formNovoVeiculo = document.getElementById('form-novo-veiculo');
formNovoVeiculo.addEventListener('submit', handleNovoVeiculo);

carregarVeiculos();
