// --- supabase-client.js ---
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';

// 1. Cole a URL do seu projeto Supabase aqui
const SUPABASE_URL = 'URL_DO_SEU_PROJETO_SUPABASE'; 
// 2. Cole a Chave "anon public" do seu projeto aqui
const SUPABASE_KEY = 'SUA_CHAVE_ANON_PUBLIC';

// 3. Exporta o cliente Supabase para ser usado em outros arquivos
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
