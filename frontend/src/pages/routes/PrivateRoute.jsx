import { Navigate } from 'react-router-dom';

// "Children" representa os componentes que estão dentro de <PrivateRoute> (ex: Dashboard)
export default function PrivateRoute({ children }) {
    // Tenta buscar o token de autenticação que foi salvo no navegador durante o login
    const token = localStorage.getItem("admin_token");

    // Se não houver token (usuário não está logado):
    // O componente retorna um <Navigate />, que joga o usuário de volta para a tela de login ("/admin")
    // O atributo 'replace' substitui o histórico, impedindo que o usuário volte com o botão "voltar" do navegador
    if (!token) return <Navigate to="/admin" replace />;

    // Se houver tokne
    // Ele permite o acesso e renderiza os componentes filhos ('children') normalmente
    return children;
}