import { Request, Response } from 'express';
import { exportarProyectosService } from '../services/exportarProyectos.service';

export const exportarProyectosController = async (req: Request, res: Response) => {
    try {
        const { ids } = req.query;

        let proyectosIds: number[] | undefined = undefined;

        if (ids) {
            proyectosIds = (Array.isArray(ids) ? ids : [ids])
                .map(Number)
                .filter((id) => !isNaN(id));
        }

        await exportarProyectosService(res, proyectosIds);
    } catch (error: any) {
        res.status(500).json({ error: 'Error exportando proyectos', detail: error.message });
    }
};
