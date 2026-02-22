require('dotenv').config();

const knex = require('knex')({
    client: 'pg',
    connection:
        process.env.DATABASE_URL, //Render fornece essa env
        ssl: { 
            refectUnauthorized: false // Importante no Render
        },
});

module.exports = knex;