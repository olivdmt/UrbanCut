import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Admin = sequelize.define('Admin', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false,
    }
},
{
    tableName: 'admins',
    timestamps: true,
});

export default Admin;