// src/services/proyecto.service.ts
import { ProyectoDTO, ProyectoUpdateDTO } from '../dtos/Proyecto.dto';
import { prisma } from '../db/prisma'





// --- NUEVA FUNCIÓN DE SERVICIO ---
export const listarProyectosService = async () => {
    const idsDeProyectosAntiguos = await prisma.proyectos.findMany({
        where: { proyecto_origen_id: { not: null } },
        select: { proyecto_origen_id: true },
    });

    const idsParaExcluir = [
        ...new Set(
            idsDeProyectosAntiguos.map(p => p.proyecto_origen_id).filter((id): id is number => id !== null)
        ),
    ];

    return await prisma.proyectos.findMany({
        where: {
            id: { notIn: idsParaExcluir },
            estado_ejecucion: { not: 'Reemplazado' }
        },
        orderBy: { id: 'desc' },
    });
};

// --- NUEVA FUNCIÓN DE SERVICIO (CON CÁLCULO DE MARGEN) ---
export const crearProyectoService = async (data: ProyectoDTO) => {
    const revenue = Number(data.venta_revenue) || 0;
    const cost = Number(data.venta_cost) || 0;
    const margin = revenue - cost;
    const marginPercentage = revenue > 0 ? parseFloat(((margin / revenue) * 100).toFixed(2)) : 0;

    const datosParaGuardar = {
        ...data,
        venta_dm: margin,
        venta_dm_porcentaje: marginPercentage,
    };

    return await prisma.proyectos.create({ data: datosParaGuardar });
};

// --- NUEVA FUNCIÓN DE SERVICIO ---
export const obtenerProyectoPorIdService = async (id: number) => {
    const proyecto = await prisma.proyectos.findUnique({ where: { id: id } });
    if (!proyecto) {
        throw new Error('Proyecto no encontrado');
    }
    return proyecto;
};

// --- NUEVA FUNCIÓN DE SERVICIO (CON CÁLCULO DE MARGEN) ---
export const actualizarProyectoService = async (id: number, data: ProyectoUpdateDTO) => {
    const revenue = Number(data.venta_revenue) || 0;
    const cost = Number(data.venta_cost) || 0;
    const margin = revenue - cost;
    const marginPercentage = revenue > 0 ? parseFloat(((margin / revenue) * 100).toFixed(2)) : 0;

    const datosParaGuardar = {
        ...data,
        venta_dm: margin,
        venta_dm_porcentaje: marginPercentage,
    };

    return await prisma.proyectos.update({ where: { id }, data: datosParaGuardar });
};

