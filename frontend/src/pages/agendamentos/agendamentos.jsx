import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import API from '../../services/api';
import { getAppointment, createAppointment } from "../../services/agendamentoService";

import '../agendamentos/agendamento.css';

function Agendamentos() {

    const navigate = useNavigate();
    const SERVICOS = [
        { value: "corte", label: "Corte Masculino - R$ 30" },
        { value: "barba", label: "Barba - R$ 12" },
        { value: "corte_barba", label: "Corte + Barba - R$ 42" },
        { value: "sobrancelha", label: "Sobrancelha - R$ 15" },
    ]
    const HORARIOS = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];
    const [horariosDisponiveis, setHorariosDisponiveis] = useState(HORARIOS);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        nome: '',
        telefone: '',
        servico: '',
        data: '',
        horario: '',
    });

    // Função que lida com o envio do formulário (Agendamentos)
    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

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
            // Envia nosso payload para a service
            const data = await createAppointment(formData);
            console.log('Dados enviado com sucesso!', data);
            setFormData({
                nome: "",
                telefone: "",
                servico: "",
                data: "",
                horario: "",
            })

            const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
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

    // Função que irá que buscar os dias e os horários agendados e válidar se aquele horario está livre
    async function freeTime(e) {
        e.preventDefault();

        const data = await getAppointment();
        console.log('Agendamentos recebidos com sucesso:', data);

        // Busca o elemento horario e data pelo ID  e filtra os valores
        let time = formData.horario;
        let day = formData.data;

        // Filtra os valores selecionados nos campos de Data e Hora        const diaSelecionado = day;
        const diaSelecionado = day;
        const horaSelecionada = time;


        const agendado = data.some(item => {
            // Filtra a data de (2026-02-28T00:00:00.000Z) para ("2026-02-28", "00:00:00.000Z")
            const daiDoItem = item.data.split("T")[0]; //
            // Filtra o horário para futura verificação (09:00) removendo o "H"
            const horaDoItem = String(item.horario).slice(0, 5);
            // Padroniza o valor digitado no input para verificar com o banco de dados
            const horaInput = String(horaSelecionada).slice(0, 5);
            /* 
                A data do banco é igual a data selecionda? É
                O horário do banco é igual o horário selecionado? É
                Se as duas forem verdadeiras retorna True
            */
            return daiDoItem === diaSelecionado && horaDoItem === horaInput;
        });

        if (agendado) {
            const Toast = Swal.mixin({
                toast: true,
                position: "top-end", // Canto superior direito
                showConfirmButton: false,
                timer: 3000,
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
                icon: "error",
                title: `Este horário não está disponível ${formData.nome}!`,
                text: `Por favor, tente outro horario ${formData.data} as ${formData.horario}!`,
                customClass: {
                    popup: 'my-custom-toast',
                    title: 'my-custom-title'
                }
            });
            return;
        }
        handleSubmit(e);
    }

    // Função responsável por inibir so horários já agendados no banco de dados
    async function onChangeData(e) {
        // Captura o valor da data selecionada no input
        const dataEscolhida = e.target.value;

        // Atualiza o estado do formulário mantendo os dados anteriores e alterando apenas a data
        setFormData(prev => ({ ...prev, data: dataEscolhida }));

        const agendamentos = await getAppointment();
        console.log('Busca de agendamento concluida com sucesso!', data);

        //Filtra os agendamentos que correspondem á data escolhidoa
        const horariosOcupado = agendamentos.filter(a => a.data.split("T")[0] === dataEscolhida).map(a => a.horario.replace("h", ""));

        // Compara a lista global de HORARIOS com os ocupados para encontrar os vagos
        const livres = HORARIOS.filter(h => !horariosOcupado.includes(h));

        // Atualiza o estado que controla a exibição od horários disponíveis na interface
        setHorariosDisponiveis(livres);

        // Verificaçãi de consistência:
        // Se o usuário já tinha um horário selecionado e ele NÃO está mais disponivel na nova data, limpa o campo
        setFormData(prev => (livres.includes(prev.horario) ? prev : { ...prev, horario: "" }));
    }


    //Função para atualizar o estado conforme o usuário digita
    const handleChange = (e) => {
        const { id, value, name } = e.target;
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
                <form className="form" onSubmit={freeTime}>
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
                                onChange={(e) => setFormData({
                                    ...formData, telefone: maskTelefone(e.target.value),
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

                            {SERVICOS.map((s) => (
                                <option key={s.value} value={s.label}>{s.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="input-group-primary">
                        <div className="forms-group">
                            <i className="fa-solid fa-calendar"><label htmlFor="data">Data</label></i>
                            <input
                                type="date"
                                id="data"
                                value={formData.data}
                                onChange={onChangeData}
                            />
                        </div>
                        <div className="forms-group">
                            <i className="fa-solid fa-clock"><label htmlFor="horario">Horario</label></i>
                            <select
                                value={formData.horario}
                                id="horario"
                                onChange={handleChange}
                                required
                            >
                                <option value="">Selecione um Horario</option>
                                {horariosDisponiveis.map(h => (<option key={h} value={h}>{h}</option>))}

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