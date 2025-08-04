import { Router } from 'express';
import { register, login, getProfile } from '../controllers/auth.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

// Ruta para registrar usuarios (solo accesible para admin en el futuro)
router.post('/register', register);
router.post('/login', login);

// Ruta protegida: requiere token válido
router.get('/profile', verifyToken, getProfile);

export default router;
