import { PrismaClient } from '@prisma/client';
import { ActualizarUsuarioDTO } from '../dtos/usuario.dto';

const prisma = new PrismaClient();

export const obtenerUsuarios = async () => {
    return await prisma.usuarios.findMany({
        select: {
            id: true,
            nombre: true,
            correo: true,
            rol: true,
            creado_en: true,
        },
        orderBy: { nombre: 'asc' },
    });
};

export const actualizarUsuario = async (id: number, data: ActualizarUsuarioDTO) => {
    return await prisma.usuarios.update({
        where: { id },
        data,
        select: {
            id: true,
            nombre: true,
            correo: true,
            rol: true,
            creado_en: true,
        },
    });
};

export const eliminarUsuario = async (id: number) => {
    await prisma.usuarios.delete({ where: { id } });
    return { message: 'Usuario eliminado correctamente' };
};
