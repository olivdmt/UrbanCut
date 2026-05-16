import {DataTypes} from 'sequelize';
import sequelize from "../config/db";

const Agendamento = sequelize.define('Agendamento', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    telefone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    servico: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    data: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    horario: {
        type: DataTypes.TIME,
        allowNull: false,
    }

});