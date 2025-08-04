import { Request, Response } from 'express';
import {
    obtenerUsuarios,
    actualizarUsuario,
    eliminarUsuario,
} from '../services/usuario.service';
import { actualizarUsuarioSchema } from '../dtos/usuario.dto';

export const obtenerUsuariosController = async (_req: Request, res: Response) => {
    try {
        const usuarios = await obtenerUsuarios();
        res.status(200).json(usuarios);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const actualizarUsuarioController = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const parsed = actualizarUsuarioSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({ error: parsed.error.format() });
        }

        const actualizado = await actualizarUsuario(id, parsed.data);
        res.status(200).json(actualizado);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const eliminarUsuarioController = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const result = await eliminarUsuario(id);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
