import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Link para navegação via clique, useNavigate para via código
import API from '../../services/api'
import Swal from "sweetalert2"; // Biblioteca de alertas visuais
import "../admin/admin.css";

function Admin() {
  // Hook para redirecionar o usuário após o login
  const navigate = useNavigate();

  //Estado que vai exibir ou não os valores no campo senha
  const [showPassword, setShowPassword] = useState(false);

  // Estado que armazena os valores dos campos do formulário em um objeto
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Função genérica que atualiza o estado conforme o usuário digita
  function handleChange(e) {
    // Pega o id do input (email ou password) e o valor atual
    const { id, value } = e.target;
    // Atualiza apenas o campo específico, mantendo o que já estava nos outros (...prev)
    setFormData((prev) => ({ ...prev, [id]: value }));
  }

  // Função que lida com o envio do formulário (Login)
  async function handleSubmit(e) {
    e.preventDefault(); // Impede o recarregamento padrão da página

    // Cria um Pop-up de carregamento para que o usuário não fique perdido
    Swal.fire({
      title: "Aguarde!",
      text: "Estamos realizando a conexão...",
      background: "rgba(29, 29, 29, 0.6)",
      color: "#fff",
      allowOutsideClick: false, // Impede fechar cliclando fora
      allowEscapeKey: false, // Impede fechar com o teclado
      showConfirmButton: false,
      customClass: {
        popup: 'my-glass-popup',
        backdrop: 'my-glass-backdrop'
      },
      didOpen: () => {
        Swal.showLoading(); // Adiciona o ícone de carregamento giratório
      }
    });
    
    try {
      // Faz a chamada para a API no backend
      const res = await fetch(`${API}/admin/login`, {
        method: "POST", // Método para envio de dados sensíveis
        headers: {
          "Content-Type": "application/json", // Indica que estamos enviando um JSON
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      // Converte a resposta do servidor para objeto JavaScript
      const data = await res.json();

      // Verifica se a resposta HTTP indica erro (ex: 401 ou 404)
      if (!res.ok) {
        Swal.fire({
          icon: "error",
          title: "Erro no login",
          text: data.error || "Credenciais inválidas",
          background: '#1d1d1d',
          color: '#fff'
        });
        return; // Interrompe a execução aqui se houver erro
      }

      // Se deu certo, salva o Token JWT no navegador (localStorage)
      // Isso serve para manter o usuário logado em outras páginas
      localStorage.setItem("admin_token", data.token);

      // Exibe alerta de sucesso
      Swal.fire({
        icon: "success",
        title: "Login realizado!",
        text: `Bem-vindo, ${data.admin.name}!`,
        timer: 1500,
        showConfirmButton: false,
        background: '#1d1d1d',
        color: '#fff'
      });

      // Redireciona o administrador para a página de Dashboard
      navigate("/dashboard");
      
    } catch (err) {
      // Caso o servidor esteja offline ou ocorra erro de rede
      Swal.fire({
        icon: "error",
        title: "Erro de conexão",
        text: "Não foi possível conectar ao servidor.",
      });
    }
  }

  return (
    <div className="container">
      {/* Botão de retorno para a home usando o Link do router */}
      <div className="btn-back-adm">
        <Link to="/">
          <button>
            <i className="fa-solid fa-arrow-left"></i> Voltar
          </button>
        </Link>
      </div>

      <section className="admin">
        <div className="head">
          <h1>Área Administrativa</h1>
          <p>Acesso restrito a administradores</p>
        </div>

        {/* Formulário chamando a função handleSubmit no envio */}
        <form className="form" onSubmit={handleSubmit}>
          
          <div className="forms-group">
            <i className="fa-solid fa-clipboard-user">
              <label htmlFor="email">Email</label>
            </i>
            <input
              type="email"
              id="email" // O ID deve ser igual à chave no estado (email)
              value={formData.email} // Componente controlado (valor vem do estado)
              onChange={handleChange} // Atualiza o estado a cada tecla
              placeholder="Digite seu Email"
              required
            />
          </div>

          <div className="forms-group">
            <i className="fa-solid fa-lock">
              <label htmlFor="password">Senha</label>
            </i>
          </div>

          <div className="wrapper-password">
            <input
              id="password" // O ID deve ser igual à chave no estado (password)
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              placeholder="Digite sua senha"
              required
            />
            <button 
              className="eyePassword"
              type="button"
              onClick={() => setShowPassword(!showPassword)}>
              <i className={`fa-solid ${showPassword ? "fa-eye" : "fa-eye-slash"}`}></i>
            </button>
          </div>

          <button className="login" type="submit">ENTRAR</button>
        </form>
      </section>
    </div>
  );
}

export default Admin;