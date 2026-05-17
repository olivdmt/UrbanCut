import Admin from '../models/admin.js'; // Garanta a importação correta do modelo
import bcrypt from 'bcryptjs'; // <-- Deve ser idêntico ao usado no script (bcryptjs)
import jwt from 'jsonwebtoken';

export const loginAdmin = async (req, res) => {
    try {
        // 1. O front agora envia 'email' e 'senha' (em português!)
        const { email, senha } = req.body; 

        // 2. Busca o admin no banco pelo e-mail
        const admin = await Admin.findOne({ where: { email } });
        
        // Se o admin não existir, barra aqui
        if (!admin) {
            return res.status(401).json({ message: "Não foi possível authenticar usuário. Credenciais inválidas" });
        }

        // 3. Compara a senha digitada com o hash salvo no banco
        // O primeiro parâmetro é a senha pura (vinda do req.body), o segundo é a criptografada (do banco)
        const senhaValida = await bcrypt.compare(senha, admin.senha);

        if (!senhaValida) {
            return res.status(401).json({ message: "Não foi possível authenticar usuário. Credenciais inválidas" });
        }

        // 4. Se passou, gera o token de acesso
        const token = jwt.sign(
            { id: admin.id, email: admin.email },
            process.env.JWT_SECRET || 'seu_secret_global',
            { expiresIn: '1d' }
        );

        // 5. Retorna a resposta que o seu front espera (com o token e os dados do admin)
        return res.status(200).json({
            token,
            admin: {
                id: admin.id,
                name: admin.nome, // O front lê data.admin.name, então mapeamos 'nome' para 'name' aqui
                email: admin.email
            }
        });

    } catch (error) {
        console.error("Erro no login do admin:", error);
        return res.status(500).json({ message: "Erro interno no servidor" });
    }
};