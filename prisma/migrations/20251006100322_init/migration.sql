-- CreateEnum
CREATE TYPE "public"."TicketStatus" AS ENUM ('active', 'used', 'cancelled');

-- CreateEnum
CREATE TYPE "public"."NotificationType" AS ENUM ('event_update', 'event_cancelled', 'event_accepted', 'post_accepted', 'reminder', 'general');

-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('user', 'moderator', 'admin');

-- CreateEnum
CREATE TYPE "public"."EventStatus" AS ENUM ('pending', 'approved', 'rejected', 'cancelled');

-- CreateEnum
CREATE TYPE "public"."CommunityPostStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "public"."RegistrationStatus" AS ENUM ('pending', 'confirmed', 'paid', 'cancelled');

-- CreateEnum
CREATE TYPE "public"."EventTag" AS ENUM ('music', 'sports', 'education', 'tech', 'business', 'art', 'food', 'culture', 'charity', 'entertainment', 'health', 'community');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "role" "public"."UserRole" NOT NULL DEFAULT 'user',
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "avatar_url" TEXT,
    "phone_number" TEXT,
    "bio" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."events" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "image_url" VARCHAR(500) NOT NULL,
    "capacity" INTEGER NOT NULL DEFAULT 0,
    "price" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "location" VARCHAR(500) NOT NULL,
    "status" "public"."EventStatus" NOT NULL DEFAULT 'pending',
    "contactPhone" VARCHAR(20),
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "is_free" BOOLEAN NOT NULL,
    "tag" "public"."EventTag",
    "organizer_id" TEXT NOT NULL,
    "approved_by_id" TEXT,
    "approved_at" TIMESTAMP(3),
    "rejected_at" TIMESTAMP(3),
    "cancelled_at" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "registrationDeadline" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."community_post" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" VARCHAR(255),
    "poster_url" VARCHAR(500),
    "description" TEXT NOT NULL,
    "location" VARCHAR(500),
    "start_time" TIMESTAMP(3),
    "end_time" TIMESTAMP(3),
    "tag" "public"."EventTag",
    "status" "public"."CommunityPostStatus" NOT NULL DEFAULT 'pending',
    "approved_by_id" TEXT,
    "approved_at" TIMESTAMP(3),
    "rejected_at" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "community_post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."participants" (
    "id" TEXT NOT NULL,
    "participant_id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "status" "public"."RegistrationStatus" NOT NULL DEFAULT 'pending',
    "checkedInAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "confirmed_at" TIMESTAMP(3),

    CONSTRAINT "participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."notifications" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "readAt" TIMESTAMP(3),
    "type" "public"."NotificationType" NOT NULL,
    "actionUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tickets" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "status" "public"."TicketStatus" NOT NULL DEFAULT 'active',
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "scanned_by" TEXT,

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "public"."users"("role");

-- CreateIndex
CREATE UNIQUE INDEX "events_slug_key" ON "public"."events"("slug");

-- CreateIndex
CREATE INDEX "events_slug_idx" ON "public"."events"("slug");

-- CreateIndex
CREATE INDEX "events_organizer_id_idx" ON "public"."events"("organizer_id");

-- CreateIndex
CREATE INDEX "events_status_idx" ON "public"."events"("status");

-- CreateIndex
CREATE INDEX "events_start_time_idx" ON "public"."events"("start_time");

-- CreateIndex
CREATE INDEX "events_tag_idx" ON "public"."events"("tag");

-- CreateIndex
CREATE INDEX "events_location_idx" ON "public"."events"("location");

-- CreateIndex
CREATE INDEX "community_post_user_id_idx" ON "public"."community_post"("user_id");

-- CreateIndex
CREATE INDEX "community_post_status_idx" ON "public"."community_post"("status");

-- CreateIndex
CREATE INDEX "community_post_tag_idx" ON "public"."community_post"("tag");

-- CreateIndex
CREATE INDEX "participants_participant_id_idx" ON "public"."participants"("participant_id");

-- CreateIndex
CREATE INDEX "participants_event_id_idx" ON "public"."participants"("event_id");

-- CreateIndex
CREATE INDEX "participants_status_idx" ON "public"."participants"("status");

-- CreateIndex
CREATE UNIQUE INDEX "participants_participant_id_event_id_key" ON "public"."participants"("participant_id", "event_id");

-- CreateIndex
CREATE INDEX "notifications_user_id_idx" ON "public"."notifications"("user_id");

-- CreateIndex
CREATE INDEX "notifications_readAt_idx" ON "public"."notifications"("readAt");

-- CreateIndex
CREATE INDEX "notifications_type_idx" ON "public"."notifications"("type");

-- CreateIndex
CREATE INDEX "notifications_createdAt_idx" ON "public"."notifications"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "tickets_code_key" ON "public"."tickets"("code");

-- CreateIndex
CREATE INDEX "tickets_event_id_idx" ON "public"."tickets"("event_id");

-- CreateIndex
CREATE INDEX "tickets_user_id_idx" ON "public"."tickets"("user_id");

-- CreateIndex
CREATE INDEX "tickets_code_idx" ON "public"."tickets"("code");

-- CreateIndex
CREATE INDEX "tickets_status_idx" ON "public"."tickets"("status");

-- CreateIndex
CREATE UNIQUE INDEX "tickets_event_id_user_id_key" ON "public"."tickets"("event_id", "user_id");

-- AddForeignKey
ALTER TABLE "public"."events" ADD CONSTRAINT "events_approved_by_id_fkey" FOREIGN KEY ("approved_by_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."events" ADD CONSTRAINT "events_organizer_id_fkey" FOREIGN KEY ("organizer_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."community_post" ADD CONSTRAINT "community_post_approved_by_id_fkey" FOREIGN KEY ("approved_by_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."community_post" ADD CONSTRAINT "community_post_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."participants" ADD CONSTRAINT "participants_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."participants" ADD CONSTRAINT "participants_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tickets" ADD CONSTRAINT "tickets_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tickets" ADD CONSTRAINT "tickets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
