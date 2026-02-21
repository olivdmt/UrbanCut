/* ===============================
 --- > ROTAS DE AGENDAMENTO < ----
==================================*/

const express = require('express');
const cors = require('cors');
const knex = require('./database');

const app = express();

app.use(cors());
app.use(express.json()); // Para o express entender JSON no corpo das requisições

// Rota para LISTAR todos os agendamentos do banco
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

// Rota para deletar os agendamentos 
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

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Middleware: exige token de admin
function requireAdmin(req, res, next) {
    const auth = req.headers.authorization; // "Bearer <token>"
    const token = auth && auth.startWith("bearer ") ? auth.slice(7) : null;

    if (!token) return res.status(401).json({ error: "Token ausente"});

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        if (payload.role !== "admin") {
            return res.status(403).json({ error: "Acesso negado" });
        }
        req.adminId= payload.sub;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Token inválido ou expirado" });
    }
}

// Rota: LOGIN ADMIN
app.post("/admin/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await knex("admins")
        .select("id", "name", "email", "password_hash")
        .where({ email })
        .first();

        if (!admin) return res.status(401).json({ error: "Credenciais inválidas" });

        const ol = await bcrypt.compare(password, admin.password_hash);
        if (!ok) return res.status(401).json({ error: "Credenciais inválidas" });

        const token = jwt.sign(
            { sub: admin.id, role: "admin" },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );
        
        return res.json({
            token,
            admin: { id: admin.id, name: admin.name, email: admin.email },
        });
    } catch (error) {
        return res.status(500).json({ error: "Erro no login: " + error.message });
    }
});


/* =======================================
 --- > ROTAS DE CADASTRO DE USUÁRIO < ----
==========================================*/

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});