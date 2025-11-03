// --- supabase-client.js ---
// Erro corrigido com +esm e suas chaves
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// 1. Sua URL do Supabase
const SUPABASE_URL = 'https://wsbdhavigcabcnqlrdnl.supabase.co'; 
// 2. Sua Chave "anon public"
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndzYmRoYXZpZ2NhYmNucWxyZG5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxOTI0ODcsImV4cCI6MjA3Nzc2ODQ4N30.fXy3oFmv1Zv8CKBNUrAYrNfymv4zA09IcULVsXQ--i8';

// 3. Exporta o cliente Supabase para ser usado em outros arquivos
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
