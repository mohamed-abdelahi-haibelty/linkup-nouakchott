CREATE TABLE "guest_sessions" (
 "tokenHash" TEXT PRIMARY KEY, "userId" TEXT NOT NULL UNIQUE,
 "ipHash" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 "expiresAt" TIMESTAMP(3) NOT NULL,
 CONSTRAINT "guest_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "guest_sessions_ipHash_createdAt_idx" ON "guest_sessions"("ipHash", "createdAt");
CREATE INDEX "guest_sessions_expiresAt_idx" ON "guest_sessions"("expiresAt");
