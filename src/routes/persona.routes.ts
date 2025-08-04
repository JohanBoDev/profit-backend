import { Router } from 'express';
import { crearPersonaController, obtenerPersonaPorIdController, obtenerPersonasController, eliminarPersonaController, actualizarPersonaController } from '../controllers/persona.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';

const router = Router();

// Crear persona – permitido para admin y gestor
router.post('/', verifyToken, requireRole(['admin', 'gestor']), crearPersonaController);
// Obtener todas las personas – permitido para admin, gestor y consulta
router.get('/', verifyToken, requireRole(['admin', 'gestor', 'consulta']), obtenerPersonasController);
// Obtener persona por ID – permitido para admin, gestor y consulta
router.get('/:id', verifyToken, requireRole(['admin', 'gestor', 'consulta']), obtenerPersonaPorIdController);
// Actualizar persona – permitido para admin y gestor
router.put('/:id', verifyToken, requireRole(['admin', 'gestor']), actualizarPersonaController);
// Eliminar persona – permitido para admin
router.delete('/:id', verifyToken, requireRole(['admin']), eliminarPersonaController);

export default router;