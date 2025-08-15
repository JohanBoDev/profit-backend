/*
  Warnings:

  - You are about to drop the column `cargo` on the `personas` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[correo]` on the table `personas` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[document]` on the table `personas` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `persona_proyecto` DROP FOREIGN KEY `persona_proyecto_persona_id_fkey`;

-- DropForeignKey
ALTER TABLE `persona_proyecto` DROP FOREIGN KEY `persona_proyecto_proyecto_id_fkey`;

-- AlterTable
ALTER TABLE `personas` DROP COLUMN `cargo`,
    ADD COLUMN `cargo_id` INTEGER NULL,
    ADD COLUMN `document` VARCHAR(50) NULL;

-- AlterTable
ALTER TABLE `proyectos` ADD COLUMN `venta_dm_porcentaje` DECIMAL(5, 2) NULL;

-- CreateTable
CREATE TABLE `cargos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `correo` ON `personas`(`correo`);

-- CreateIndex
CREATE UNIQUE INDEX `document` ON `personas`(`document`);

-- CreateIndex
CREATE INDEX `cargo_id` ON `personas`(`cargo_id`);

-- AddForeignKey
ALTER TABLE `personas` ADD CONSTRAINT `personas_ibfk_1` FOREIGN KEY (`cargo_id`) REFERENCES `cargos`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `persona_proyecto` ADD CONSTRAINT `persona_proyecto_persona_id_fkey` FOREIGN KEY (`persona_id`) REFERENCES `personas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `persona_proyecto` ADD CONSTRAINT `persona_proyecto_proyecto_id_fkey` FOREIGN KEY (`proyecto_id`) REFERENCES `proyectos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
