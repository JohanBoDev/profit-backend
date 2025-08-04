// src/routes/export.routes.ts
import { Router } from 'express';
import { exportarProyectosController } from '../controllers/exportarProyectos.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

router.post('/proyectos', verifyToken, exportarProyectosController);

export default router;
