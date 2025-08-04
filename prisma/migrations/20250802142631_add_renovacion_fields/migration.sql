-- AlterTable
ALTER TABLE `proyectos` ADD COLUMN `es_renovacion` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `proyecto_origen_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `proyectos` ADD CONSTRAINT `proyectos_proyecto_origen_id_fkey` FOREIGN KEY (`proyecto_origen_id`) REFERENCES `proyectos`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
