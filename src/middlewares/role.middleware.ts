import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';

export const requireRole = (rolesPermitidos: Array<'admin' | 'gestor' | 'consulta'>) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ error: 'No autorizado' });
        }

        if (!rolesPermitidos.includes(req.user.rol)) {
            return res.status(403).json({ error: 'No tienes permiso para acceder a esta ruta' });
        }

        next();
    };
};