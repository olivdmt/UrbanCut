
/* ===============================
 --- > ROTAS DE AGENDAMENTO < ----
==================================*/

const express = require('express');
const cors = require('cors');
const knex = require('./database');

const app = express();

app.use(cors());
app.use(express.json()); // Para o express entender JSON no corpo das requisições

// Rota para LISTAR todos os agendamentos do bancco
app.get('/agendamentos', async (req, res) => {
    try {
        const agendamentos = await knex('agendamentos').select('*');
        res.json(agendamentos);
    } catch (error) {
        res.status(500).json("Error: Don't possible query data");
    }
});

//Rota para adicionar um novo agendamento no banco
app.post('/agendamentos', async (req, res) => {

    const { nome, telefone, servico, data, horario } = req.body;
    try{
        await knex('agendamentos').insert({ nome, telefone, servico, data, horario });
        res.status(201).json('Appointment Created');
    } catch (error) {
        res.status(400).json({error: error.message})
    }
});

//Rota para Atualizar o agendamento
app.put('/agendamentos/:id', async (req, res) =>{
    const { id } = req.params;
    const { nome, telefone, servico, data, horario } = req.body;
    try {
        const atualizado = await knex('agendamentos')
            .where({id})
            .update({
                nome,
                telefone,
                servico,
                data,
                horario
            })
            .returning("*");

            if (atualizado) {
                res.json({ 
                    message: "Appointment updating with sucefull!",
                    data: atualizado
                });
            } else {
                res.status(404).json({ error: "Appointment not found"});
            }
    }catch ( error) {
        res.status(500).json({ error: "Erro updating data:" + error.message});
    }
});

app.delete('/agendamentos/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, telefone, servico, data, horario } = req.body;
    try {
        const deletado = await knex('agendamentos')
            .where({id})
            .delete({
                nome,
                telefone,
                servico,
                data,
                horario
            })
            .returning('*');

            if (deletado) {
                res.json({
                    message: "Appointment deleted with sucefull!",
                    data: deletado
                });
            } else {
                res.status(404).json({ error: "Appointment not found"});
            }
    } catch (error) {
        res.status(500).json({ error: "Error deleted data:" + error.message})
    }
});



/* =======================================
 --- > ROTAS DE CADASTRO DE USUÁRIO < ----
==========================================*/

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});