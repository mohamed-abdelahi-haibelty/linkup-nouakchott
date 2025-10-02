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
      concert: [
        "Symphony Orchestra Concert",
        "Live at the Amphitheater",
        "Tribute Band Night",
        "Chamber Music Recital",
        "Gospel Music Concert",
        "Folk Music Evening",
        "Piano Recital Series",
        "Youth Orchestra Performance",
        "Holiday Concert Special",
        "Benefit Concert for Charity",
      ],
      festival: [
        "Annual Arts & Crafts Festival",
        "Food Truck Festival",
        "Cultural Heritage Festival",
        "Spring Flower Festival",
        "Harvest Moon Festival",
        "International Film Festival",
        "Beer & Wine Festival",
        "Street Food Festival",
        "Outdoor Adventure Festival",
        "Family Fun Festival",
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
      fitness: [
        "Morning Yoga in the Park",
        "CrossFit Community Challenge",
        "Zumba Dance Fitness",
        "Pilates Workshop",
        "Outdoor Bootcamp",
        "Cycling Group Ride",
        "Strength Training Seminar",
        "Meditation & Mindfulness",
        "Hiking Adventure Group",
        "Wellness Retreat Weekend",
      ],
      workshop: [
        "Digital Marketing Workshop",
        "Creative Writing Workshop",
        "Photography Masterclass",
        "Cooking Skills Workshop",
        "Art & Craft Workshop",
        "Public Speaking Training",
        "Financial Planning Seminar",
        "Home Improvement Workshop",
        "Gardening Basics Workshop",
        "Language Learning Circle",
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
      conference: [
        "Annual Business Conference",
        "Leadership Summit 2025",
        "Innovation & Strategy Conference",
        "Healthcare Professionals Summit",
        "Marketing Excellence Conference",
        "Sustainability Conference",
        "Education Leadership Forum",
        "Industry Best Practices Summit",
        "Professional Development Conference",
        "Research & Development Symposium",
      ],
      seminar: [
        "Investment Strategies Seminar",
        "Health & Wellness Seminar",
        "Legal Rights Workshop",
        "Tax Planning Seminar",
        "Real Estate Investment Talk",
        "Retirement Planning Seminar",
        "Small Business Development",
        "Insurance Information Session",
        "Estate Planning Workshop",
        "Career Transition Seminar",
      ],
      meetup: [
        "Book Club Monthly Meeting",
        "Photography Enthusiasts Meetup",
        "Networking Coffee Morning",
        "Board Game Night",
        "Language Exchange Meetup",
        "Hiking Group Adventure",
        "Startup Founders Circle",
        "Creative Professionals Meetup",
        "Dog Owners Social Hour",
        "New Residents Welcome",
      ],
      party: [
        "New Year's Eve Celebration",
        "Summer Pool Party",
        "Birthday Celebration Bash",
        "Graduation Party",
        "Holiday Office Party",
        "Costume Party Night",
        "Beach Party Weekend",
        "Rooftop Cocktail Party",
        "Theme Party Extravaganza",
        "Anniversary Celebration",
      ],
      networking: [
        "Business Networking Breakfast",
        "Professional Women's Network",
        "Young Professionals Mixer",
        "Industry Leaders Forum",
        "Entrepreneur's Coffee Chat",
        "Career Advancement Networking",
        "Alumni Networking Event",
        "Chamber of Commerce Mixer",
        "Technology Professionals Meet",
        "Creative Industry Networking",
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
      drink: [
        "Craft Beer Tasting",
        "Wine & Cheese Evening",
        "Cocktail Making Class",
        "Coffee Appreciation Workshop",
        "Tea Ceremony Demonstration",
        "Brewery Tour & Tasting",
        "Whiskey Tasting Experience",
        "Mocktail Making Workshop",
        "Wine Pairing Dinner",
        "Local Distillery Visit",
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
      exhibition: [
        "Photography Exhibition Opening",
        "Historical Artifacts Display",
        "Modern Art Gallery Show",
        "Science Museum Exhibition",
        "Cultural Heritage Display",
        "Student Work Exhibition",
        "Vintage Car Show",
        "Craft & Design Exhibition",
        "Nature Photography Show",
        "Interactive Science Display",
      ],
      theater: [
        "Shakespeare in the Park",
        "Community Theater Production",
        "Drama Workshop Series",
        "Musical Theater Performance",
        "Improv Comedy Show",
        "Children's Theater Performance",
        "One-Act Play Festival",
        "Theater Auditions",
        "Acting Workshop",
        "Stage Design Workshop",
      ],
      cinema: [
        "Independent Film Screening",
        "Classic Movie Night",
        "Documentary Film Festival",
        "Short Film Competition",
        "Film Discussion Series",
        "Movie Marathon Weekend",
        "Outdoor Cinema Experience",
        "Foreign Film Series",
        "Student Film Showcase",
        "Film Industry Panel",
      ],
      comedy: [
        "Stand-up Comedy Night",
        "Improv Comedy Show",
        "Comedy Open Mic",
        "Sketch Comedy Performance",
        "Comedy Writing Workshop",
        "Roast Battle Competition",
        "Family-Friendly Comedy Show",
        "Comedy Club Debut",
        "Satirical Theater Performance",
        "Comedy Storytelling Night",
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
      religious: [
        "Interfaith Community Gathering",
        "Prayer Service",
        "Religious Education Class",
        "Spiritual Retreat Weekend",
        "Community Fellowship Dinner",
        "Youth Group Meeting",
        "Bible Study Circle",
        "Meditation & Prayer Session",
        "Religious Holiday Celebration",
        "Faith-Based Discussion Group",
      ],
      cultural: [
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
      fashion: [
        "Fashion Show Runway Event",
        "Sustainable Fashion Workshop",
        "Style & Beauty Seminar",
        "Fashion Design Competition",
        "Vintage Fashion Show",
        "Fashion Photography Workshop",
        "Wardrobe Styling Session",
        "Fashion Industry Panel",
        "Clothing Swap Event",
        "Fashion Trends Presentation",
      ],
      gaming: [
        "Video Game Tournament",
        "Board Game Championship",
        "Gaming Convention",
        "Esports Competition",
        "Tabletop RPG Night",
        "Retro Gaming Tournament",
        "Game Development Workshop",
        "Gaming Community Meetup",
        "Card Game Competition",
        "Gaming Hardware Expo",
      ],
      travel: [
        "Travel Photography Workshop",
        "Adventure Travel Planning",
        "Solo Travel Safety Seminar",
        "Cultural Travel Experience",
        "Budget Travel Tips Session",
        "Travel Writing Workshop",
        "International Travel Fair",
        "Travel Insurance Seminar",
        "Backpacking Preparation Class",
        "Travel Destination Presentation",
      ],
      outdoors: [
        "Nature Photography Walk",
        "Camping Skills Workshop",
        "Rock Climbing Adventure",
        "Bird Watching Tour",
        "Wilderness Survival Training",
        "Outdoor Yoga Session",
        "Hiking Trail Exploration",
        "Fishing Tournament",
        "Kayaking Adventure",
        "Star Gazing Night",
      ],
      kids: [
        "Children's Art & Craft Day",
        "Kids Science Experiment Workshop",
        "Storytelling & Reading Time",
        "Children's Theater Performance",
        "Kids Cooking Class",
        "Youth Sports Camp",
        "Children's Music Lessons",
        "Educational Game Day",
        "Kids Dance Party",
        "Junior Naturalist Program",
      ],
      family: [
        "Family Fun Day at the Park",
        "Parent-Child Activity Workshop",
        "Family Game Night",
        "Outdoor Family Adventure",
        "Family Cooking Class",
        "Family Movie Night",
        "Multi-Generational Event",
        "Family Fitness Challenge",
        "Family Arts & Crafts",
        "Community Family Picnic",
      ],
      wellness: [
        "Mindfulness & Meditation Retreat",
        "Holistic Health Workshop",
        "Stress Management Seminar",
        "Wellness Fair & Expo",
        "Mental Health Awareness Event",
        "Healthy Lifestyle Workshop",
        "Alternative Medicine Seminar",
        "Self-Care Workshop",
        "Work-Life Balance Seminar",
        "Nutrition & Diet Planning",
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
      entrepreneurship: [
        "Startup Weekend Event",
        "Entrepreneur Pitch Competition",
        "Business Incubator Program",
        "Startup Funding Workshop",
        "Innovation Challenge",
        "Entrepreneur Mentorship Program",
        "Small Business Success Stories",
        "Startup Networking Mixer",
        "Business Model Workshop",
        "Entrepreneurship Conference",
      ],
      marketing: [
        "Digital Marketing Masterclass",
        "Social Media Strategy Workshop",
        "Content Marketing Seminar",
        "Brand Building Workshop",
        "Marketing Analytics Training",
        "Influencer Marketing Panel",
        "Email Marketing Best Practices",
        "SEO & SEM Workshop",
        "Marketing Automation Seminar",
        "Customer Engagement Strategies",
      ],
      hackathon: [
        "48-Hour Coding Challenge",
        "Innovation Hackathon",
        "Social Good Hackathon",
        "Mobile App Hackathon",
        "AI/ML Hackathon",
        "Blockchain Innovation Challenge",
        "Web Development Sprint",
        "Game Development Jam",
        "Data Science Challenge",
        "Sustainability Tech Hackathon",
      ],
      photography: [
        "Portrait Photography Workshop",
        "Landscape Photography Tour",
        "Digital Photography Basics",
        "Photo Editing Masterclass",
        "Street Photography Walk",
        "Wedding Photography Seminar",
        "Photography Equipment Fair",
        "Night Photography Workshop",
        "Photography Competition",
        "Photography Portfolio Review",
      ],
      dance: [
        "Ballroom Dance Lessons",
        "Hip-Hop Dance Workshop",
        "Contemporary Dance Performance",
        "Salsa Dancing Night",
        "Dance Competition",
        "Cultural Dance Performance",
        "Dance Fitness Class",
        "Partner Dance Workshop",
        "Youth Dance Recital",
        "Dance Choreography Workshop",
      ],
      literature: [
        "Poetry Reading & Discussion",
        "Author Book Signing Event",
        "Literary Fiction Workshop",
        "Creative Writing Competition",
        "Book Club Discussion",
        "Literary Festival",
        "Storytelling Workshop",
        "Writing Critique Group",
        "Literary Magazine Launch",
        "Writers' Conference",
      ],
      poetry: [
        "Open Mic Poetry Night",
        "Poetry Writing Workshop",
        "Spoken Word Performance",
        "Poetry Contest & Reading",
        "Haiku Writing Session",
        "Poetry & Music Collaboration",
        "Poetry Slam Competition",
        "Poetry Appreciation Class",
        "Contemporary Poetry Discussion",
        "Poetry Book Launch",
      ],
      debate: [
        "Public Speaking Competition",
        "Debate Tournament",
        "Argumentation Workshop",
        "Mock Trial Competition",
        "Critical Thinking Seminar",
        "Parliamentary Debate Event",
        "Rhetoric & Communication Workshop",
        "Student Debate League",
        "Current Events Discussion",
        "Persuasive Speaking Workshop",
      ],
      science: [
        "Science Fair & Exhibition",
        "Research Presentation Symposium",
        "Science Communication Workshop",
        "Laboratory Technique Training",
        "Scientific Method Workshop",
        "Innovation in Science Seminar",
        "Citizen Science Project",
        "Science & Technology Conference",
        "Research Collaboration Meeting",
        "Science Education Workshop",
      ],
      environment: [
        "Environmental Conservation Workshop",
        "Climate Change Awareness Event",
        "Sustainability Fair",
        "Green Technology Seminar",
        "Eco-Friendly Living Workshop",
        "Environmental Cleanup Day",
        "Renewable Energy Information Session",
        "Conservation Project Planning",
        "Earth Day Celebration",
        "Wildlife Protection Awareness",
      ],
      politics: [
        "Civic Engagement Workshop",
        "Voter Registration Drive",
        "Political Awareness Seminar",
        "Community Issues Forum",
        "Government Information Session",
        "Political Science Discussion",
        "Public Policy Workshop",
        "Election Information Meeting",
        "Citizen Participation Event",
        "Democracy Education Program",
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
      concert: "shapes",
      festival: "rings",
      sports: "identicon",
      fitness: "identicon",
      workshop: "thumbs",
      education: "thumbs",
      tech: "identicon",
      conference: "thumbs",
      seminar: "thumbs",
      meetup: "bottts",
      party: "rings",
      networking: "thumbs",
      food: "shapes",
      drink: "shapes",
      art: "rings",
      exhibition: "rings",
      theater: "masks",
      cinema: "shapes",
      comedy: "fun-emoji",
      charity: "thumbs",
      religious: "shapes",
      cultural: "rings",
      fashion: "rings",
      gaming: "bottts",
      travel: "identicon",
      outdoors: "shapes",
      kids: "fun-emoji",
      family: "thumbs",
      wellness: "shapes",
      health: "thumbs",
      business: "thumbs",
      entrepreneurship: "identicon",
      marketing: "thumbs",
      hackathon: "bottts",
      photography: "identicon",
      dance: "fun-emoji",
      literature: "shapes",
      poetry: "shapes",
      debate: "thumbs",
      science: "identicon",
      environment: "shapes",
      politics: "thumbs",
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
    // Changed from 20 to 200
    const organizer = random(users.filter((u) => u.role !== "user"));
    const status = random([
      "pending",
      "approved",
      "rejected",
      "cancelled",
    ] as EventStatus[]);
    const startTime = faker.date.soon({ days: 60 }); // Next 60 days
    const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000); // +2 hours
    const eventTag = random(eventTags);

    const isFree = Math.random() < 0.5;
    const price = isFree
      ? 0
      : parseFloat(faker.commerce.price({ min: 1, max: 500 }));

    const event = await prisma.event.create({
      data: {
        id: uuidv4(),
        title: getEventTitle(eventTag),
        slug: faker.helpers
          .slugify(faker.lorem.words(3) + "-" + i)
          .toLowerCase(),
        description: faker.lorem.paragraphs(2),
        location: faker.location.city(),
        capacity: faker.number.int({ min: 50, max: 500 }),
        price,
        isFree,
        startTime,
        endTime,
        date: startTime, // Add date field, using startTime as the event date
        tag: eventTag,
        imageUrl: getEventImageUrl(eventTag, getEventTitle(eventTag)), // Pass both tag and title
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
