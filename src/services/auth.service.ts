import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { RegistroDTO } from '../dtos/usuario.dto';
import jwt from 'jsonwebtoken';
import { LoginDTO } from '../dtos/usuario.dto';

const prisma = new PrismaClient();

export const registerUser = async (data: RegistroDTO) => {
    const { nombre, correo, password, rol = 'consulta' } = data;

    // Verificar si el correo ya existe
    const usuarioExistente = await prisma.usuarios.findUnique({
        where: { correo: correo },
    });

    if (usuarioExistente) {
        throw new Error('El correo ya está registrado');
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const nuevoUsuario = await prisma.usuarios.create({
        data: {
            nombre,
            correo: correo,
            contrasena: hashedPassword,
            rol,
        },
    });

    return {
        message: 'Usuario registrado correctamente',
        usuario: {
            id: nuevoUsuario.id,
            nombre: nuevoUsuario.nombre,
            correo: nuevoUsuario.correo,
            rol: nuevoUsuario.rol,
        },
    };
};



const SECRET = process.env.JWT_SECRET || 'claveultrasecreta123';

if (!SECRET) {
    throw new Error('JWT_SECRET no está definido en las variables de entorno');
}

export const loginUser = async (data: LoginDTO) => {
    const { correo, password } = data;

    const usuario = await prisma.usuarios.findUnique({
        where: { correo },
    });

    if (!usuario) {
        throw new Error('Credenciales inválidas');
    }

    const passwordValido = await bcrypt.compare(password, usuario.contrasena);
    if (!passwordValido) {
        throw new Error('Credenciales inválidas');
    }

    const token = jwt.sign(
        {
            id: usuario.id,
            rol: usuario.rol,
        },
        SECRET,
        { expiresIn: '1d' }
    );

    return {
        message: 'Login exitoso',
        token,
        usuario: {
            id: usuario.id,
            nombre: usuario.nombre,
            correo: usuario.correo,
            rol: usuario.rol,
        },
    };
};

