import { Router } from 'express';
import {
    listarProyectos,
    crearProyecto,
    obtenerProyectoPorId,
    actualizarProyecto,
    eliminarProyecto,
    renovarProyecto,
    obtenerRenovacionesDeProyecto
} from '../controllers/proyectos.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';

const router = Router();

// Listar proyectos (todos los roles)
router.get('/', verifyToken, requireRole(['admin', 'gestor', 'consulta']), listarProyectos);

// Crear nuevo proyecto (solo admin y gestor)
router.post('/', verifyToken, requireRole(['admin', 'gestor']), crearProyecto);

// Obtener proyecto por ID (todos los roles)
router.get('/:id', verifyToken, requireRole(['admin', 'gestor', 'consulta']), obtenerProyectoPorId);

// Actualizar proyecto (solo admin y gestor)
router.put('/:id', verifyToken, requireRole(['admin', 'gestor']), actualizarProyecto);

// Eliminar proyecto (solo admin)
router.delete('/:id', verifyToken, requireRole(['admin']), eliminarProyecto);

// Renovar proyecto (solo admin y gestor)
router.post('/:id/renovar', verifyToken, requireRole(['admin', 'gestor']), renovarProyecto);

// Obtener renovaciones de un proyecto (todos los roles)
router.get('/:id/renovaciones', verifyToken, requireRole(['admin', 'gestor', 'consulta']), obtenerRenovacionesDeProyecto);

export default router;
