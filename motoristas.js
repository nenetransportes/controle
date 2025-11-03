// --- motoristas.js ---
import { supabase } from './supabase-client.js';

// Função 1: Carregar a lista de motoristas
async function carregarMotoristas() {
    const tableBody = document.getElementById('tabela-motoristas-body');
    tableBody.innerHTML = '<tr><td colspan="3" class="p-4 text-center text-gray-400">A carregar motoristas...</td></tr>';

    // Busca dados na tabela 'motoristas'
    const { data, error } = await supabase
        .from('motoristas')
        .select('*')
        .order('nome_completo', { ascending: true }); // Ordem alfabética

    if (error) {
        console.error('Erro ao buscar motoristas:', error);
        tableBody.innerHTML = '<tr><td colspan="3" class="p-4 text-center text-red-400">Erro ao carregar dados.</td></tr>';
        return;
    }

    if (data.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="3" class="p-4 text-center text-gray-400">Nenhum motorista cadastrado.</td></tr>';
        return;
    }

    tableBody.innerHTML = '';
    
    data.forEach(motorista => {
        const tr = `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">${motorista.nome_completo}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${motorista.telefone || '-'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${motorista.cnh || '-'}</td>
            </tr>
        `;
        tableBody.innerHTML += tr;
    });
}

// Função 2: Salvar um novo motorista
async function handleNovoMotorista(event) {
    event.preventDefault();

    const form = event.target;
    const formMessage = document.getElementById('form-message');
    const nome = document.getElementById('nome_completo').value;
    const telefone = document.getElementById('telefone').value;
    const cnh = document.getElementById('cnh').value;
    
    // Insere os dados na tabela 'motoristas'
    const { error } = await supabase
        .from('motoristas')
        .insert([
            { 
                nome_completo: nome, 
                telefone: telefone,
                cnh: cnh
            }
        ]);

    if (error) {
        console.error('Erro ao salvar motorista:', error);
        formMessage.textContent = 'Erro ao salvar o motorista. Tente novamente.';
        formMessage.classList.remove('text-green-400');
        formMessage.classList.add('text-red-400');
    } else {
        formMessage.textContent = 'Motorista salvo com sucesso!';
        formMessage.classList.add('text-green-400');
        formMessage.classList.remove('text-red-400');
        
        form.reset(); 
        carregarMotoristas(); // Atualiza a lista na tela
    }

    setTimeout(() => { formMessage.textContent = ''; }, 3000);
}

const formNovoMotorista = document.getElementById('form-novo-motorista');
formNovoMotorista.addEventListener('submit', handleNovoMotorista);

carregarMotoristas();
