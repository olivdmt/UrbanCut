/* ===============================
 --- > CONFIGURAÇÕES E IMPORTS < ---
==================================*/
const express = require('express');
const cors = require('cors');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const knex = require('./database');

const app = express();

app.use(cors());
app.use(express.json()); // Para o express entender JSON no corpo das requisições

/* ===============================
 --- > MIDDLEWARES DE PROTEÇÃO < --
==================================*/
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

/* ===============================
 --- > ROTAS DE AGENDAMENTO < ----
==================================*/

// Rota de ping para testar a saúde do banco
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
    res.status(500).json({
      error: error?.message || "Erro ao buscar agendamentos",
      code: error?.code,
      detail: error?.detail,
    });
  }
});

// Rota para adicionar um novo agendamento no banco
app.post('/agendamentos', async (req, res) => {
  const { nome, telefone, servico, data, horario } = req.body;
  try {
    await knex('agendamentos').insert({ nome, telefone, servico, data, horario });
    res.status(201).json('Appointment Created');
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Rota para Atualizar o agendamento
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
      .where({ id })
      .del()
      .returning('*');

    if (deletado.length > 0) {
      return res.json({
        message: "Appointment deleted with success!",
        data: deletado[0],
      });
    }

    return res.status(404).json({ error: "Appointment not found" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting data:" + error.message });
  }
});

/* ===============================
 --- > ROTAS ADMINISTRATIVAS < ---
==================================*/

// Lista os agendamentos na visão do administrador (Protegida)
app.get("/admin/agendamentos", requireAdmin, async (req, res) => {
  try {
    const agendamentos = await knex("agendamentos").select("*");
    res.json(agendamentos);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar agendamentos" });
  }
});

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

/* ===============================
 --- > INICIALIZAÇÃO DO APP < ----
==================================*/
const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
  console.log(`Servidor rodando em ${PORT}`);

  try {
    console.log("Validando a estrutura do banco de dados...");

    // 1. Cria a tabela 'admins' caso ela não exista
    const hasAdminsTable = await knex.schema.hasTable("admins");
    if (!hasAdminsTable) {
      await knex.schema.createTable("admins", (table) => {
        table.increments("id").primary();
        table.string("name", 255).notNullable();
        table.string("email", 255).notNullable().unique();
        table.string("password_hash", 255).notNullable();
      });
      console.log("✅ Tabela 'admins' verificada/criada com sucesso!");
    } else {
      console.log("ℹ️ Tabela 'admins' já existe.");
    }

    // 2. Cria a tabela 'agendamentos' caso ela não exista
    const hasAgendamentosTable = await knex.schema.hasTable("agendamentos");
    if (!hasAgendamentosTable) {
      await knex.schema.createTable("agendamentos", (table) => {
        table.increments("id").primary();
        table.string("nome", 255).notNullable();
        table.string("telefone", 50);
        table.string("servico", 255);
        table.string("data", 50);
        table.string("horario", 50);
        table.string("status", 50).defaultTo("pendente");
      });
      console.log("✅ Tabela 'agendamentos' verificada/criada com sucesso!");
    } else {
      console.log("ℹ️ Tabela 'agendamentos' já existe.");
    }

    // 3. Executa a criação do admin automático após garantir as tabelas
    console.log("Iniciando verificação de administrador...");
    const { main: createAdminMain } = require("./createAdmin");
    await createAdminMain();

  } catch (error) {
    console.error("❌ ERRO CRÍTICO NA INICIALIZAÇÃO DO BANCO:", error.message);
  }
});