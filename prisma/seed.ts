import {
  PrismaClient,
  UserRole,
  EventStatus,
  CommunityPostStatus,
  RegistrationStatus,
  NotificationType,
  EventTag,
} from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

// Helper to pick a random item from an array
const random = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

async function main() {
  // Use Node.js built-in crypto.randomUUID instead of uuid package
  const uuidv4 = randomUUID;

  // Dynamically import faker
  const { faker } = await import("@faker-js/faker");

  // --- Create Users ---
  const users = [];
  const roles: UserRole[] = ["user", "moderator", "admin"];

  for (let i = 0; i < 50; i++) {
    const role = i < 3 ? roles[i] : "user"; // First 3 users are admin/moderator
    const user = await prisma.user.create({
      data: {
        id: uuidv4(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        role,
        avatarUrl: faker.image.avatar(),
        phoneNumber: faker.phone.number(),
        bio: faker.lorem.sentence(),
      },
    });
    users.push(user);
  }

  // --- Create Events ---
  const eventTags: EventTag[] = [
    "music",
    "concert",
    "festival",
    "sports",
    "fitness",
    "workshop",
    "education",
    "tech",
    "conference",
    "seminar",
    "meetup",
    "party",
    "networking",
    "food",
    "drink",
    "art",
    "exhibition",
    "theater",
    "cinema",
    "comedy",
    "charity",
    "religious",
    "cultural",
    "fashion",
    "gaming",
    "travel",
    "outdoors",
    "kids",
    "family",
    "wellness",
    "health",
    "business",
    "entrepreneurship",
    "marketing",
    "hackathon",
    "photography",
    "dance",
    "literature",
    "poetry",
    "debate",
    "science",
    "environment",
    "politics",
    "community",
  ];

  const events = [];
  for (let i = 0; i < 20; i++) {
    const organizer = random(users.filter((u) => u.role !== "user"));
    const status = random([
      "pending",
      "approved",
      "rejected",
      "cancelled",
    ] as EventStatus[]);
    const startTime = faker.date.soon({ days: 60 }); // Next 60 days
    const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000); // +2 hours

    const event = await prisma.event.create({
      data: {
        id: uuidv4(),
        title: faker.lorem.words(3),
        slug: faker.helpers
          .slugify(faker.lorem.words(3) + "-" + i)
          .toLowerCase(),
        description: faker.lorem.paragraphs(2),
        location: faker.location.city(),
        capacity: faker.number.int({ min: 50, max: 500 }),
        price: parseFloat(faker.commerce.price({ min: 0, max: 500 })),
        startTime,
        endTime,
        tag: random(eventTags),
        status,
        organizerId: organizer.id,
        approvedById:
          status === "approved"
            ? random(users.filter((u) => u.role === "admin")).id
            : null,
        approvedAt: status === "approved" ? new Date() : null,
      },
    });
    events.push(event);
  }

  // --- Create Community Posts ---
  const posts = [];
  for (let i = 0; i < 30; i++) {
    const user = random(users);
    const status = random([
      "pending",
      "approved",
      "rejected",
    ] as CommunityPostStatus[]);
    const post = await prisma.communityPost.create({
      data: {
        id: uuidv4(),
        userId: user.id,
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
        location: faker.location.city(),
        startTime: faker.date.soon({ days: 90 }),
        endTime: faker.date.soon({ days: 100 }),
        tag: random(eventTags),
        status,
        approvedById:
          status === "approved"
            ? random(users.filter((u) => u.role === "admin")).id
            : null,
        approvedAt: status === "approved" ? new Date() : null,
      },
    });
    posts.push(post);
  }

  // --- Create Participants ---
  const participants = [];
  for (const event of events) {
    const participantsCount = faker.number.int({
      min: 5,
      max: Math.min(event.capacity, 20),
    });
    const eventUsers = faker.helpers.arrayElements(users, participantsCount);

    for (const user of eventUsers) {
      const status = random([
        "pending",
        "confirmed",
        "paid",
        "cancelled",
      ] as RegistrationStatus[]);
      const participant = await prisma.participant.create({
        data: {
          id: uuidv4(),
          participantId: user.id,
          eventId: event.id,
          status,
          confirmedAt:
            status === "confirmed" || status === "paid"
              ? faker.date.recent({ days: 10 })
              : null,
          checkedInAt:
            status === "paid" ? faker.date.recent({ days: 5 }) : null,
        },
      });
      participants.push(participant);
    }
  }

  // --- Create Tickets ---
  for (const participant of participants.filter((p) => p.status === "paid")) {
    await prisma.ticket.create({
      data: {
        id: uuidv4(),
        eventId: participant.eventId,
        userId: participant.participantId,
        code: `TICKET-${faker.number.int({ min: 100000, max: 999999 })}`,
        status: "active",
        issuedAt: new Date(),
      },
    });
  }

  // --- Create Notifications ---
  for (const user of users) {
    const notificationsCount = faker.number.int({ min: 1, max: 5 });
    for (let i = 0; i < notificationsCount; i++) {
      await prisma.notification.create({
        data: {
          id: uuidv4(),
          userId: user.id,
          title: faker.lorem.sentence(),
          message: faker.lorem.paragraph(),
          type: random([
            "event_update",
            "event_cancelled",
            "event_accepted",
            "post_accepted",
            "reminder",
            "general",
          ] as NotificationType[]),
          createdAt: faker.date.recent({ days: 30 }),
        },
      });
    }
  }

  console.log(
    "✅ Database seeded with users, events, posts, participants, tickets, and notifications!"
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
