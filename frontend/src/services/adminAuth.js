const API_URL = `${import.meta.env.VITE_API_URL}/admin`;

export async function loginAdmin({ email, senha }) {

    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type" : "application/json",
        },
        body: JSON.stringify({ email, senha})
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Erro ao fazer login")
    }

    return data;
};

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