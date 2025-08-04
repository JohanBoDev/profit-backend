import { PrismaClient } from '@prisma/client';
import { CrearPersonaDTO } from '../dtos/persona.dto';

const prisma = new PrismaClient();


export const crearPersona = async (data: CrearPersonaDTO) => {
    // Validación de correo duplicado
    const existente = await prisma.personas.findUnique({
        where: { correo: data.correo }
    });

    if (existente) {
        throw new Error('Ya existe una persona registrada con este correo');
    }

    const persona = await prisma.personas.create({ data });
    return persona;
};
export const obtenerPersonas = async () => {
    const personas = await prisma.personas.findMany();
    return personas;
};

export const obtenerPersonaPorId = async (id: number) => {
    const persona = await prisma.personas.findUnique({
        where: { id },
        include: {
            proyectos: {
                include: {
                    proyecto: true  // Esto trae los datos del proyecto al que está asignada
                }
            }
        }
    });
    return persona;
};

export const actualizarPersona = async (id: number, data: CrearPersonaDTO) => {
    const personaActualizada = await prisma.personas.update({
        where: { id },
        data,
    });
    return personaActualizada;
};

export const eliminarPersona = async (id: number) => {
    const personaEliminada = await prisma.personas.delete({ where: { id } });
    return personaEliminada;
};

