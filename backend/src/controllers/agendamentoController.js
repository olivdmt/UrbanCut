import agendamentos from "../models/agendamentos.js";

export const getOrder = async (req, res) => {
    try {
        const orders = await agendamentos.findAll();
        res.status(200).json({
            success: true,
            message: 'Pedidos localizados com sucesso!',
            data: orders,
        });
    } catch (error) {
        res.status(400).json({
            success: false
        });
    }
};

export const createOrder = async (req, res) => {
    try {
        const {nome, telefone, servico, data, horario} = req.body;

        if (!nome, !telefone, !servico, !data, !horario) return res.status(400).json({
            success: false,
            message: 'Dados do agendamento inválidos'
        });


        const newOrder = await agendamentos.create({
            nome: nome,
            telefone: telefone,
            servico: servico,
            data: data,
            horario: horario,
            status: 'Pendente',
        });

        res.status(201).json({
            success: true,
            message: 'Agendamento criado com sucesso',
            data: newOrder,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Não foi possível criar um novo agendamento",
            error: error.message,
        });
    }
};


export const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const orderDeleted = agendamentos.destroy({ where: { id }, });

        if (!orderDeleted) return res.status(404).json({
            success: false,
            message: 'Este pedido não existe ou já foi deletado!',
        });

        res.status(200).json({
            success: true,
            message: 'Pedido deletado com sucesso!',
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: 'Não foi possível deletar este produto',
            error: error.message,
        });
    }
};

export const updateOrder = async (req, res) => {
    try {
        const {id} = req.params;
        const {nome, telefone, servico, data, horario} = req.body;
        
        const editOrder =  agendamentos.update({
            nome: nome, 
            telefone: telefone, 
            servico: servico,
            data: data, 
            horario: horario,
        }, {where : { id }, });

        res.status(200).json({
            success: true,
            message: 'Pedido editado com sucesso!',
            data: editOrder,
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: 'Não foi possível editar este pedido...',
        });
    }
};
