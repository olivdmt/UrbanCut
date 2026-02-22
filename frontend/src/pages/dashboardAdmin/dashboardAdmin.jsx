import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../dashboardAdmin/dashboardAdmin.css'

function DashboardAdmin() {

    const navigate = useNavigate(); // Inicializa a função de navegação
    // --- ESTADOS (STATES) ---
    
    const [agendamentos, setAgendamentos] = useState([
        { id: 1, nome: "Joaquim Barbosa", servico: "Corte Masculino", data: "2026-02-18", horario: "10:00h", status: "Pendente" },
        { id: 2, nome: "Paola Oliveira", servico: "Sobrancelha", data: "2026-03-21", horario: "14:00h", status: "Confirmado" },
        { id: 3, nome: "Richard Rasmussen", servico: "Corte + Barba", data: "2026-05-20", horario: "09:00h", status: "Pendente" },
    ]);

    // Função disparada ao clicar no botão "Sair"
    function logout() {
        // Exibi uma caixa de diálogo de confirmação
        Swal.fire({
            title: "Sair da conta?",
            text: "Você será desconectado da área de administrativa.",
            icon: "question", // Icone de interrogação
            background: '#1d1d1d',
            color: '#fff',
            showCancellButton: true, 
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

    // Estado para armazenar o que o usuário digita nos campos de filtro
    const [formData, setFormData] = useState({
        data: '',
        cliente: '',
    });

    // --- FUNÇÕES DE MANIPULAÇÃO ---

    // Atualiza o estado formData sempre que o usuário digita nos filtros
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({
            ...formData, // Mantém o que já tinha (spread operator)
            [id]: value  // Atualiza apenas o campo que mudou (data ou cliente)
        });
    };

    // Função assíncrona para editar (espera a resposta do SweetAlert)
    const handleEdit = async (agendamento) => {
        const { value: formValues} = await Swal.fire({
            title: 'Editar Agendamentos',
            background: '#1d1d1d',
            color: '#fff',
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
                    <input id="swal-servico" class="swal2-input" value="${agendamento.servico}" style="margin: 0; width: 100%;">
                    
                    <label>Data</label>
                    <input id="swal-data" type="date" class="swal2-input" value="${agendamento.data}" style="margin: 0; width: 100%;">
                    
                    <label>Horário</label>
                    <input id="swal-horario" type="text" class="swal2-input" value="${agendamento.horario}" style="margin: 0; width: 100%;">

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
            preConfirm: () => {
                return {
                    nome: document.getElementById('swal-nome').value,
                    servico: document.getElementById('swal-servico').value,
                    data: document.getElementById('swal-data').value,
                    horario: document.getElementById('swal-horario').value,
                    status: document.getElementById('swal-status').value
                }
            }
        });

        // Se o usuário clicar em "Salvar", atualizamos a lista oficial
        if (formValues) {
            setAgendamentos(agendamentos.map(item => 
                // Se o ID for o mesmo que estamos editando, mescla os dados antigos com os novos (...formValues)
                item.id === agendamento.id ? { ...item, ...formValues } : item
            ));
            
            Swal.fire({
                icon: 'success', 
                title: 'Atualizado!',
                text: 'O agendamento foi modificado com sucesso.',
                timer: 2000,
                showConfirmButton: false,
                background: '#1d1d1d',
                color: '#fff'
            });
        }
    };

    // Função para excluir um agendamento
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
        }).then((result) => {
            // Se o usuário confirmou a exclusão
            if (result.isConfirmed) {
                // Filtra a lista: mantém todos os itens, EXCETO o que tem o ID clicado
                const novaLista = agendamentos.filter(item => item.id !== id);
                setAgendamentos(novaLista); // Atualiza a tela com a nova lista

                Swal.fire({
                    title: 'Deletado!',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false,
                    background: '#1d1d1d',
                    color: '#fff'
                });
            }
        });
    };

    // --- RENDERIZAÇÃO (JSX) ---
    return (
        <>
            <div className="container">
                {/* Botão de navegação para voltar à Home */}
                <div className="btn-back-dash">
                        <button><i className="fa-solid fa-right-from-bracket" onClick={logout}></i> Sair</button>
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
                            <button type="button">APLICAR FILTROS</button>
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
                                    <th>Status</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* O .map() percorre o array 'agendamentos' e cria uma <tr> para cada um */}
                                {agendamentos.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.data}</td>
                                        <td>{item.horario}</td>
                                        <td>{item.nome}</td>
                                        <td>
                                            <span className={`status-badge ${item.status.toLowerCase()}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td>
                                            {/* Botão Editar: passa o objeto 'item' inteiro */}
                                            <button className="btn-edit" onClick={() => handleEdit(item)}>
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
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </>
    );
}

export default DashboardAdmin;