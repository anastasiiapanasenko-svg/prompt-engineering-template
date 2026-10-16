-- AlterTable
ALTER TABLE "CustomProduct" ADD COLUMN "normalizedName" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "CustomProduct_userId_normalizedName_key" ON "CustomProduct"("userId", "normalizedName");
