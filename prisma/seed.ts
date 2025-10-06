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
    "sports",
    "education",
    "tech",
    "business",
    "art",
    "food",
    "culture",
    "charity",
    "entertainment",
    "health",
    "community",
  ];

  // Generate realistic event names based on tags
  const getEventTitle = (tag: EventTag): string => {
    const eventTitles = {
      music: [
        "Summer Music Festival",
        "Jazz Under the Stars",
        "Rock & Roll Revival",
        "Classical Evening Concert",
        "Indie Music Showcase",
        "Blues & BBQ Night",
        "Electronic Music Experience",
        "Acoustic Sessions",
        "World Music Celebration",
        "Singer-Songwriter Open Mic",
      ],
      sports: [
        "Community Basketball Tournament",
        "5K Charity Run",
        "Soccer Championship Finals",
        "Tennis Open Tournament",
        "Volleyball Beach Competition",
        "Marathon Training Program",
        "Youth Baseball League",
        "Swimming Championship",
        "Golf Tournament Fundraiser",
        "Triathlon Challenge",
      ],
      education: [
        "Science Fair Exhibition",
        "Career Development Seminar",
        "Study Skills Workshop",
        "STEM Education Conference",
        "Adult Learning Program",
        "University Information Session",
        "Scholarship Information Meeting",
        "Educational Technology Summit",
        "Teacher Training Workshop",
        "Literacy Program Launch",
      ],
      tech: [
        "JavaScript Developers Meetup",
        "AI & Machine Learning Summit",
        "Startup Pitch Competition",
        "Tech Innovation Conference",
        "Coding Bootcamp Info Session",
        "Cybersecurity Awareness Workshop",
        "Mobile App Development Talk",
        "Data Science Workshop",
        "Cloud Computing Seminar",
        "Tech Career Fair",
      ],
      business: [
        "Small Business Development Workshop",
        "Entrepreneurship Bootcamp",
        "Business Plan Competition",
        "Industry Trade Show",
        "Professional Development Seminar",
        "Business Networking Event",
        "Investment & Finance Workshop",
        "Marketing Strategy Session",
        "Leadership Training Program",
        "Business Innovation Summit",
      ],
      art: [
        "Local Artists Exhibition",
        "Painting Workshop",
        "Sculpture Gallery Opening",
        "Art History Lecture",
        "Mixed Media Art Class",
        "Community Art Project",
        "Student Art Showcase",
        "Abstract Art Workshop",
        "Portrait Drawing Class",
        "Art Therapy Session",
      ],
      food: [
        "Farmers Market Opening",
        "Wine Tasting Evening",
        "Cooking Competition",
        "Food & Culture Festival",
        "Baking Workshop",
        "Restaurant Week Kickoff",
        "Organic Food Fair",
        "International Cuisine Night",
        "BBQ Championship",
        "Healthy Eating Seminar",
      ],
      culture: [
        "Cultural Heritage Celebration",
        "International Dance Performance",
        "Traditional Music Concert",
        "Cultural Exchange Program",
        "Ethnic Food Festival",
        "Language & Culture Workshop",
        "Folk Art Demonstration",
        "Cultural History Presentation",
        "Traditional Craft Workshop",
        "Multicultural Community Fair",
      ],
      charity: [
        "Charity Fundraising Gala",
        "Community Service Day",
        "Food Drive Collection",
        "Charity Walk/Run Event",
        "Volunteer Appreciation Dinner",
        "Toy Drive Campaign",
        "Blood Donation Drive",
        "Homeless Shelter Support",
        "Environmental Cleanup Day",
        "Animal Shelter Fundraiser",
      ],
      entertainment: [
        "Comedy Night Showcase",
        "Live Theater Performance",
        "Film Festival Screening",
        "Magic Show Extravaganza",
        "Talent Show Competition",
        "Trivia Night Competition",
        "Karaoke Party Night",
        "Game Show Live Event",
        "Variety Show Performance",
        "Stand-up Comedy Special",
      ],
      health: [
        "Health Screening Event",
        "Medical Information Seminar",
        "First Aid Training Course",
        "Healthcare Awareness Campaign",
        "Fitness Assessment Workshop",
        "Preventive Health Seminar",
        "Senior Health & Wellness",
        "Women's Health Workshop",
        "Men's Health Awareness",
        "Children's Health Fair",
      ],
      community: [
        "Neighborhood Association Meeting",
        "Community Volunteer Fair",
        "Local Issues Discussion",
        "Community Garden Project",
        "Resident Welcome Event",
        "Community Safety Workshop",
        "Local Business Fair",
        "Community Service Project",
        "Neighborhood Cleanup Day",
        "Community Building Workshop",
      ],
    };

    const titles = eventTitles[tag] || [
      "Community Event",
      "Local Gathering",
      "Special Event",
    ];
    return random(titles);
  };

  // Event image using DiceBear API with different styles based on tags
  const getEventImageUrl = (tag: EventTag, eventTitle: string): string => {
    // DiceBear styles that could work for event imagery
    const styleMapping = {
      music: "shapes",
      sports: "identicon",
      education: "thumbs",
      tech: "identicon",
      business: "thumbs",
      art: "rings",
      food: "shapes",
      culture: "rings",
      charity: "thumbs",
      entertainment: "fun-emoji",
      health: "thumbs",
      community: "thumbs",
    };

    const style = styleMapping[tag] || "shapes";

    // Create a seed from the event title to ensure consistency
    const seed = encodeURIComponent(
      eventTitle.toLowerCase().replace(/\s+/g, "-")
    );

    // Using DiceBear API v9 format
    return `https://api.dicebear.com/9.x/${style}/svg?seed=${seed}&size=800`;
  };

  const events = [];
  for (let i = 0; i < 200; i++) {
    const organizer = random(users.filter((u) => u.role !== "user"));
    const status = random([
      "pending",
      "approved",
      "rejected",
      "cancelled",
    ] as EventStatus[]);
    const startTime = faker.date.soon({ days: 60 }); // Next 60 days
    const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000); // +2 hours

    // Registration deadline is before the start time (1-7 days before)
    const daysBeforeEvent = faker.number.int({ min: 1, max: 7 });
    const registrationDeadline = new Date(
      startTime.getTime() - daysBeforeEvent * 24 * 60 * 60 * 1000
    );

    const eventTag = random(eventTags);

    const isFree = Math.random() < 0.5;
    const price = isFree
      ? 0
      : parseFloat(faker.commerce.price({ min: 1, max: 500 }));

    const eventTitle = getEventTitle(eventTag);
    const slug = faker.helpers
      .slugify(faker.lorem.words(3) + "-" + i)
      .toLowerCase()
      .substring(0, 250); // Ensure slug is within 255 char limit

    const event = await prisma.event.create({
      data: {
        id: uuidv4(),
        title: eventTitle.substring(0, 250), // Ensure title is within 255 char limit
        slug,
        description: faker.lorem.paragraphs(2),
        location: faker.location.city().substring(0, 450), // Ensure location is within 500 char limit
        capacity: faker.number.int({ min: 50, max: 500 }),
        price,
        isFree,
        startTime,
        endTime,
        registrationDeadline,
        tag: eventTag,
        imageUrl: getEventImageUrl(eventTag, eventTitle).substring(0, 450), // Ensure imageUrl is within 500 char limit
        status,
        contactPhone: faker.phone.number().substring(0, 15), // Ensure phone is within 20 char limit
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
    "✅ Database seeded with users, 200 events (with images), posts, participants, tickets, and notifications!"
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
