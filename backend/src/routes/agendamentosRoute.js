import { Router } from 'express';
import {getOrder, createOrder, deleteOrder, updateOrder} from '../controllers/agendamentoController.js';

const router = Router();

router.get('/', getOrder);
router.post('/', createOrder);
router.delete('/:id', deleteOrder);
router.put('/:id', updateOrder);

export default router;