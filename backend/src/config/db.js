import Sequelize from 'sequelize';
import 'dotenv/config';

const isLocalhost = process.env.DATABASE_URL && (process.env.DATABASE_URL.includes('localhost') || process.env.DATABASE_URL.includes('127.0.0.1'));

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    dialectOptions: {
        ssl: isLocalhost ? false : {
            require: true,
            rejectUnauthorized: false,
        },
    },
    logging: false,
});

export const testeConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexão com o PostgreSQL estabelecida com sucesso!');
    } catch (error) {
        console.error('Não foi possível conectar com o banco de dados: ', error.message); 
    }
};

export default sequelize;