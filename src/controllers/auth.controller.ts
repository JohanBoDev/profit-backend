import { Request, Response } from 'express';
import { registroSchema } from '../dtos/usuario.dto';
import { registerUser } from '../services/auth.service';
import { loginUser } from '../services/auth.service';
import { loginSchema, LoginDTO } from '../dtos/usuario.dto';
import { AuthRequest } from '../middlewares/auth.middleware';
import { prisma } from '../db/prisma'


export const register = async (req: Request, res: Response) => {
    try {
        // Validar datos con Zod
        const datosValidados = registroSchema.parse(req.body);

        // Llamar al servicio
        const resultado = await registerUser(datosValidados);

        res.status(201).json(resultado);
    } catch (error: any) {
        // Si el error viene de Zod
        if (error.name === 'ZodError') {
            return res.status(400).json({ error: 'Datos inválidos', detalles: error.errors });
        }

        res.status(400).json({ error: error.message || 'Error al registrar usuario' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const datos: LoginDTO = loginSchema.parse(req.body);

        const resultado = await loginUser(datos);

        res.status(200).json(resultado);
    } catch (error) {
        const mensaje =
            error instanceof Error ? error.message : 'Error desconocido en login';
        res.status(401).json({ error: mensaje });
    }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'No autorizado' });
        }

        const usuario = await prisma.usuarios.findUnique({
            where: { id: req.user.id },
        });

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        return res.json({
            id: usuario.id,
            nombre: usuario.nombre,
            correo: usuario.correo,
            rol: usuario.rol,
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el perfil' });
    }
};