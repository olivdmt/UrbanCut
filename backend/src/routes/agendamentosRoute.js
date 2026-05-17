import { Router } from 'express';
import {getOrder, createOrder, deleteOrder, updateOrder} from '../controllers/agendamentoController.js';

const router = Router();

router.get('/', getOrder);
router.post('/', createOrder);
router.delete('/', deleteOrder);
router.put('/', updateOrder);

export default router;