import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import API from '../../services/api'

import '../agendamentos/agendamento.css';

function Agendamentos() {

    const navigate = useNavigate(); // Inicializa a função de navegação

    /// Inicializa o estado para carregamento
    const [loading, setLoading] = useState(false);
    
    //Criamos um objeto de estado para todos os campos
    const [formData, setFormData] = useState({
        nome: '',
        telefone: '',
        servico: '',
        data: '',
        horario: '',
    });

    // Função que lida com o envio do formulário (Agendamentos)
    async function handleSubmit(e) {
        e.preventDefault(); // Impede o carregamento da padráo da página
        setLoading(true); // Bloqueia o botão

        //Cria um pop up de carregamento enquanto o JSON de agendamento é enviado ao  banco de dados
        Swal.fire({
            title: 'Aguarde!',
            text: 'Estamos organizando seu agendamento...',
            background: 'rgba(29, 29, 29, 0.6)',
            color: '#fff',
            allowOutsideClick: false, // Impede de fechar clicando fora
            allowEscapeKey: false, // Impede de fechar com o teclado
            showConfirmButton: false,
            customClass: {
                popup: 'my-glass-popup',
                backdrop: 'my-class-backdrop'
            },
            didOpen: () => {
                Swal.showLoading(); // Adiciona o ícone de carregamento giratório
            }
        })

        try {
            // Faz a chamada para a API na rota "/agendamentos" no backend
            const res = await fetch(`${API}/agendamentos`, {
                method: "POST", // Método para envio de dados sensíveis
                headers: {
                    "Content-Type": "application/json", // Indica que estamos enviando um JSON 
                },
                // Aqui enviaremos uma requisção e passamos os dados que serão enviados
                body: JSON.stringify(formData),
            });

            // Converte a resposta do servidor para objeto JavaScript
            const data = await res.json();

            // Verifica se a reposta HTTP indica erro (ex: 401 ou 404)
            if (!res.ok) {
                Swal.fire({
                    icon: "error",
                    title: "Não foi possível fazer o agendamento",
                    text: data.error || "Dados inválidos",
                    background: "#1d1d1d",
                    color: "#fff",
                });
                return; // Interrompe a execução aqui se houver erro
            }

             // Reseta os campos após o envio do formulário
                setFormData({ 
                    nome: "",
                    telefone: "",
                    servico: "",
                    data: "",
                    horario: "",
                })

            const Toast = Swal.mixin({
                toast: true,
                position: "top-end", // Canto superior direito
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                // Estilização
                background: "#1d1d1d",
                color: "#fff",
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseLeave', Swal.resumeTimer)
                }
            })
                
            Toast.fire({
                icon: "success",
                title: `Agendamento realizado, ${formData.nome}!`,
                text: `Aguardamos você no dia ${formData.data} as ${formData.horario}!`,
                customClass: {
                    popup: 'my-custom-toast',
                    title: 'my-custom-title'
                }
            });
            setLoading(false);
        } catch (err) {
            //Caso o servidor estaja offline ou ocrra erro de rede
            Swal.fire({
                icon: "error",
                title: "Erro de conexão",
                text: "Não foi possível conectar ao servidor.",
            });
        } finally {
            setLoading(false);
        }
    }

    //Função para atualizar o estado conforme o usuário digita
    const handleChange = (e) => {
        const { id, value, name } = e.target;
        //O id ou  name do input deve ser igual a chave no objeto formData
        setFormData({
            ...formData,
            [id || name]: value
        });
    };

    function maskTelefone(value) {
        // Remove tudo que não for número
        let v = value.replace(/\D/g, "");

        // Limita a 11 dígitos (DDD + 9 dígitos)
        v = v.slice(0, 11);

        // Aplica a máscara: (00) 0 0000-0000
        if (v.length > 6) {
            v = v.replace(/^(\d{2})(\d{1})(\d{4})(\d{0,4}).*/, "($1) $2 $3-$4");
        } else if (v.length > 2) {
            v = v.replace(/^(\d{2})(\d{0,1})(\d{0,4}).*/, "($1) $2 $3");
        } else if (v.length > 0) {
            v = v.replace(/^(\d{0,2}).*/, "($1");
        }

        return v;
        }

    return (

        <div className="container">

            <div className="btn-back-agd">
                <Link to="/">
                    <button><i className="fa-solid fa-arrow-left"></i> Voltar</button>
                </Link>
            </div>
            
            <section className="agendamentos">
                <div className="head">
                    <h1>Agendar Horário</h1>
                    <p>Preencha os dados abaixo para realizar seu agendamento</p>
                </div>
                <form className="form" onSubmit={handleSubmit}>
                    <div className="input-group-primary">
                        <div className="forms-group">
                            <i className="fa-solid fa-clipboard-user"><label htmlFor="nome">Nome Completo</label></i>
                            <input
                                type="text"
                                id="nome"
                                value={formData.nome}
                                onChange={handleChange}
                                placeholder="Digite seu Nome"
                                required
                            />
                        </div>
                        <div className="forms-group">
                            <i className="fa-solid fa-phone"><label htmlFor="telefone">Telefone</label></i>
                            <input
                                type="text"
                                id="telefone"
                                placeholder="(000) 0 0000-0000"
                                value={formData.telefone}
                                onChange={(e) => setFormData({ ...formData, telefone: maskTelefone(e.target.value),
                                })}
                             />
                        </div>
                    </div>

                    <div className="forms-group">
                        <i className="fa-solid fa-scissors"><label htmlFor="servico">Serviço</label></i>
                        <select 
                            id="servico"
                            value={formData.servico}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Selecione um serviço</option>
                            <option value="corte">Corte Maculino - R$ 30</option>
                            <option value="barba">Barba - R$ 12</option>
                            <option value="sobrancelha">Sobrancelha - R$ 20</option>
                            <option value="combo">Corte + Barba - R$ 40</option>
                        </select>
                    </div>

                    <div className="input-group-primary">
                        <div className="forms-group">
                            <i className="fa-solid fa-calendar"><label htmlFor="data">Data</label></i>
                            <input
                                type="date"
                                id="data"
                                value={formData.data}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="forms-group">
                            <i className="fa-solid fa-clock"><label htmlFor="horario">Horario</label></i>
                            <select
                                value={formData.horario}
                                id="horario"
                                onChange={handleChange}
                            >
                                <option value="">Selecione um horário</option>
                                <option value="09:00">09:00h</option>
                                <option value="10:00">10:00h</option>
                                <option value="11:00">11:00h</option>
                                <option value="12:00">12:00h</option>
                                <option value="14:00">14:00h</option>
                                <option value="15:00">15:00h</option>
                                <option value="16:00">16:00h</option>
                                <option value="17:00">17:00h</option>
                                <option value="18:00">18:00h</option>
                                <option value="19:00">19:00h</option>
                            </select>
                        </div>
                    </div>

                    <button disabled={loading}>{loading ? "Enviando..." : "CONFIRMAR AGENDAMENTO"}</button>
                </form>
            </section>

        </div>
    )
}

export default Agendamentos;