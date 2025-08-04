-- AlterTable
ALTER TABLE `proyectos` ADD COLUMN `notas_de_renovacion` TEXT NULL,
    ADD COLUMN `version` INTEGER NULL DEFAULT 1;
