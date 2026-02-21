const bcrypt = require("bcrypt");
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: String(process.env.DB_PASSWORD),
  port: Number(process.env.DB_PORT),
});

async function main() {
  const email = process.env.ADMIN_EMAIL;      // qual admin vai trocar a senha
  const newPassword = process.env.ADMIN_PASSWORD; // nova senha

  if (!email || !newPassword) {
    throw new Error("Defina ADMIN_EMAIL e ADMIN_PASSWORD no .env");
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);

  const result = await pool.query(
    `UPDATE admins
     SET password_hash = $1
     WHERE email = $2`,
    [passwordHash, email]
  );

  if (result.rowCount === 0) {
    console.log("❌ Nenhum admin encontrado com esse email.");
  } else {
    console.log("✅ Senha do admin atualizada com sucesso!");
  }

  await pool.end();
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});