// --- NUEVA FUNCIÓN DE SERVICIO ---
export const eliminarProyectoService = async (id: number) => {
    // Primero verificamos si existe para lanzar un error claro si no.
    const proyectoExistente = await prisma.proyectos.findUnique({ where: { id } });
    if (!proyectoExistente) {
        throw new Error('Proyecto no encontrado');
    }
    await prisma.proyectos.delete({ where: { id } });
    return { message: 'Proyecto eliminado correctamente' };
};


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
    const fechaNuevaCierre = datos.fecha_cierre_financiera ? new Date(datos.fecha_cierre_financiera) : null;

    const fechaOriginalInicio = proyectoOriginal.fecha_inicio_contractual;
    const fechaOriginalFin = proyectoOriginal.fecha_fin_contractual;
    const toDateOnlyString = (fecha: Date) => fecha.toISOString().split('T')[0];
    const hoy = new Date();

    if (fechaNuevaCierre && fechaNuevaCierre < fechaNuevaFin) {
        throw new Error('La fecha de cierre financiero no puede ser anterior a la nueva fecha de fin de contrato.');
    }
    if (!fechaOriginalInicio || !fechaOriginalFin) {
        if (fechaNuevaInicio <= hoy || fechaNuevaFin <= hoy) {
            throw new Error('Las fechas de renovación deben ser posteriores al día de hoy.');
        }
    } else {
        const fechasIguales =
            toDateOnlyString(fechaOriginalInicio) === toDateOnlyString(fechaNuevaInicio) &&
            toDateOnlyString(fechaOriginalFin) === toDateOnlyString(fechaNuevaFin);
        if (fechasIguales) {
            throw new Error('Las fechas de renovación no pueden ser iguales a las del proyecto original.');
        }
        const fechaInicioAnterior = fechaNuevaInicio.getTime() < fechaOriginalInicio.getTime();
        const fechaFinAnterior = fechaNuevaFin.getTime() < fechaOriginalFin.getTime();
        if (fechaInicioAnterior || fechaFinAnterior) {
            throw new Error('No se puede renovar con fechas anteriores a las del proyecto original.');
        }
    }

    for (const version of proyectoOriginal.renovaciones) {
        if (!version.fecha_inicio_contractual || !version.fecha_fin_contractual) continue;
        const fechaInicioRenovada = new Date(version.fecha_inicio_contractual);
        const fechaFinRenovada = new Date(version.fecha_fin_contractual);
        const mismasFechas =
            toDateOnlyString(fechaNuevaInicio) === toDateOnlyString(fechaInicioRenovada) &&
            toDateOnlyString(fechaNuevaFin) === toDateOnlyString(fechaFinRenovada);
        const traslape = fechaNuevaInicio.getTime() <= fechaFinRenovada.getTime();
        if (mismasFechas || traslape) {
            throw new Error('Las fechas de renovación coinciden o se traslapan con una versión anterior.');
        }
    }

    const conflictos = await prisma.proyectos.findMany({
        where: {
            proyecto_origen_id: id,
            OR: [
                {
                    fecha_inicio_contractual: { lte: fechaNuevaFin },
                    fecha_fin_contractual: { gte: fechaNuevaInicio }
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
    // --- FIN DE LA LÓGICA DE VALIDACIÓN ---


    // ==================================================================
    // --- INICIO DE LA LÓGICA AÑADIDA: Archivar la renovación anterior ---
    // ==================================================================
    // 1. Buscamos la renovación más reciente que ya exista para este proyecto original.
    const ultimaRenovacion = await prisma.proyectos.findFirst({
        where: {
            proyecto_origen_id: proyectoOriginal.id,
        },
        orderBy: {
            version: 'desc', // Puedes ordenar por 'id' o 'fecha_fin_contractual' también
        },
    });

    // 2. Si encontramos una, la marcamos como 'Reemplazado'.
    if (ultimaRenovacion) {
        await prisma.proyectos.update({
            where: { id: ultimaRenovacion.id },
            data: { estado_ejecucion: 'Reemplazado' },
        });
        console.log(`✅ Versión anterior (ID: ${ultimaRenovacion.id}) marcada como 'Reemplazado'.`);
    }
    // ==================================================================
    // --- FIN DE LA LÓGICA AÑADIDA ---
    // ==================================================================


    // Calcular número de versión
    const nuevaVersion = (proyectoOriginal.renovaciones?.length || 0) + 1;

    // La lógica de creación del nuevo proyecto se mantiene igual
    const { id: _, renovaciones: __, ...datosBase } = proyectoOriginal;
    const datosParaCrear = {
        ...datosBase,
        ...datos,
        es_renovacion: true,
        proyecto_origen_id: proyectoOriginal.id,
        version: nuevaVersion,
        fecha_inicio_contractual: fechaNuevaInicio,
        fecha_fin_contractual: fechaNuevaFin,
        fecha_cierre_financiera: fechaNuevaCierre,
        notas_de_renovacion: datos.notas_de_renovacion || null,
        tcv: Number(datos.tcv),
        venta_revenue: Number(datos.venta_revenue),
        venta_cost: Number(datos.venta_cost),
        venta_dm: Number(datos.venta_dm),
    };

    const nuevoProyecto = await prisma.proyectos.create({
        data: datosParaCrear,
    });

    console.log(`✅ Proyecto ${id} renovado → versión #${nuevaVersion} (ID ${nuevoProyecto.id}) creada.`);
    return nuevoProyecto;
};


export const obtenerRenovacionesProyectoService = async (id: number) => {
    // 1. Encontrar el proyecto actual para saber cuál es su origen
    const proyectoActual = await prisma.proyectos.findUnique({ where: { id: id } });

    if (!proyectoActual) {
        return []; // Si el proyecto no existe, devuelve un array vacío
    }

    // 2. Determinar el ID del proyecto raíz (el original).
    // Si el proyecto actual tiene un 'proyecto_origen_id', usamos ese.
    // Si no (porque es el original), usamos su propio 'id'.
    const idOriginal = proyectoActual.proyecto_origen_id || proyectoActual.id;

    // 3. Buscar el proyecto original y TODAS sus renovaciones
    const proyectoOriginal = await prisma.proyectos.findUnique({
        where: { id: idOriginal },
    });

    const renovaciones = await prisma.proyectos.findMany({
        where: { proyecto_origen_id: idOriginal },
        orderBy: { fecha_inicio_contractual: 'asc' },
    });

    // 4. Juntamos todo en un solo array. Usamos filter(Boolean) por si el original es null.
    const todasLasVersiones = [proyectoOriginal, ...renovaciones].filter(Boolean);

    // 5. Devolvemos todas las versiones EXCEPTO la que el usuario ya está viendo en la página.
    // El frontend ya tiene 'proyectoActual', aquí le devolvemos el resto de la familia.
    return todasLasVersiones.filter(version => version.id !== id);
};
