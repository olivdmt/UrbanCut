const bcrypt = require("bcrypt");
const db = require("./database"); // Importa a mesma conexão do Knex

async function main() {
  const name = process.env.ADMIN_NAME;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!name || !email || !password) {
    throw new Error("Defina ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD nas variáveis de ambiente");
  }

  // Verifica se o admin já existe usando o Knex
  const existingAdmin = await db("admins").where({ email }).first();

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(password, 12);
    
    // Insere o admin usando o Knex
    await db("admins").insert({
      name,
      email,
      password_hash: passwordHash
    });
    console.log("🚀 Admin criado com sucesso via Knex!");
  } else {
    console.log(" Admin já existente no banco de dados.");
  }
}

module.exports = { main };

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}