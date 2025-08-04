import { Router } from 'express';
import { asignarPersona, eliminarPersonaProyecto, obtenerPersonasDeProyecto } from '../controllers/personaProyecto.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';

const router = Router();

// Solo admin y gestor pueden asignar personas
router.post('/', verifyToken, requireRole(['admin', 'gestor']), asignarPersona);

// Solo admin y gestor pueden eliminar asignaciones
router.delete('/:id', verifyToken, requireRole(['admin', 'gestor']), eliminarPersonaProyecto);

// Cualquier usuario puede ver las personas asignadas a un proyecto
router.get('/proyecto/:id', verifyToken, obtenerPersonasDeProyecto);

export default router;
