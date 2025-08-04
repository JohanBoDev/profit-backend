/*
  Warnings:

  - A unique constraint covering the columns `[persona_id,proyecto_id]` on the table `persona_proyecto` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `persona_proyecto_persona_id_proyecto_id_key` ON `persona_proyecto`(`persona_id`, `proyecto_id`);
