-- CreateTable
CREATE TABLE "WeightEntry" (
    "id" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "WeightEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WeightEntry_userId_date_idx" ON "WeightEntry"("userId", "date");

-- AddForeignKey
ALTER TABLE "WeightEntry" ADD CONSTRAINT "WeightEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
