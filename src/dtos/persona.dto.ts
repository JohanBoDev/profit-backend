import { z } from 'zod';

// Esquema para crear una persona
export const crearPersonaSchema = z.object({
    nombre: z.string().trim().min(2, { message: 'El nombre es obligatorio y debe tener al menos 2 caracteres' }),
    correo: z.string().email({ message: 'Correo inválido' }).nullable().optional(),
    document: z.string().trim().nullable().optional(),
    empresa: z.string().trim().optional(),
    telefono: z.string().trim().optional(),
    cargo_id: z.number({ message: 'El ID del cargo es obligatorio' }).nullable().optional(),
});

// Esquema para actualizar (todos los campos son opcionales)
export const actualizarPersonaSchema = crearPersonaSchema.partial();


export type CrearPersonaDTO = z.infer<typeof crearPersonaSchema>;
export type ActualizarPersonaDTO = z.infer<typeof actualizarPersonaSchema>;