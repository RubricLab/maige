-- CreateTable
CREATE TABLE `Customer` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `stripeSubscriptionId` VARCHAR(191) NULL,
    `stripeCustomerId` VARCHAR(191) NULL,
    `usage` INTEGER NOT NULL DEFAULT 0,
    `totalUsage` INTEGER NOT NULL DEFAULT 0,
    `usageLimit` INTEGER NOT NULL DEFAULT 20,
    `usageUpdatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `usageWarned` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Customer_name_key`(`name`),
    UNIQUE INDEX `Customer_stripeSubscriptionId_key`(`stripeSubscriptionId`),
    UNIQUE INDEX `Customer_stripeCustomerId_key`(`stripeCustomerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Project` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `customInstructions` TEXT NOT NULL DEFAULT '',
    `customerId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Project_customerId_idx`(`customerId`),
    UNIQUE INDEX `Project_customerId_name_key`(`customerId`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

