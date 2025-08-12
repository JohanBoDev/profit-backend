// src/controllers/persona.controller.ts

import { Request, Response } from 'express';
import {
    crearPersona,
    obtenerPersonaPorId,
    obtenerPersonas,
    actualizarPersona,
    eliminarPersona,
    obtenerPersonasPorCargo,
    obtenerCargos
} from '../services/persona.service';
import { crearPersonaSchema, actualizarPersonaSchema } from '../dtos/persona.dto';

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

export const obtenerPersonasController = async (_req: Request, res: Response) => {
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
        // Usamos el esquema de actualización que permite campos parciales
        const parsed = actualizarPersonaSchema.safeParse(req.body);
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

export const obtenerPersonasPorCargoController = async (req: Request, res: Response) => {
    try {
        // 1. Obtenemos el ID de los parámetros de la URL
        const { cargoId } = req.params;

        // 2. Convertimos el ID a un número y validamos
        const idNumerico = parseInt(cargoId, 10);
        if (isNaN(idNumerico)) {
            return res.status(400).json({ error: 'El ID del cargo debe ser un número válido.' });
        }

        // 3. Llamamos a la función del servicio con el ID validado
        const personas = await obtenerPersonasPorCargo(idNumerico);

        return res.status(200).json(personas);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};

export const obtenerCargosController = async (_req: Request, res: Response) => {
    try {
        const cargos = await obtenerCargos();
        return res.status(200).json(cargos);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};
