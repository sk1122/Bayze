-- CreateTable
CREATE TABLE "access_token" (
    "id" SERIAL NOT NULL,
    "access_token" VARCHAR NOT NULL,
    "provider" VARCHAR,
    "userId" TEXT NOT NULL,

    CONSTRAINT "access_token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin" (
    "id" SERIAL NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_column" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "organizationId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee" (
    "id" SERIAL NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_column" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "organizationId" INTEGER,
    "userId" TEXT NOT NULL,

    CONSTRAINT "employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "address" JSONB DEFAULT E'{"city":"","state":"","country":""}',
    "email" VARCHAR NOT NULL,
    "phone_number" VARCHAR,
    "website" VARCHAR,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_column" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "page" (
    "id" SERIAL NOT NULL,
    "access_token" VARCHAR,
    "page_id" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,
    "business" JSONB,
    "category" VARCHAR NOT NULL,
    "category_list" JSONB[],
    "tasks" TEXT[],
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_column" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_account" (
    "id" SERIAL NOT NULL,
    "provider_id" VARCHAR,
    "username" VARCHAR,
    "displayName" VARCHAR,
    "gender" VARCHAR,
    "profileURL" VARCHAR,
    "photos" VARCHAR,
    "email" VARCHAR,
    "json" JSONB,
    "provider" VARCHAR,
    "userId" TEXT NOT NULL,

    CONSTRAINT "social_account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,
    "role" TEXT[],
    "is_accepted_to_org" BOOLEAN NOT NULL DEFAULT false,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_column" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_userId_key" ON "admin"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "employee_userId_key" ON "employee"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "social_account_email_key" ON "social_account"("email");

-- CreateIndex
CREATE UNIQUE INDEX "social_account_userId_key" ON "social_account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "access_token" ADD CONSTRAINT "access_token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "admin" ADD CONSTRAINT "admin_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "admin" ADD CONSTRAINT "admin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "page" ADD CONSTRAINT "page_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "social_account" ADD CONSTRAINT "social_account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
