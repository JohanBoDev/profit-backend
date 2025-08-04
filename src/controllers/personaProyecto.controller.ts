import { Request, Response } from 'express';
import { asignarPersonaAProyecto, eliminarAsignacion, obtenerAsignacionesPorProyecto } from '../services/personaProyecto.service';
import { asignarPersonaSchema } from '../dtos/personaProyecto.dto';

export const asignarPersona = async (req: Request, res: Response) => {
    try {
        const parsed = asignarPersonaSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: parsed.error.format() });
        }

        const asignacion = await asignarPersonaAProyecto(parsed.data);
        return res.status(201).json(asignacion);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};


export const eliminarPersonaProyecto = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const resultado = await eliminarAsignacion(id);
        return res.status(200).json(resultado);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};

export const obtenerPersonasDeProyecto = async (req: Request, res: Response) => {
    try {
        const proyecto_id = Number(req.params.id);
        if (isNaN(proyecto_id)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const asignaciones = await obtenerAsignacionesPorProyecto(proyecto_id);
        return res.status(200).json(asignaciones);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};