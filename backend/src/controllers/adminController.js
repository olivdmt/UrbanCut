import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export async function loginAdmin(req, res) {
    try { 
        const {email, senha} = req.body;

        if (!email || !senha) {
            return res.status(400).json({
                success: false,
                message: "Email e senha são obrigatórios"
            });
        }

        const admin = await Admin.findOne({ where: { email }, });

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Email ou senha inválidos!"
            });
        }

        const senhaCorreta = await bcrypt.compare(senha, admin.senha);

        if (!senhaCorreta) {
            return res.status(400).json({
                success: false,
                message: "Email ou senha inválidos!"
            });
        }

        const token = jwt.sign(
            {
            id: admin.id,   
            email: admin.email,
            tipo: "admin",
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" },
        );

        return res.status(200).json({
            success: true,
            message: "Login realizado com sucesso",
            token,
            admin: {
                id: admin.id,
                email: admin.email,
            },
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: "Erro ao fazer login",
            error: error.message,
        });
    }
};