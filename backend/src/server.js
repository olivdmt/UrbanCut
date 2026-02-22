/* ===============================
 --- > ROTAS DE AGENDAMENTO < ----
==================================*/

const express = require('express');
const cors = require('cors');
const knex = require('./database');

const app = express();

app.use(cors());
app.use(express.json()); // Para o express entender JSON no corpo das requisições

//Rota de ping
app.get("/db-test", async (req, res) => {
  try {
    const result = await knex.raw("select 1 as ok");
    res.json({ ok: true, result: result.rows ? result.rows : result });
  } catch (err) {
    console.error("DB TEST ERROR:", err);
    res.status(500).json({ ok: false, error: err.message, code: err.code });
  }
});

// Rota para LISTAR todos os agendamentos do banco
app.get("/agendamentos", async (req, res) => {
  try {
    const agendamentos = await knex("agendamentos").select("*");
    res.json(agendamentos);
  } catch (error) {
    console.error("❌ ERRO /agendamentos:", error);
    console.error("❌ ERRO message:", error?.message);
    console.error("❌ ERRO code:", error?.code);
    console.error("❌ ERRO detail:", error?.detail);

    res.status(500).json({
      error: error?.message || "Erro ao buscar agendamentos",
      code: error?.code,
      detail: error?.detail,
    });
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
app.put("/agendamentos/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, telefone, servico, data, horario, status } = req.body;

  try {
    const atualizado = await knex("agendamentos")
      .where({ id })
      .update({ nome, telefone, servico, data, horario, status })
      .returning("*");

    if (atualizado.length > 0) {
      return res.json({
        message: "Appointment updated successfully!",
        data: atualizado[0],
      });
    }

    return res.status(404).json({ error: "Appointment not found" });
  } catch (error) {
    return res.status(500).json({ error: "Erro updating data:" + error.message });
  }
});

// Rota para deletar os agendamentos 
app.delete('/agendamentos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletado = await knex('agendamentos')
            .where({id})
            .del()
            .returning('*');

            if (deletado.length > 0) {
                return res.json({
                    message: "Appointment deleted with sucefull!",
                    data: deletado[0],
                });
            }

            return res.status(404).json({ error: "Appointment not found" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting data:" + error.message})
    }
});

// Define uma rota do tipo GET no endereço "/admin/agendamentos"
// 'requireAdmin' é um middleware de proteção que verifica se o usuário é administrador antes de prosseguir
app.get("/admin/agendamentos", requireAdmin, async (req, res) => {
    try {
        // 'knex("agendamentos")' acessa a tabela chamada "agendamentos" no banco de dados
        // '.select("*")' seleciona todas as colunas de todos os registros
        // 'await' espera a consulta ao banco ser finalizada para continuar
        const agendamentos = await knex("agendamentos").select("*");

        // Se a busca der certo, envia os agendamentos de volta para o cliente no formato JSON
        res.json(agendamentos);

    } catch (error) {
        // Caso ocorra qualquer falha (perda de conexão com o banco, erro de sintaxe, etc.)
        // Retorna o status HTTP 500 (Erro Interno do Servidor) e uma mensagem explicativa
        res.status(500).json({ error: "Erro ao buscar agendamentos" });
    }
});

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Middleware: exige token de admin
function requireAdmin(req, res, next) {
  const auth = req.headers.authorization; // "Bearer <token>"
  const token = auth && auth.startsWith("Bearer ") ? auth.slice(7) : null;

  if (!token) return res.status(401).json({ error: "Token ausente" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.role !== "admin") {
      return res.status(403).json({ error: "Acesso negado" });
    }
    req.adminId = payload.sub;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
}

// LOGIN ADMIN
app.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await knex("admins")
      .select("id", "name", "email", "password_hash")
      .where({ email })
      .first();

    if (!admin) return res.status(401).json({ error: "Credenciais inválidas" });

    const ok = await bcrypt.compare(password, admin.password_hash);
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando em ${PORT}`);
});