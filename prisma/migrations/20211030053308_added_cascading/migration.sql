-- DropForeignKey
ALTER TABLE "access_token" DROP CONSTRAINT "access_token_userId_fkey";

-- DropForeignKey
ALTER TABLE "admin" DROP CONSTRAINT "admin_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "admin" DROP CONSTRAINT "admin_userId_fkey";

-- DropForeignKey
ALTER TABLE "employee" DROP CONSTRAINT "employee_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "employee" DROP CONSTRAINT "employee_userId_fkey";

-- DropForeignKey
ALTER TABLE "page" DROP CONSTRAINT "page_userId_fkey";

-- DropForeignKey
ALTER TABLE "social_account" DROP CONSTRAINT "social_account_userId_fkey";

-- AddForeignKey
ALTER TABLE "access_token" ADD CONSTRAINT "access_token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "admin" ADD CONSTRAINT "admin_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "admin" ADD CONSTRAINT "admin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "page" ADD CONSTRAINT "page_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "social_account" ADD CONSTRAINT "social_account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
