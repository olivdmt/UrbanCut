import { useState } from "react";
import { Link } from 'react-router-dom';
import './style.css';

function Agendamentos() {
    //Criamos um objeto de estado para todos os campos
    const [formData, setFormData] = useState({
        nome: '',
        telefone: '',
        servico: '',
        data: '',
        horario: '',
    });

    //Função para atualizar o estado conforme o usuário digita
    const handleChange = (e) => {
        const { id, value, name } = e.target;
        //O id ou  name do input deve ser igual a chave no objeto formData
        setFormData({
            ...formData,
            [id || name]: value
        });
    };

    // Função para lidar com o envio do formulário
    const handleSubmit = (e) => {
        e.preventDefault(); //Impede o recarregamento da página
        console.log("Dados do Agendamento:", formData);
        alert(`Agendamento confirmado para ${formData.nome}!`);
        /* 
            Aqui no futuro faremos a chamada para a API/Banco de dados
        */
    };

    return (

        <div className="container">

            <div className="btn-back">
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
                                onChange={handleChange}
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

                    <button>CONFIRMAR AGENDAMENTO</button>
                </form>
            </section>

        </div>
    )
}

export default Agendamentos;