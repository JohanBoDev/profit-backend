import { z } from 'zod';

export const proyectoSchema = z.object({
    ceco_anterior: z.string().optional(),
    id_sap: z.string().optional(),

    nombre: z.string().trim().min(1, 'El nombre es requerido'),
    tipo_reconocimiento: z.string().optional(),
    descripcion: z.string().trim().min(10, 'La descripción debe tener al menos 10 caracteres'),

    cliente: z.string().trim().min(2, 'El cliente es requerido'),
    sector: z.string().optional(),
    pais: z.enum(['España', 'Colombia', 'EEUU', 'Francia', 'Panamá', 'Perú'], {
        message: 'País no válido'
    }),
    empresa: z.string().trim().min(2, 'La empresa es requerida'),

    agrupacion_n1: z.string().optional(),
    agrupacion_n2: z.string().optional(),
    bl: z.string().optional(),
    bu: z.string().optional(),
    ol: z.string().optional(),
    account_manager: z.string().optional(),
    preventa: z.string().optional(),
    project_manager: z.string().trim().min(2, 'El project manager es requerido'),

    estado_ejecucion: z.enum(['Finalizado', 'Abierto', 'Aprobado', 'Rechazado', 'Cerrado'], {
        message: 'Estado de ejecución no válido'
    }).optional(),

    estado_sap: z.enum(['Abierto', 'Cerrado', 'Completado', 'En Ejecucion'], {
        message: 'Estado SAP no válido'
    }).optional(),

    fecha_cierre_financiera: z.string().optional(),
    fecha_inicio_contractual: z.string().refine(val => !isNaN(Date.parse(val)), {
        message: 'Fecha de inicio inválida'
    }),
    fecha_fin_contractual: z.string().refine(val => !isNaN(Date.parse(val)), {
        message: 'Fecha de fin inválida'
    }),

    tcv: z.number().min(0, { message: 'El TCV no puede ser negativo' }),
    venta_revenue: z.number().min(0, { message: 'El revenue no puede ser negativo' }),
    venta_cost: z.number().min(0, { message: 'El costo no puede ser negativo' }),
    venta_dm: z.number().min(0, { message: 'El DM no puede ser negativo' })
})
    .refine(data => {
        return new Date(data.fecha_inicio_contractual) <= new Date(data.fecha_fin_contractual);
    }, {
        message: 'La fecha de inicio no puede ser posterior a la de fin',
        path: ['fecha_fin_contractual']
    })
    .refine(data => {
        return data.venta_revenue <= data.tcv;
    }, {
        message: 'El revenue no puede ser mayor que el TCV',
        path: ['venta_revenue']
    });

export type ProyectoDTO = z.infer<typeof proyectoSchema>;
export const actualizarProyectoSchema = proyectoSchema.partial();
export type ProyectoUpdateDTO = z.infer<typeof actualizarProyectoSchema>;
