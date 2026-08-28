-- Better Auth 1.7 scopes account identities by issuer, keying accounts on (issuer, accountId).
-- Credential accounts use the synthetic issuer `local:credential` and already store the linked
-- user's id as `accountId`, so the column is backfilled rather than recomputed. The column is
-- added nullable first because a required column without a default cannot be added to a
-- populated table in a single statement.

-- AlterTable
ALTER TABLE "account" ADD COLUMN "issuer" TEXT;

-- Backfill
UPDATE "account" SET "issuer" = 'local:credential' WHERE "providerId" = 'credential';

-- AlterTable
ALTER TABLE "account" ALTER COLUMN "issuer" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "account_issuer_accountId_uidx" ON "account"("issuer", "accountId");
