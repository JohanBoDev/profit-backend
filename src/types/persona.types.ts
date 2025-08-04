// src/types/persona.types.ts

// Tipo para representar un cargo simple
export interface CargoSimple {
    name: string;
}

// Tipo para representar una persona con su cargo
export interface PersonaConCargo {
    id: number;
    nombre: string;
    correo?: string | null;
    document?: string | null;
    empresa?: string | null;
    telefono?: string | null;
    cargo_id?: number | null;
    cargo?: CargoSimple | null; // El objeto del cargo relacionado
}