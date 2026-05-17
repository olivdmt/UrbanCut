const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, "");

const API_URL = `${API_BASE}/admin`;

export async function loginAdmin({ email, senha }) {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type" : "application/json",
        },
        body: JSON.stringify({ email, senha })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Erro ao fazer login")
    }

    return data;
}

export function salvarToken(token) {
  return localStorage.setItem("admin_token", token);  
};

export function obterToken() {
    return localStorage.getItem("admin_token");
};

export function removerToken() {
    return localStorage.removeItem("admin_token");
}

export function adminEstaLogado() {
    return !!obterToken();
}

export async function getUsername() {
    const token = obterToken();

    if (!token) {
        throw new Error('Admin não autenticado');
    }
    const response = await fetch(`${API_URL}/perfil`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || data.message || 'Não foi possível obter o nome de adm');
    }

    return data;
}