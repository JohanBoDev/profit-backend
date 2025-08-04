import ExcelJS from 'exceljs';
import { Response } from 'express';
// Importa el cliente de Prisma y el tipo de dato 'proyectos' generado
import { PrismaClient, proyectos as ProyectoType } from '@prisma/client';

// Crea una instancia del cliente de Prisma
const prisma = new PrismaClient();

export const exportarProyectosService = async (res: Response, proyectosIds?: number[]) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Proyectos');

    // Paleta de colores
    const azulOscuro = '00254B'; // Se usa directamente el valor hexadecimal sin #
    const azulClaro = '14599A';
    const blanco = 'FFFFFF';

    // Encabezados
    const headers = [
        'Ceco anterior', 'ID SAP', 'Nombre', 'Tipo Reconocimiento', 'Descripción', 'Cliente',
        'Sector', 'País', 'Empresa', 'Agrupación N1', 'Agrupación N2', 'BL', 'BU', 'OL',
        'Account Manager', 'Preventa', 'Project Manager', 'Estado de Ejecución', 'Estado SAP',
        'Fecha Cierre Financiera', 'Fecha Inicio Contractual', 'Fecha Fin Contractual',
        'TCV', 'Venta Revenue', 'Venta Cost', 'Venta DM'
    ];

    // Agregar encabezado
    const headerRow = worksheet.addRow(headers);

    // Estilo de encabezado
    headerRow.eachCell((cell) => {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: azulOscuro },
        };
        cell.font = {
            color: { argb: blanco },
            bold: true,
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = {
            top: { style: 'thin', color: { argb: azulClaro } },
            left: { style: 'thin', color: { argb: azulClaro } },
            bottom: { style: 'thin', color: { argb: azulClaro } },
            right: { style: 'thin', color: { argb: azulClaro } },
        };
    });
    headerRow.height = 20; // Aumentar altura para mejor legibilidad

    // Obtener proyectos (por ids o todos)
    const proyectos = await prisma.proyectos.findMany({
        where: proyectosIds?.length ? { id: { in: proyectosIds } } : undefined,
    });

    // Agregar los proyectos al Excel
    // CORRECCIÓN 2: Se añade el tipo explícito 'ProyectoType' al parámetro 'p'
    proyectos.forEach((p: ProyectoType) => {
        worksheet.addRow([
            p.ceco_anterior ?? '',
            p.id_sap ?? '',
            p.nombre ?? '',
            p.tipo_reconocimiento ?? '',
            p.descripcion ?? '',
            p.cliente ?? '',
            p.sector ?? '',
            p.pais ?? '',
            p.empresa ?? '',
            p.agrupacion_n1 ?? '',
            p.agrupacion_n2 ?? '',
            p.bl ?? '',
            p.bu ?? '',
            p.ol ?? '',
            p.account_manager ?? '',
            p.preventa ?? '',
            p.project_manager ?? '',
            p.estado_ejecucion ?? '',
            p.estado_sap ?? '',
            p.fecha_cierre_financiera?.toISOString().split('T')[0] ?? '',
            p.fecha_inicio_contractual?.toISOString().split('T')[0] ?? '',
            p.fecha_fin_contractual?.toISOString().split('T')[0] ?? '',
            p.tcv?.toString() ?? '',
            p.venta_revenue?.toString() ?? '',
            p.venta_cost?.toString() ?? '',
            p.venta_dm?.toString() ?? '',
        ]);
    });

    worksheet.columns?.forEach((column) => {
        if (column?.eachCell) {
            let maxLength = 15; // Ancho mínimo para encabezados

            column.eachCell({ includeEmpty: true }, (cell) => {
                const cellValue = cell?.value;
                if (cellValue) {
                    const length = cellValue.toString().length;
                    if (length > maxLength) {
                        maxLength = length;
                    }
                }
            });

            // Limita el ancho máximo para evitar columnas enormes
            column.width = Math.min(maxLength + 2, 50);
        }
    });

    worksheet.autoFilter = {
        from: 'A1',
        to: `${String.fromCharCode(65 + headers.length - 1)}1`,
    };

    // Preparar respuesta
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=proyectos.xlsx');

    await workbook.xlsx.write(res);
    res.end();
};