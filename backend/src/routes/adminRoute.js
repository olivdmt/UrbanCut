import { Router } from 'express';
import authAdmin from '../middlewares/authAdmin.js';
import { loginAdmin } from '../controllers/adminController.js';

const router = Router();

router.get("/perfil", authAdmin, (req, res) => {
    return res.status(200).json({
        sucess: true,
        message: "Acesso autorizado!",
        admin: req.admin
    });
});

router.post('/login', loginAdmin);


export default router;