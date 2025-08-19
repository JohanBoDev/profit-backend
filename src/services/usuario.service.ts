import { ActualizarUsuarioDTO } from '../dtos/usuario.dto';
import bcrypt from 'bcrypt';
import { prisma } from '../db/prisma'




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

    // Verificamos si en los datos que llegan para actualizar viene el campo 'password'
    // y si no está vacío.
    if (data.password && data.password.trim() !== '') {
        // 1. Hasheamos la nueva contraseña para guardarla de forma segura.
        const hashedPassword = await bcrypt.hash(data.password, 10);

        // 2. Preparamos un nuevo objeto para la actualización.
        //    Copiamos todos los otros datos (nombre, correo, rol).
        const { password, ...otrosDatos } = data;

        // 3. Llamamos a Prisma con los datos procesados.
        return await prisma.usuarios.update({
            where: { id },
            data: {
                ...otrosDatos,
                contrasena: hashedPassword, // Usamos el nombre correcto 'contrasena'
            },
            // Tu 'select' original ya era correcto y seguro, lo mantenemos.
            select: {
                id: true,
                nombre: true,
                correo: true,
                rol: true,
                creado_en: true,
            },
        });
    }

    // Si no viene una contraseña en 'data', actualizamos los otros datos normalmente.
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

export const obtenerUsuarioPorId = async (id: number) => {
    return await prisma.usuarios.findUnique({
        where: { id },
        select: {
            id: true,
            nombre: true,
            correo: true,
            rol: true,
        },
    });
};
