import { Request, Response } from 'express';
import { proyectoSchema, ProyectoDTO, actualizarProyectoSchema, ProyectoUpdateDTO } from '../dtos/Proyecto.dto';
import {
    listarProyectosService,
    crearProyectoService,
    obtenerProyectoPorIdService,
    actualizarProyectoService,
    eliminarProyectoService,
    renovarProyectoService,
    obtenerRenovacionesProyectoService
} from '../services/proyecto.service';


export const listarProyectos = async (req: Request, res: Response) => {
    try {
        const proyectos = await listarProyectosService();
        res.json(proyectos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los proyectos' });
    }
};

export const crearProyecto = async (req: Request, res: Response) => {
    try {
        const data: ProyectoDTO = proyectoSchema.parse(req.body);
        const nuevoProyecto = await crearProyectoService(data);
        res.status(201).json({
            message: 'Proyecto creado correctamente',
            proyecto: nuevoProyecto,
        });
    } catch (error) {
        const mensaje = error instanceof Error ? error.message : 'Error inesperado al crear proyecto';
        res.status(400).json({ error: mensaje });
    }
};

export const obtenerProyectoPorId = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const proyecto = await obtenerProyectoPorIdService(id);
        res.json(proyecto);
    } catch (error) {
        const mensaje = error instanceof Error ? error.message : 'Error al obtener el proyecto';
        // Si el servicio lanza 'Proyecto no encontrado', el código será 404
        res.status(404).json({ error: mensaje });
    }
};

export const actualizarProyecto = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const data: ProyectoUpdateDTO = actualizarProyectoSchema.parse(req.body);
        const proyectoActualizado = await actualizarProyectoService(id, data);
        res.json({
            message: 'Proyecto actualizado correctamente',
            proyecto: proyectoActualizado,
        });
    } catch (error) {
        const mensaje = error instanceof Error ? error.message : 'Error inesperado al actualizar';
        res.status(400).json({ error: mensaje });
    }
};

export const eliminarProyecto = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const result = await eliminarProyectoService(id);
        res.json(result);
    } catch (error) {
        const mensaje = error instanceof Error ? error.message : 'Error al eliminar el proyecto';
        res.status(400).json({ error: mensaje });
    }
};

export const renovarProyecto = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const datos = req.body;

        const nuevoProyecto = await renovarProyectoService(id, datos);

        res.status(201).json({
            mensaje: 'Proyecto renovado exitosamente',
            nuevoProyecto,
        });
    } catch (error) {
        console.error('Error al renovar proyecto:', error);
        const mensaje = error instanceof Error ? error.message : 'Error inesperado al renovar el proyecto';
        res.status(400).json({ error: mensaje });
    }
};

export const obtenerRenovacionesDeProyecto = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const renovaciones = await obtenerRenovacionesProyectoService(id);

        res.status(200).json(renovaciones);
    } catch (error) {
        console.error('Error al obtener renovaciones:', error);
        res.status(500).json({ error: 'Error al obtener renovaciones del proyecto' });
    }
};