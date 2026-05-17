import dotenv from 'dotenv';
import app from './app.js';
import sequelize from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('Conected when Database sucessful!!');

        await sequelize.sync({ alter: true});

        app.listen(PORT, () => {
            console.log(`Server running on the port: ${PORT}`);
        });
    } catch (error) {
        console.log('Erro ao inicar aplicação', error)
    }
}

startServer();
