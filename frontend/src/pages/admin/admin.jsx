import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Link para navegação via clique, useNavigate para via código
import API from '../../services/api.js'
import {salvarToken, loginAdmin} from '../../services/adminAuth.js';
import Swal from "sweetalert2"; // Biblioteca de alertas visuais
import "../admin/admin.css";


function Admin() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

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
      const data = await adminAuth(formData);
      console.log('Admin authenticado com sucesso!', data);
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
      console.error('Não foi possível authenticar usuário.', err.message);
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