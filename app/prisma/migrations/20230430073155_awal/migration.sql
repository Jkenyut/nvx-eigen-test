-- AlterTable
ALTER TABLE `members` MODIFY `lastPenaltyDate` DATETIME(3) NULL;

-- CreateIndex
CREATE INDEX `Books_id_code_idx` ON `Books` (`id`, `code`);

-- CreateIndex
CREATE INDEX `Members_id_code_idx` ON `Members` (`id`, `code`);
