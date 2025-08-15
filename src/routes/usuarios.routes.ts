import { Router } from 'express';
import {
    obtenerUsuariosController,
    actualizarUsuarioController,
    eliminarUsuarioController,
    obtenerUsuarioPorIdController
} from '../controllers/usuario.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';

const router = Router();

router.get('/', verifyToken, requireRole(['admin']), obtenerUsuariosController);
router.put('/:id', verifyToken, requireRole(['admin']), actualizarUsuarioController);
router.delete('/:id', verifyToken, requireRole(['admin']), eliminarUsuarioController);
router.get('/:id', verifyToken, requireRole(['admin']), obtenerUsuarioPorIdController);

export default router;
