import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { proyectoSchema, ProyectoDTO, actualizarProyectoSchema, ProyectoUpdateDTO } from '../dtos/Proyecto.dto';
import { renovarProyectoService, obtenerRenovacionesProyectoService } from '../services/proyecto.service';

const prisma = new PrismaClient();

export const listarProyectos = async (req: Request, res: Response) => {
    try {
        const proyectos = await prisma.proyectos.findMany({
            orderBy: { id: 'desc' },
        });

        res.json(proyectos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los proyectos' });
    }
};

export const crearProyecto = async (req: Request, res: Response) => {
    try {
        const data: ProyectoDTO = proyectoSchema.parse(req.body);

        const nuevoProyecto = await prisma.proyectos.create({
            data,
        });

        res.status(201).json({
            message: 'Proyecto creado correctamente',
            proyecto: nuevoProyecto,
        });
    } catch (error) {
        const mensaje =
            error instanceof Error ? error.message : 'Error inesperado al crear proyecto';
        res.status(400).json({ error: mensaje });
    }
};

export const obtenerProyectoPorId = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const proyecto = await prisma.proyectos.findUnique({
            where: { id: Number(id) },
        });

        if (!proyecto) {
            return res.status(404).json({ error: 'Proyecto no encontrado' });
        }

        res.json(proyecto);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el proyecto' });
    }
};

export const actualizarProyecto = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const data: ProyectoUpdateDTO = actualizarProyectoSchema.parse(req.body);

        const proyectoExistente = await prisma.proyectos.findUnique({ where: { id } });
        if (!proyectoExistente) {
            return res.status(404).json({ error: 'Proyecto no encontrado' });
        }

        const proyectoActualizado = await prisma.proyectos.update({
            where: { id },
            data,
        });

        res.json({
            message: 'Proyecto actualizado correctamente',
            proyecto: proyectoActualizado,
        });
    } catch (error) {
        const mensaje =
            error instanceof Error ? error.message : 'Error inesperado al actualizar';
        res.status(400).json({ error: mensaje });
    }
};

export const eliminarProyecto = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        const proyecto = await prisma.proyectos.findUnique({ where: { id } });
        if (!proyecto) {
            return res.status(404).json({ error: 'Proyecto no encontrado' });
        }

        await prisma.proyectos.delete({ where: { id } });

        res.json({ message: 'Proyecto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el proyecto' });
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
        res.status(500).json({ error: 'Error al renovar proyecto' });
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