export type Rol = 'admin' | 'gestor' | 'consulta';

export interface Usuario {
    id: number;
    nombre: string;
    correo: string;
    contrasena: string;
    rol: Rol;
    creado_en: Date;
}

export interface UsuarioPublico {
    id: number;
    nombre: string;
    correo: string;
    rol: Rol;
}