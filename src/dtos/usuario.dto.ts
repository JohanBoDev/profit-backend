import { z } from 'zod';

export const registroSchema = z.object({
    nombre: z
        .string()
        .trim()
        .min(2, { message: 'El nombre es requerido y debe tener al menos 2 caracteres' }),

    correo: z
        .string()
        .trim()
        .email({ message: 'Correo inválido' }),

    password: z
        .string()
        .trim()
        .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' }),

    rol: z
        .enum(['admin', 'gestor', 'consulta'], { message: 'Rol inválido' })
        .optional()
});
export type RegistroDTO = z.infer<typeof registroSchema>;

export const loginSchema = z.object({
    correo: z
        .string()
        .trim()
        .min(1, { message: 'El correo es obligatorio' })
        .email({ message: 'Correo inválido' }),

    password: z
        .string()
        .trim()
        .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
});
export type LoginDTO = z.infer<typeof loginSchema>;

export const actualizarUsuarioSchema = z.object({
    nombre: z
        .string()
        .trim()
        .min(2, { message: 'El nombre es requerido y debe tener al menos 2 caracteres' })
        .optional(),

    correo: z
        .string()
        .trim()
        .email({ message: 'Correo inválido' })
        .optional(),

    password: z
        .string()
        .trim()
        .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
        .optional(),

    rol: z
        .enum(['admin', 'gestor', 'consulta'], { message: 'Rol no válido' })
        .optional()
});

export type ActualizarUsuarioDTO = z.infer<typeof actualizarUsuarioSchema>;