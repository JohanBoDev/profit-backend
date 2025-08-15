import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || '';

interface JwtPayload {
    id: number;
    rol: 'admin' | 'gestor' | 'consulta';
}

export interface AuthRequest extends Request {
    user?: JwtPayload;
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];

    try {
        if (!SECRET) {
            return res.status(500).json({ error: 'Error interno: clave secreta no configurada' });
        }
        const decoded = jwt.verify(token, SECRET) as unknown as JwtPayload;
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido o expirado' });
    }
};
