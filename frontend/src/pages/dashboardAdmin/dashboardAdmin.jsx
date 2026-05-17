import { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import API from '../../services/api';
import { getAppointment, createAppointment, deleteAppointment, updateAppointment } from "../../services/agendamentoService";
import { obterToken, adminEstaLogado, removerToken, loginAdmin, getUsername } from "../../services/adminAuth";

import '../dashboardAdmin/dashboardAdmin.css';

function DashboardAdmin() {

    const [agendamentos, setAgendamentos] = useState([]);
    const [agendamentosFiltrados, setAgendamentosFiltrados] = useState([]);

    const [formData, setFormData] = useState({
        data: '',
        cliente: '',
    });

    const HORARIOS = [
        "09:00", "10:00", "11:00", "12:00",
        "13:00", "14:00", "15:00", "16:00",
        "17:00", "18:00", "19:00",
    ];

    const SERVICOS = [
        { value: "corte", label: "Corte Masculino - R$ 30" },
        { value: "barba", label: "Barba - R$ 12" },
        { value: "corte_barba", label: "Corte + Barba - R$ 42" },
        { value: "sobrancelha", label: "Sobrancelha - R$ 15" },
    ];

    const navigate = useNavigate();

    useEffect(() => {
        async function showAppointments() {
            try {
                const data = await getAppointment();
                console.log('Agendamentos buscado com sucesso!');
                setAgendamentos(data);
                setAgendamentosFiltrados(data);
            } catch (error) {
                console.error('Não foi possível buscar agendamentos.', error.message);
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end', // Canto superior direito
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true,
                    background: '#1d1d1d',
                    color: '#fff',
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseLeave', Swal.resumeTimer)
                    }
                });
                Toast.fire({
                    icon: 'error',
                    title: 'Erro na busca',
                    text: `Não foi possível encontrar agendamentos: ${error}`,
                    customClass: {
                        poup: 'my-custom-toast',
                        title: 'my-custom-title'
                    }
                });
            }
        }
        showAppointments();
    }, []);

    // Função disparada ao clicar no botão "Sair"
    function logout() {
        // Exibi uma caixa de diálogo de confirmação
        Swal.fire({
            title: "Sair da conta?",
            text: "Você será desconectado da área de administrativa.",
            icon: "question", // Icone de interrogação
            background: '#1d1d1d',
            color: '#fff',
            showCancelButton: true,
            cancelButtonColor: "rgb(0, 255, 251)",
            confirmButtonText: "Sair",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#e53935",
        }).then((result) => {
            // Verifica se o usuário clicou no botão de confirmação (Sair)
            if (result.isConfirmed) {
                // REMOÇÃO DO TOKEN
                // Apaga a "chave" de acesso do navegador
                // A partir daqui, o "PrivateRoute" bloqueara o acesso a esta página
                localStorage.removeItem("admin_token");
                // Redireciona o usuário para a página de login
                navigate("/adminPage");
            }
        });
    }

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({
            ...formData, // Mantém o que já tinha (spread operator)
            [id]: value  // Atualiza apenas o campo que mudou (data ou cliente)
        });
    };

    const aplicarFiltros = () => {
        const dataFiltro = formData.data; // "YYYY-MM-DD"
        const clienteFiltro = formData.cliente.trim().toLowerCase();

        const filtrados = agendamentos.filter((item) => {
            //Filtro por cliente
            const matchCliente = clienteFiltro ? item.nome?.toLowerCase().includes(clienteFiltro) : true;
            // Filtro por data 
            // item.data pode vir com ISO "2026-02-22T00:00.000Z"
            const itemData = String(item.data).slice(0, 10);
            const matchData = dataFiltro ? itemData === dataFiltro : true;

            return matchCliente && matchData;
        });

        setAgendamentosFiltrados(filtrados);
    }

    // Precisa ainda criar um botão para esta função!!!
    // const limparFiltros = () => {
    //     setFormData({ data: "", cliente: ""});
    //     setAgendamentosFiltrados(agendamentos);
    // };

    // Função responsável pela criação de um agendamento pela tela Administrativa
    const handleCreateAppointments = async () => {
        const servicoOptions = SERVICOS.map((s) =>
            `<option value="${s.label}" ${SERVICOS == s.label ? "selected" : ""}>${s.label}</option>`).join();

        const { value: formValues } = await Swal.fire({
            title: 'Deseja criar um novo agendamento?',
            background: '#1d1d1d',
            color: '#fff',
            customClass: {
                poup: 'swal-edit-modal',
            },
            html: `
                <style>
                    .swal-custom-select option {
                        backgroud-color: #1d1d1d;
                        color: #fff;
                    }
                    
                    select.swal-custom-select:focus {
                        border-color: #7066e0;
                    }
                </style>
                <div style="display:flex; flex-direction: column; gap 10px; text-align: left;">
                    <label>Nome Completo</label>
                    <input id="swal-nome" class="swal2-input" style="margin: 0; width: 100%;">

                    <label>Serviço</label>
                    <select
                        id="swal-servico"
                        class="swal2-input"
                        style="margin: 0; width: 100%; background: #1d1d1d; color: #fff;"
                    >
                        ${servicoOptions}
                    </select>
                    `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Salvar Agendamento',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#ff4d4d'
        });

        try {
            const data = await createAppointment(formValues);
            console.log('Agendamento criado com sucesso!', data);
        } catch (error) {
            console.error('Não foi possível criar um novo agendamento.', error.message);
        }
    }

    const handleEdit = async (id, agendamento) => {
        const servicoBanco = String(agendamento.servico || "").trim();
        const horarioBanco = String(agendamento.horario || "").slice(0, 5).trim();
        const servicoOptions = SERVICOS.map((s) =>
            `<option value="${s.label}" ${servicoBanco === s.label ? "selected" : ""}>${s.label}</option>`).join("");

        const horarioOptions = HORARIOS.map((h) =>
            `<option value="${h}" ${horarioBanco === h ? "selected" : ""}>${h}</option>`).join("")

        const { value: formValues } = await Swal.fire({
            title: 'Editar Agendamentos',
            background: '#1d1d1d',
            color: '#fff',
            customClass: {
                popup: "swal-edit-modal",
            },
            html: `
                <style>
                    .swal-custom-select option {
                        background-color: #1d1d1d;
                        color: #fff;
                    }

                    select.swal-custom-select:focus {
                        border-color: #7066e0;
                    }
                </style>
                <div style="display: flex; flex-direction: column; gap: 10px; text-align: left;">
                    <label>Nome do Cliente</label>
                    <input id="swal-nome" class="swal2-input" value="${agendamento.nome}" style="margin: 0; width: 100%;">
                    
                    <label>Serviço</label>
                    <select 
                        id="swal-servico" 
                        class="swal2-input" 
                        value="${agendamento.servico}" 
                        style="margin: 0; width: 100%; background: #1d1d1d; color: #fff;"
                    >
                        ${servicoOptions}
                    </select>
                    <label>Data</label>
                    <input id="swal-data" type="date" class="swal2-input" value="${String(agendamento.data).slice(0, 10)}" style="margin: 0; width: 100%;">
                    
                    <label>Horário</label>
                    <select 
                        id="swal-horario" 
                        type="text" 
                        class="swal2-input" 
                        value="${agendamento.horario}" 
                        style="margin: 0; width: 100%; background: #1d1d1d; color: #fff;"
                    >
                        ${horarioOptions}
                    </select>
                    <label>Status</label>
                    <select
                        id="swal-status"
                        class="swal2-input swal-custom-select"
                        style="margin: 0; width: 100%; color: #fff; background: #333; border: 1px solid rgba(147, 145, 145, 0.249); outline: none;"
                        value=${formData.status}
                    >
                        <option value="Pendente" ${agendamento.status === 'Pendente' ? 'selected' : ''}>Pendente</option>
                        <option value="Confirmado" ${agendamento.status === 'Confirmado' ? 'selected' : ''}>Confirmado</option>
                    </select>
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Salvar Alteração',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#ff4d4d',
            // Pega os valores digitados dentro do modal do Swal e transforma em um objeto
            preConfirm: () => ({
                nome: document.getElementById('swal-nome').value,
                servico: document.getElementById('swal-servico').value,
                data: document.getElementById('swal-data').value,
                horario: document.getElementById('swal-horario').value,
                status: document.getElementById('swal-status').value
            }),
        });

        // Se o usuário clicar em "Cancelar", sai
        if (!formValues) return;

        try {
            const data = await updateAppointment(id, formValues);
            console.log('Agendamento editado com sucesso!', data);
            // Atualiza a lista na tela
            setAgendamentosFiltrados((prev) =>
                prev.map((item) =>
                    item.id === agendamento.id ? { ...item, ...formValues } : item
                )
            );

            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end', // Alinha no canto superior direito
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                background: '#1d1d1d',
                color: '#fff',
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseLeave', Swal.resumeTimer)
                }
            })

            Toast.fire({
                icon: 'success',
                title: 'Atualizado',
                text: 'Agendamento foi modificado com sucesso',
                customClass: {
                    popup: 'my-custom-toast',
                    title: 'my-custom-title'
                }
            })
        } catch (error) {
            console.error(error.message);
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end', // Alinha no canto superior direito
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                background: '#1d1d1d',
                color: '#fff',
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseLeave', Swal.resumeTimer)
                }
            });

            Toast.fire({
                icon: 'error',
                title: 'ERRO',
                text: `Não foi possível atualizar o agendamento: ${error.message}`,
                customClass: {
                    popup: 'my-custom-toast',
                    title: 'my-custom-title'
                }
            });
        }
    };


    const handleDelete = (id, nome) => {
        Swal.fire({
            title: 'Tem certeza?',
            text: `Você está prestes a excluir o agendamento de ${nome}.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sim, deletar!',
            cancelButtonText: 'Cancelar',
            background: '#1d1d1d',
            color: '#fff'
        }).then(async (result) => {
            // Se o usuário confirmou a exclusão
            if (result.isConfirmed) {
                try {
                    const data = await deleteAppointment(id);
                    const novaLista = agendamentos.filter(item => item.id !== id);
                    setAgendamentosFiltrados(novaLista);
                    Swal.fire({
                        title: 'Deletado!',
                        icon: 'success',
                        timer: 1500,
                        showConfirmButton: false,
                        background: '#1d1d1d',
                        color: '#fff'
                    });
                } catch (error) {
                    console.error("Erro ao deletar: ", error)
                    Swal.fire({
                        title: 'Error',
                        text: 'Não foi possível apagar no servidor. Verifique sua conexão',
                        icon: 'error',
                        timer: 1500,
                        background: '#1d1d1d',
                        color: '#fff'
                    });
                }
            }
        });
    };

    return (
        <>
            <div className="container">
                {/* Botão de navegação para voltar à Home */}
                <div className="btn-back-dash">
                    <button onClick={logout}><i className="fa-solid fa-right-from-bracket"></i> Sair</button>
                </div>

                <section className="header">
                    <h1>Painel Administrativo</h1>
                    <p>Bem vindo, Admin</p>
                </section>

                {/* Seção de Filtros (Busca) */}
                <section className="filter">
                    <h3><i className="fa-solid fa-filter"></i>Filtros</h3>
                    <form className="formsubmit" onSubmit={(e) => e.preventDefault()}>
                        {/* Input de Data */}
                        <div className="filter-groups">
                            <label htmlFor="data">Data</label>
                            <input type="date" name="data" id="data" onChange={handleChange} />
                        </div>

                        {/* Input de Nome do Cliente */}
                        <div className="filter-groups">
                            <label htmlFor="cliente">Cliente</label>
                            <input
                                type="text"
                                id="cliente"
                                placeholder="Digite o nome do Cliente"
                                onChange={handleChange}
                            />
                        </div>

                        <div className="filter-groups">
                            <button className="createAppoitments" type="button" onClick={handleCreateAppointments}>NOVO AGENDAMENTO</button>
                            <button className="applyFilter" type="button" onClick={aplicarFiltros}>APLICAR FILTROS</button>
                        </div>
                    </form>
                </section>

                {/* Seção da Tabela de Agendamentos */}
                <section className="agenda">
                    <h3>Agendamentos</h3>
                    <div className="agenda-section">
                        <table className="dash-table">
                            <thead>
                                <tr>
                                    <th><i className="fa-solid fa-calendar"></i> Data</th>
                                    <th><i className="fa-solid fa-clock"></i> Horario</th>
                                    <th><i className="fa-solid fa-user"></i> Cliente</th>
                                    <th><i className="fa-solid fa-scissors"></i> Serviço</th>
                                    <th><i className="fa-solid fa-phone"></i> Telefone</th>
                                    <th>Status</th>
                                    <th>Ações</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {agendamentosFiltrados.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" style={{ textAlign: "center", padding: "20px" }}>
                                            Não há agendamentos para exibir
                                        </td>
                                    </tr>
                                ) : (
                                    agendamentosFiltrados.map((item) => (
                                        <tr key={item.id}>
                                            {/* Formata o item data para remover o padrão ISO 8601*/}
                                            <td>{new Date(item.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
                                            <td>{item.horario}</td>
                                            <td>{item.nome}</td>
                                            <td>{item.servico}</td>
                                            <td>{item.telefone}</td>
                                            <td>
                                                <span className={`status-badge ${item.status.toLowerCase()}`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td>
                                                {/* Botão Editar: passa o objeto 'item' inteiro */}
                                                <button className="btn-edit" onClick={() => handleEdit(item.id, item)}>
                                                    <i className="fa-solid fa-pen-to-square"></i>
                                                </button>
                                            </td>
                                            <td>
                                                {/* Botão Deletar: passa o 'id' e 'nome' do item atual */}
                                                <button className="btn-delete" onClick={() => handleDelete(item.id, item.nome)}>
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </>
    );
}

export default DashboardAdmin;