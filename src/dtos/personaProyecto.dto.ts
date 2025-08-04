import { z } from 'zod';

export const asignarPersonaSchema = z.object({
    proyecto_id: z.number({ message: 'El ID del proyecto es obligatorio' }),
    persona_id: z.number({ message: 'El ID de la persona es obligatorio' }),
    rol_asignado: z.string().min(2, 'El rol asignado es obligatorio'),
});

export type AsignarPersonaDTO = z.infer<typeof asignarPersonaSchema>;
