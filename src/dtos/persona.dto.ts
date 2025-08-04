import { z } from 'zod';

export const crearPersonaSchema = z.object({
    nombre: z.string().trim().min(2, { message: 'El nombre es obligatorio y debe tener al menos 2 caracteres' }),
    correo: z.string().email({ message: 'Correo inválido' }),
    cargo: z.string().min(2, { message: 'El cargo es requerido' }),
    empresa: z.string().optional(),
    telefono: z.string().optional(),
});

export type CrearPersonaDTO = z.infer<typeof crearPersonaSchema>;