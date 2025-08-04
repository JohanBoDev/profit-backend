import { Request, Response } from 'express';
import { crearPersona, obtenerPersonaPorId, obtenerPersonas, actualizarPersona, eliminarPersona } from '../services/persona.service';
import { crearPersonaSchema } from '../dtos/persona.dto';

export const crearPersonaController = async (req: Request, res: Response) => {
    try {
        const parsed = crearPersonaSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: parsed.error.format() });
        }

        const persona = await crearPersona(parsed.data);
        return res.status(201).json(persona);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};

export const obtenerPersonasController = async (req: Request, res: Response) => {
    try {
        const personas = await obtenerPersonas();
        return res.status(200).json(personas);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};

export const obtenerPersonaPorIdController = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const persona = await obtenerPersonaPorId(Number(id));
        if (!persona) {
            return res.status(404).json({ error: 'Persona no encontrada' });
        }
        return res.status(200).json(persona);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};

export const actualizarPersonaController = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const parsed = crearPersonaSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: parsed.error.format() });
        }

        const personaActualizada = await actualizarPersona(Number(id), parsed.data);
        return res.status(200).json(personaActualizada);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};

export const eliminarPersonaController = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const personaEliminada = await eliminarPersona(Number(id));
        return res.status(200).json(personaEliminada);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};
