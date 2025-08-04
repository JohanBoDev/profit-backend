// src/services/persona.service.ts

import { PrismaClient } from '@prisma/client';
import { CrearPersonaDTO, ActualizarPersonaDTO } from '../dtos/persona.dto';

const prisma = new PrismaClient();

export const crearPersona = async (data: CrearPersonaDTO) => {
    if (data.correo) {
        const existente = await prisma.personas.findUnique({
            where: { correo: data.correo }
        });
        if (existente) {
            throw new Error('Ya existe una persona registrada con este correo');
        }
    }

    const persona = await prisma.personas.create({
        data,
        include: { cargo: true } // Devolvemos la persona creada con la info de su cargo
    });
    return persona;
};

export const obtenerPersonas = async () => {
    const personas = await prisma.personas.findMany({
        // Incluimos la información del cargo en la lista de personas
        include: {
            cargo: {
                select: {
                    name: true
                }
            }
        },
        orderBy: {
            nombre: 'asc'
        }
    });
    return personas;
};

export const obtenerPersonaPorId = async (id: number) => {
    const persona = await prisma.personas.findUnique({
        where: { id },
        // Incluimos tanto el cargo como los proyectos a los que está asignada
        include: {
            cargo: true,
            proyectos: {
                include: {
                    proyecto: true
                }
            }
        }
    });
    return persona;
};

export const actualizarPersona = async (id: number, data: ActualizarPersonaDTO) => {
    const personaActualizada = await prisma.personas.update({
        where: { id },
        data,
        include: { cargo: true } // Devolvemos la persona actualizada con la info de su cargo
    });
    return personaActualizada;
};

export const eliminarPersona = async (id: number) => {
    const personaEliminada = await prisma.personas.delete({ where: { id } });
    return personaEliminada;
};