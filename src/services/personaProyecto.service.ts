import { PrismaClient } from '@prisma/client';
import { AsignarPersonaDTO } from '../dtos/personaProyecto.dto';

const prisma = new PrismaClient();

export const asignarPersonaAProyecto = async (data: AsignarPersonaDTO) => {
    const { persona_id, proyecto_id, rol_asignado } = data;

    // Validar existencia de persona
    const personaExiste = await prisma.personas.findUnique({
        where: { id: persona_id }
    });
    if (!personaExiste) {
        throw new Error('La persona no existe');
    }

    // Validar existencia de proyecto
    const proyectoExiste = await prisma.proyectos.findUnique({
        where: { id: proyecto_id }
    });
    if (!proyectoExiste) {
        throw new Error('El proyecto no existe');
    }

    // Validar duplicado (índice compuesto)
    const existe = await prisma.persona_proyecto.findUnique({
        where: {
            persona_id_proyecto_id: {
                persona_id,
                proyecto_id,
            },
        },
    });

    if (existe) {
        throw new Error('La persona ya está asignada a este proyecto');
    }

    // Crear asignación
    const asignacion = await prisma.persona_proyecto.create({
        data: {
            persona_id,
            proyecto_id,
            rol: rol_asignado,
        },
        include: {
            persona: true,
            proyecto: true,
        },
    });

    return asignacion;
};


export const eliminarAsignacion = async (id: number) => {
    // Verifica si existe la asignación
    const asignacion = await prisma.persona_proyecto.findUnique({
        where: { id },
    });

    if (!asignacion) {
        throw new Error('Asignación no encontrada');
    }

    // Elimina la asignación
    await prisma.persona_proyecto.delete({
        where: { id },
    });

    return { message: 'Asignación eliminada correctamente' };
};

export const obtenerAsignacionesPorProyecto = async (proyecto_id: number) => {
    const asignaciones = await prisma.persona_proyecto.findMany({
        where: { proyecto_id },
        include: {
            persona: true,   // incluye nombre, correo, cargo, etc.
        },
    });

    return asignaciones;
};