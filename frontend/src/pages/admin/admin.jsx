import { useState } from "react";
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

import '../admin/admin.css';

function Admin() {
    //Criamos um objeto de estado para todos os campos
    const [formData, setFormData] = useState({
        usuario: ''
        // senha: '',
    });

    //Função para atualizar o estado conforme o usuário digita
    const handleChange = (e) => {
        const {id, value} = e.target;
        //O id ou  name do input deve ser igual a chave no objeto formData
        setFormData({
            ...formData,
            [id]: value
        });
    };

    // Função para lidar com o envio do formulário
    // const handleSubmit = (e) => {
    //     e.preventDefault(); //Impede o recarregamento da página
    //     console.log("Dados do Agendamento:", formData);
    //     // alert(`Iniciando Login ${formData.usuario}!`);
    //     Swal.fire({
    //         title: 'Login em andamento',
    //         text: `Iniciando Login para o usuário: ${formData.usuario}`,
    //         icon: 'info',
    //         confirmButtonText: 'Entendido',
    //         confirmButtonColor: '#6200ee',
    //     });
    //     /* 
    //         Aqui no futuro faremos a chamada para a API/Banco de dados
    //     */
    // };


    const handleSubmit = (e) => {
        e.preventDefault();

        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end', // Canto superior direito
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            // Estilização customizada usando minhas variáveis
            background: '#1d1d1d', // Semelhante ao seu --background-card
            color: '#fff',
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        });

        Toast.fire({
            icon: 'success',
            title: `Bem-vindo, ${formData.usuario}!`,
            text: 'Login iniciado com sucesso.',
            // Customização fina de CSS via JS
            customClass: {
                popup: 'my-custom-toast',
                title: 'my-custom-title'
            }
        });
    };

    return (

        <div className="container">

            <div className="btn-back-adm">
                <Link to="/">
                    <button><i className="fa-solid fa-arrow-left"></i> Voltar</button>
                </Link>
            </div>
            
            <section className="admin">
                <div className="head">
                    <h1>Área Administrativa</h1>
                    <p>Acesso restrito a administradores</p>
                </div>
                <form className="form" onSubmit={handleSubmit}>
                    <div className="forms-group">
                        <i className="fa-solid fa-clipboard-user"><label htmlFor="nome">Usuario</label></i>
                        <input
                            type="text"
                            id="usuario"
                            value={formData.usuario}
                            onChange={handleChange}
                            placeholder="Digite seu Usuário"
                            required
                        />
                    </div>

                    <div className="forms-group">
                        <i className="fa-solid fa-lock"><label htmlFor="senha">Senha</label></i>
                        <input
                            id="senha"
                            onChange={handleChange}
                            placeholder="Digite sua senha"
                            type="password"
                            required
                        />
                    </div>

                    <Link to="/dashboard"><button>ENTRAR</button></Link>
                </form>
            </section>

        </div>
    )
}

export default Admin;