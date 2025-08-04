// src/services/proyecto.service.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const renovarProyectoService = async (id: number, datos: any) => {
    const proyectoOriginal = await prisma.proyectos.findUnique({
        where: { id },
        include: { renovaciones: true },
    });

    if (!proyectoOriginal) {
        throw new Error('Proyecto no encontrado');
    }

    if (proyectoOriginal.es_renovacion) {
        throw new Error('No se puede renovar un proyecto que ya es una renovación.');
    }

    const fechaNuevaInicio = new Date(datos.fecha_inicio_contractual);
    const fechaNuevaFin = new Date(datos.fecha_fin_contractual);

    const fechaOriginalInicio = proyectoOriginal.fecha_inicio_contractual;
    const fechaOriginalFin = proyectoOriginal.fecha_fin_contractual;

    const toDateOnlyString = (fecha: Date) => fecha.toISOString().split('T')[0];
    const hoy = new Date();

    // Caso 1: El proyecto original no tiene fechas → validar contra hoy
    if (!fechaOriginalInicio || !fechaOriginalFin) {
        if (fechaNuevaInicio <= hoy || fechaNuevaFin <= hoy) {
            throw new Error('Las fechas de renovación deben ser posteriores al día de hoy.');
        }
    } else {
        // Caso 2: Validar igualdad exacta de fechas
        const fechasIguales =
            toDateOnlyString(fechaOriginalInicio) === toDateOnlyString(fechaNuevaInicio) &&
            toDateOnlyString(fechaOriginalFin) === toDateOnlyString(fechaNuevaFin);

        if (fechasIguales) {
            throw new Error('Las fechas de renovación no pueden ser iguales a las del proyecto original.');
        }

        // Caso 3: Validar fechas anteriores
        const fechaInicioAnterior = fechaNuevaInicio.getTime() < fechaOriginalInicio.getTime();
        const fechaFinAnterior = fechaNuevaFin.getTime() < fechaOriginalFin.getTime();

        if (fechaInicioAnterior || fechaFinAnterior) {
            throw new Error('No se puede renovar con fechas anteriores a las del proyecto original.');
        }
    }

    // ✅ Validar que no se repitan fechas de versiones anteriores
    for (const version of proyectoOriginal.renovaciones) {
        if (!version.fecha_inicio_contractual || !version.fecha_fin_contractual) continue;

        const fechaInicioRenovada = new Date(version.fecha_inicio_contractual);
        const fechaFinRenovada = new Date(version.fecha_fin_contractual);

        const mismasFechas =
            toDateOnlyString(fechaNuevaInicio) === toDateOnlyString(fechaInicioRenovada) &&
            toDateOnlyString(fechaNuevaFin) === toDateOnlyString(fechaFinRenovada);

        const traslape =
            fechaNuevaInicio.getTime() <= fechaFinRenovada.getTime();

        if (mismasFechas || traslape) {
            throw new Error('Las fechas de renovación coinciden o se traslapan con una versión anterior.');
        }
    }

    // Convertimos fechas a objeto Date
    const nuevaFechaInicio = new Date(datos.fecha_inicio_contractual);
    const nuevaFechaFin = new Date(datos.fecha_fin_contractual);

    // Buscar renovaciones que se crucen con las nuevas fechas
    const conflictos = await prisma.proyectos.findMany({
        where: {
            proyecto_origen_id: id, // ID del proyecto original
            OR: [
                {
                    fecha_inicio_contractual: { lte: nuevaFechaFin },
                    fecha_fin_contractual: { gte: nuevaFechaInicio }
                }
            ]
        }
    });

    if (conflictos.length > 0) {
        throw new Error('Las fechas de renovación se superponen con una versión anterior');
    }

    const renovaciones = await prisma.proyectos.count({
        where: { proyecto_origen_id: id }
    });

    if (renovaciones >= 5) {
        throw new Error('Ya se alcanzó el número máximo de renovaciones permitidas');
    }

    // Calcular número de versión
    const nuevaVersion = (proyectoOriginal.renovaciones?.length || 0) + 1;

    const nuevoProyecto = await prisma.proyectos.create({
        data: {
            ...(() => {
                const { renovaciones, ...rest } = proyectoOriginal;
                return rest;
            })(),
            id: undefined,
            es_renovacion: true,
            proyecto_origen_id: proyectoOriginal.id,
            version: nuevaVersion,
            notas_de_renovacion: datos.notas_de_renovacion || null,
            fecha_inicio_contractual: fechaNuevaInicio,
            fecha_fin_contractual: fechaNuevaFin,
            tcv: datos.tcv,
            venta_revenue: datos.venta_revenue,
            venta_cost: datos.venta_cost,
            venta_dm: datos.venta_dm,
            estado_ejecucion: datos.estado_ejecucion,
            estado_sap: datos.estado_sap,
        },
    });

    console.log(`✅ Proyecto ${id} renovado → versión #${nuevaVersion} (ID ${nuevoProyecto.id})`);
    return nuevoProyecto;
};




export const obtenerRenovacionesProyectoService = async (id: number) => {
    return prisma.proyectos.findMany({
        where: { proyecto_origen_id: id },
        orderBy: { fecha_inicio_contractual: 'asc' },
    });
};
