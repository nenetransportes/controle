// --- auth.js ---
import { supabase } from './supabase-client.js';

// Função para checar a sessão (proteger a página)
// Muito similar ao 'checkAdminPermissions' do seu admin.html
async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    
    // Se estiver no dashboard E NÃO tiver sessão...
    if (document.body.id === 'dashboard-page' && !session) {
        window.location.href = '/login.html'; // ...manda para o login
        return;
    }
    
    // Se estiver na página de login E TIVER sessão...
    if (document.body.id === 'login-page' && session) {
        window.location.href = '/dashboard.html'; // ...manda para o dashboard
        return;
    }

    // Se passou na verificação do dashboard, esconde o "loading" e mostra o app
    if (document.body.id === 'dashboard-page') {
        document.getElementById('loading-screen').classList.add('hidden');
        document.getElementById('app-layout').classList.remove('hidden');
    }
}

// --- LÓGICA DE LOGIN ---
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Impede o recarregamento da página
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorMessage = document.getElementById('error-message');
        
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) throw error;
            
            // Se o login for bem-sucedido, redireciona para o dashboard
            window.location.href = '/dashboard.html';

        } catch (error) {
            errorMessage.textContent = 'Email ou senha inválidos.';
            console.error('Erro no login:', error.message);
        }
    });
}

// --- LÓGICA DE LOGOUT ---
const logoutButton = document.getElementById('logout-button');
if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
        await supabase.auth.signOut();
        // Após o logout, redireciona para o login
        window.location.href = '/login.html';
    });
}

// --- IDENTIFICADOR DE PÁGINA ---
// Adiciona um ID ao body para o 'checkAuth' saber em qual página está
if (window.location.pathname.includes('dashboard.html')) {
    document.body.id = 'dashboard-page';
}
if (window.location.pathname.includes('login.html')) {
    document.body.id = 'login-page';
}

// Roda a verificação de autenticação assim que a página carregar
document.addEventListener('DOMContentLoaded', checkAuth);
