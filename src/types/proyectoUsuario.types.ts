export interface ProyectoUsuario {
    id: number;
    proyecto_id: number;
    usuario_id: number;
    rol_asignado?: string;
    asignado_en?: Date;
}
