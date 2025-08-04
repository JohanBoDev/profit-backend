-- CreateTable
CREATE TABLE `proyectos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ceco_anterior` VARCHAR(100) NULL,
    `id_sap` VARCHAR(100) NULL,
    `nombre` VARCHAR(255) NULL,
    `tipo_reconocimiento` VARCHAR(100) NULL,
    `descripcion` TEXT NULL,
    `cliente` VARCHAR(255) NULL,
    `sector` VARCHAR(100) NULL,
    `pais` VARCHAR(100) NULL,
    `empresa` VARCHAR(150) NULL,
    `agrupacion_n1` VARCHAR(100) NULL,
    `agrupacion_n2` VARCHAR(100) NULL,
    `bl` VARCHAR(50) NULL,
    `bu` VARCHAR(50) NULL,
    `ol` VARCHAR(50) NULL,
    `account_manager` VARCHAR(150) NULL,
    `preventa` VARCHAR(150) NULL,
    `project_manager` VARCHAR(150) NULL,
    `estado_ejecucion` VARCHAR(100) NULL,
    `estado_sap` VARCHAR(100) NULL,
    `fecha_cierre_financiera` DATE NULL,
    `fecha_inicio_contractual` DATE NULL,
    `fecha_fin_contractual` DATE NULL,
    `tcv` DECIMAL(18, 2) NULL,
    `venta_revenue` DECIMAL(18, 2) NULL,
    `venta_cost` DECIMAL(18, 2) NULL,
    `venta_dm` DECIMAL(18, 2) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `correo` VARCHAR(100) NOT NULL,
    `contrasena` VARCHAR(255) NOT NULL,
    `rol` ENUM('admin', 'gestor', 'consulta') NOT NULL DEFAULT 'consulta',
    `creado_en` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `correo`(`correo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `personas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(150) NOT NULL,
    `correo` VARCHAR(100) NULL,
    `cargo` VARCHAR(100) NOT NULL,
    `empresa` VARCHAR(100) NULL,
    `telefono` VARCHAR(50) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `persona_proyecto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `persona_id` INTEGER NOT NULL,
    `proyecto_id` INTEGER NOT NULL,
    `rol` VARCHAR(100) NOT NULL,

    INDEX `persona_proyecto_persona_id_idx`(`persona_id`),
    INDEX `persona_proyecto_proyecto_id_idx`(`proyecto_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `persona_proyecto` ADD CONSTRAINT `persona_proyecto_persona_id_fkey` FOREIGN KEY (`persona_id`) REFERENCES `personas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `persona_proyecto` ADD CONSTRAINT `persona_proyecto_proyecto_id_fkey` FOREIGN KEY (`proyecto_id`) REFERENCES `proyectos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
