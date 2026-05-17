const cleanBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, "");

const API_URL = `${cleanBaseUrl}/admin`;

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