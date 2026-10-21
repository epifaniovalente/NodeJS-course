/*
  Warnings:

  - You are about to drop the `auditoria` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cliente` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `produto` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `auditoria`;

-- DropTable
DROP TABLE `cliente`;

-- DropTable
DROP TABLE `produto`;

-- DropTable
DROP TABLE `user`;

-- CreateTable
CREATE TABLE `chamados` (
    `id` VARCHAR(191) NOT NULL,
    `titulo` VARCHAR(191) NOT NULL,
    `descricao` TEXT NOT NULL,
    `statu` ENUM('Aberto', 'Em_Andamento', 'Resolvido', 'Fechado') NOT NULL DEFAULT 'Aberto',
    `prioridade` ENUM('Baixa', 'Media', 'Alta') NOT NULL DEFAULT 'Media',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `clienteID` VARCHAR(191) NOT NULL,

    INDEX `chamados_clienteID_fkey`(`clienteID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `comentarios` (
    `id` VARCHAR(191) NOT NULL,
    `texto` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `chamadoID` VARCHAR(191) NOT NULL,
    `usuarioID` VARCHAR(191) NOT NULL,
    `like` INTEGER NOT NULL,

    INDEX `comentarios_chamadoID_fkey`(`chamadoID`),
    INDEX `comentarios_usuarioID_fkey`(`usuarioID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuarios` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `senha` VARCHAR(191) NOT NULL,
    `role` ENUM('Cliente', 'Tecnico', 'Admin') NOT NULL DEFAULT 'Cliente',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `usuarios_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `chamados` ADD CONSTRAINT `chamados_clienteID_fkey` FOREIGN KEY (`clienteID`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comentarios` ADD CONSTRAINT `comentarios_chamadoID_fkey` FOREIGN KEY (`chamadoID`) REFERENCES `chamados`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comentarios` ADD CONSTRAINT `comentarios_usuarioID_fkey` FOREIGN KEY (`usuarioID`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
