import Image from "next/image";
import StackedAvatar from "../../components/StackedAvatar";
import {
  Award,
  Calendar,
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  Clock,
  Coffee,
  Heart,
  Mail,
  MapPin,
  Presentation,
  Receipt,
  Share2,
  Smartphone,
  Ticket,
  User,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function page() {
  const users = [
    {
      id: 1,
      name: "Med Lemin",
      image: "/user-profile.jpg",
      eventsNum: 5,
    },
    {
      id: 2,
      name: "Abdellahi",
      image: "/user-2.jpg",
      eventsNum: 7,
    },
    {
      id: 3,
      name: "Mariem",
      image: "/user-3.jpg",
      eventsNum: 20,
    },
    {
      id: 4,
      name: "Hamety",
      image: "/user-4.jpg",
      eventsNum: 30,
    },
    {
      id: 5,
      name: "Aicha",
      image: "/user-5.jpg",
      eventsNum: 30,
    },
    {
      id: 6,
      name: "Vadel",
      image: "/user-6.jpg",
      eventsNum: 30,
    },
  ];

  return (
    <div className="min-h-screen ">
      {/* mobile */}
      <div className="md:hidden">
        <div className="h-[50%] sm:h-[66%] w-full relative">
          <div className="relative z-10 top-3 px-4 flex items-center justify-between">
            <button className="p-2 border-2 border-none rounded-full bg-card hover:shadow-xs hover:bg-muted active:translate-x-[2px] active:translate-y-[2px]">
              <ChevronLeft className="w-4 h-4 " />
            </button>
            <button className="p-2 border-2 border-none rounded-full bg-card hover:shadow-xs hover:bg-muted active:translate-x-[2px] active:translate-y-[2px]">
              <Share2 className="w-4 h-4 " />
            </button>
          </div>
          <Image
            className="h-full object-cover rounded-xl"
            fill
            src={"/one-piece-poster.png"}
            alt="image"
          />
          <div className="bg-black/50 inset-0 absolute rounded-xl"></div>
          <div className="z-10 h-full relative gap-y-1 flex flex-col items-center justify-end bottom-3">
            <div>
              <Image
                className="rounded-full aspect-square border-4 border-primary"
                width={128}
                height={128}
                src={"/one-piece-poster.png"}
                alt="image"
              />
            </div>
            <h2 className="text-sm font-semibold text-white">
              TEDx Nouakchott
            </h2>
            <p className="line-clamp-4 text-[13px] text-muted/80 text-center break-words overflow-hidden text-ellipsis max-w-[300px]">
              TEDx Nouakchott 2025 brings together inspiring voices to share
              ideas that spark change and celebrate local innovation. Join us to
              explore how individual actions can shape a brighter future.
            </p>
            <StackedAvatar className="border-1 border-black" />
            <div className=" gap-x-2 bg-background rounded-[8px] p-2 flex items-center justify-around">
              <div className="flex items-center gap-x-1">
                <CalendarRange className="w-3.5 h-3.5 " />
                <span className="text-xs">29 Aug 2025</span>
              </div>
              <div className="flex items-center gap-x-1">
                <Clock className="w-3.5 h-3.5 " />
                <span className="text-xs">10:00 AM</span>
              </div>
              <div className="flex items-center gap-x-1">
                <Ticket className="w-3.5 h-3.5 " />
                <span className="text-xs">Free</span>
              </div>
            </div>
          </div>
        </div>

        <Tabs className="mt-3 " defaultValue="Schedule">
          <TabsList className="flex justify-center w-full">
            <TabsTrigger value="Schedule"> Schedule</TabsTrigger>
            <TabsTrigger value="About">About</TabsTrigger>
            <TabsTrigger value="Participants">Participants</TabsTrigger>
          </TabsList>
          <TabsContent value="Schedule">
            <div className="flex flex-col space-y-3 px-4 py-2">
              {/* Item 1 */}
              <div className="relative pl-6 border-l-2 border-primary">
                <div className="absolute -left-[10px] top-2 w-4 h-4 rounded-full bg-primary"></div>
                <div className="flex flex-col bg-card border shadow-sm rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-semibold">Opening Talk</h3>
                    <div className="flex items-center gap-x-1 text-muted-foreground text-xs">
                      <Clock className="w-3.5 h-3.5" />
                      <span>08:00 - 08:30</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Kick-off the event with inspiring words and an overview of
                    the day.
                  </p>
                </div>
              </div>

              {/* Item 2 (example) */}
              <div className="relative pl-6 border-l-2 border-primary">
                <div className="absolute -left-[10px] top-2 w-4 h-4 rounded-full bg-primary"></div>
                <div className="flex flex-col bg-card border shadow-sm rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-semibold">Innovation Panel</h3>
                    <div className="flex items-center gap-x-1 text-muted-foreground text-xs">
                      <Clock className="w-3.5 h-3.5" />
                      <span>09:00 - 10:00</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Local innovators discuss how ideas can shape the future.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="About" className="px-2 sm:px-4">
            <div className="flex flex-col space-y-4 mt-4">
              {/* Description */}
              <section>
                <h2 className="text-sm font-semibold text-foreground mb-2 border-b  pb-1">
                  Description
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  TEDx Nouakchott 2025 brings together inspiring voices to share
                  ideas that spark change and celebrate local innovation. Join
                  us to explore how individual actions can shape a brighter
                  future...
                  <span className="text-secondary-foreground font-semibold hover:underline">
                    Read More
                  </span>
                </p>
              </section>

              {/* Event Details Card */}
              <div className=" ">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 bg-accent/10 rounded-md">
                    <CalendarRange className="w-4 h-4 text-accent" />
                  </div>
                  <h2 className="font-semibold text-sm text-foreground">
                    Event Details
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start bg-card gap-3 p-3 rounded-md border">
                    <div className="p-1.5 bg-accent/10 rounded-full flex-shrink-0 mt-0.5">
                      <Calendar className="w-4 h-4 text-accent" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-sm text-foreground">
                        Sunday, December 15, 2025
                      </span>
                      <span className="text-xs text-muted-foreground">
                        08:00 AM - 06:00 PM
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-background rounded-md border">
                    <div className="p-1.5 bg-accent/10 rounded-full flex-shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4 text-accent" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-sm text-foreground">
                        Dar Chbab
                      </span>
                      <span className="text-xs text-muted-foreground">
                        42H4+FJ, Nouakchott, Mauritania
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-card rounded-md border">
                    <div className="p-1.5 bg-accent/10 rounded-full flex-shrink-0 mt-0.5">
                      <Users className="w-4 h-4 text-accent" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-sm text-foreground">
                        247 attending
                      </span>
                      <span className="text-xs text-muted-foreground">
                        253 spots remaining
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-background rounded-md border">
                    <div className="p-1.5 bg-accent/10 rounded-full flex-shrink-0 mt-0.5">
                      <Receipt className="w-4 h-4 text-accent" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-sm text-foreground">
                        Free Entry
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Registration required
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Organizer Card */}
              <div className="bg-card rounded-lg border shadow-xs p-4 sm:p-5 hover:shadow-sm transition-shadow duration-200">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 bg-secondary/10 rounded-md">
                    <User className="w-4 h-4 text-secondary-foreground" />
                  </div>
                  <h2 className="font-semibold text-sm text-foreground">
                    Organized by
                  </h2>
                </div>

                <div className="flex items-start gap-4 mb-4">
                  <div className="relative">
                    <Image
                      className="rounded-full aspect-square border-2 border-primary/20"
                      width={56}
                      height={56}
                      src={"/user-profile.jpg"}
                      alt="Organizer"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-foreground mb-1">
                      Mohamed Abdellahi
                    </h3>
                    <p className="text-xs text-muted-foreground mb-2">
                      Event Organizer • 42 events hosted
                    </p>
                    <div className="flex items-center gap-1 text-xs text-accent">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      <span>Verified Organizer</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 p-3  rounded-md border">
                  <div className="flex items-center gap-3">
                    <div className="p-1 bg-primary/10 rounded-full">
                      <Mail className="w-3 h-3 text-accent" />
                    </div>
                    <span className="text-xs text-foreground">
                      contact@techevents.com
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-1 bg-primary/10 rounded-full">
                      <Smartphone className="w-3 h-3 text-accent" />
                    </div>
                    <span className="text-xs text-foreground">
                      +222 555 123-4567
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 bg-accent text-xs h-9"
                  >
                    <Mail className="w-3 h-3 mr-1" />
                    Contact
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="Participants">
            <div className="space-y-1.5">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-start gap-x-2  border rounded-lg bg-card p-2"
                >
                  <div className="relative">
                    <Image
                      className="rounded-full aspect-square border-2 border-primary/20"
                      width={40}
                      height={40}
                      src={user.image}
                      alt="Organizer"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-foreground">
                      {user.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-2">
                      {user.eventsNum} events attended
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      {/* desktop */}
      <div className="hidden mt-[100px] mb-4 mx-6 sm:grid grid-cols-3 gap-x-24 min-h-[calc(100%-128px)]">
        <div className=" col-span-2 ">
          {/* Hero Image Section - Improved */}
          <div className="relative h-[70vh] w-full rounded-xl overflow-hidden shadow-2xl">
            {/* Navigation Buttons */}
            <div className="absolute top-6 left-6 right-6 z-30 flex items-center justify-between">
              <button className="p-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-full hover:bg-white/30 transition-all duration-300 group">
                <ChevronLeft className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              </button>
              <button className="p-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-full hover:bg-white/30 transition-all duration-300 group">
                <Share2 className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              </button>
            </div>

            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                className="w-full h-full object-cover"
                src="/one-piece-poster.png"
                alt="TEDx Nouakchott Event"
              />
              {/* Improved Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent"></div>
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-0 flex flex-col justify-end items-center p-8 z-20">
              {/* Profile Image */}
              <div className="mb-6">
                <img
                  className="w-32 h-32 rounded-full border-4 border-white/30 backdrop-blur-sm object-cover shadow-xl"
                  src="/one-piece-poster.png"
                  alt="TEDx Logo"
                />
              </div>

              {/* Event Title */}
              <h1 className="text-4xl font-bold text-white mb-4 text-center">
                TEDx Nouakchott
              </h1>

              {/* Event Description */}
              <p className="text-lg text-white/90 text-center max-w-2xl mb-6 leading-relaxed">
                TEDx Nouakchott 2025 brings together inspiring voices to share
                ideas that spark change and celebrate local innovation. Join us
                to explore how individual actions can shape a brighter future.
              </p>

              {/* Participants Preview */}
              <StackedAvatar className="mb-6" />

              {/* Event Info Cards */}

              <div className="flex flex-wrap gap-4 justify-center">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 flex items-center gap-2">
                  <CalendarRange className="w-4 h-4 text-white" />
                  <span className="text-sm font-medium text-white">
                    Dec 15, 2025
                  </span>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-white" />
                  <span className="text-sm font-medium text-white">
                    08:00 AM
                  </span>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-white" />
                  <span className="text-sm font-medium text-white">Free</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-4 mt-4">
            {/* Description */}
            <section>
              <h2 className="text-sm font-semibold text-foreground mb-2 border-b  pb-1">
                Description
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                TEDx Nouakchott 2025 brings together inspiring voices to share
                ideas that spark change and celebrate local innovation. Join us
                to explore how individual actions can shape a brighter future...
                <span className="text-secondary-foreground font-semibold hover:underline">
                  Read More
                </span>
              </p>
            </section>

            {/* Event Details Card */}
            <div className=" ">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-accent/10 rounded-md">
                  <CalendarRange className="w-4 h-4 text-accent" />
                </div>
                <h2 className="font-semibold text-sm text-foreground">
                  Event Details
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start bg-card gap-3 p-3 rounded-md border">
                  <div className="p-1.5 bg-accent/10 rounded-full flex-shrink-0 mt-0.5">
                    <Calendar className="w-4 h-4 text-accent" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-semibold text-sm text-foreground">
                      Sunday, December 15, 2025
                    </span>
                    <span className="text-xs text-muted-foreground">
                      08:00 AM - 06:00 PM
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-background rounded-md border">
                  <div className="p-1.5 bg-accent/10 rounded-full flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-accent" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-semibold text-sm text-foreground">
                      Dar Chbab
                    </span>
                    <span className="text-xs text-muted-foreground">
                      42H4+FJ, Nouakchott, Mauritania
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-background rounded-md border">
                  <div className="p-1.5 bg-accent/10 rounded-full flex-shrink-0 mt-0.5">
                    <Receipt className="w-4 h-4 text-accent" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-semibold text-sm text-foreground">
                      Free Entry
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Registration required
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-card rounded-md border">
                  <div className="p-1.5 bg-accent/10 rounded-full flex-shrink-0 mt-0.5">
                    <Users className="w-4 h-4 text-accent" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-semibold text-sm text-foreground">
                      247 attending
                    </span>
                    <span className="text-xs text-muted-foreground">
                      253 spots remaining
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Organizer Card */}
            <div className="bg-card rounded-lg border shadow-xs p-4 sm:p-5 hover:shadow-sm transition-shadow duration-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-secondary/10 rounded-md">
                  <User className="w-4 h-4 text-secondary-foreground" />
                </div>
                <h2 className="font-semibold text-sm text-foreground">
                  Organized by
                </h2>
              </div>

              <div className="flex items-start gap-4 mb-4">
                <div className="relative">
                  <Image
                    className="rounded-full aspect-square border-2 border-primary/20"
                    width={56}
                    height={56}
                    src={"/user-profile.jpg"}
                    alt="Organizer"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-foreground mb-1">
                    Mohamed Abdellahi
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    Event Organizer • 42 events hosted
                  </p>
                  <div className="flex items-center gap-1 text-xs text-accent">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span>Verified Organizer</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 p-3  rounded-md border">
                <div className="flex items-center gap-3">
                  <div className="p-1 bg-primary/10 rounded-full">
                    <Mail className="w-3 h-3 text-accent" />
                  </div>
                  <span className="text-xs text-foreground">
                    contact@techevents.com
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-1 bg-primary/10 rounded-full">
                    <Smartphone className="w-3 h-3 text-accent" />
                  </div>
                  <span className="text-xs text-foreground">
                    +222 555 123-4567
                  </span>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 bg-accent text-xs h-9"
                >
                  <Mail className="w-3 h-3 mr-1" />
                  Contact
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="fixed top-[100px] right-6 w-1/3 h-[calc(100vh-100px)]  grid grid-rows-2 gap-4">
          <div className=" bg-white p-4  rounded-lg border overflow-y-auto">
            <h2 className="text-lg font-semibold mb-2">Participants</h2>
            <div className="space-y-1.5 grid grid-cols-2 items-start gap-2">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-start gap-x-2  border rounded-lg bg-card p-2"
                >
                  <div className="relative">
                    <Image
                      className="rounded-full aspect-square border-2 border-primary/20"
                      width={40}
                      height={40}
                      src={user.image}
                      alt="Organizer"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-foreground">
                      {user.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-2">
                      {user.eventsNum} events attended
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className=" border mb-3 p-4 rounded-lg mt-4  overflow-y-auto">
            <h2 className="text-lg font-semibold mb-2">Schedule</h2>
            <div className="">
              <div className="flex flex-col space-y-3 px-4 py-2">
                {/* Item 1 */}
                <div className="relative pl-6 border-l-2 border-primary">
                  <div className="absolute -left-[10px] top-2 w-4 h-4 rounded-full bg-primary"></div>
                  <div className="flex flex-col bg-card border shadow-sm rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-semibold">Opening Talk</h3>
                      <div className="flex items-center gap-x-1 text-muted-foreground text-xs">
                        <Clock className="w-3.5 h-3.5" />
                        <span>08:00 - 08:30</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Kick-off the event with inspiring words and an overview of
                      the day.
                    </p>
                  </div>
                </div>

                {/* Item 2 (example) */}
                <div className="relative pl-6 border-l-2 border-primary">
                  <div className="absolute -left-[10px] top-2 w-4 h-4 rounded-full bg-primary"></div>
                  <div className="flex flex-col bg-card border shadow-sm rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-semibold">
                        Innovation Panel
                      </h3>
                      <div className="flex items-center gap-x-1 text-muted-foreground text-xs">
                        <Clock className="w-3.5 h-3.5" />
                        <span>09:00 - 10:00</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Local innovators discuss how ideas can shape the future.
                    </p>
                  </div>
                </div>
                {/* Item 3 */}
                <div className="relative pl-6 border-l-2 border-primary">
                  <div className="absolute -left-[10px] top-2 w-4 h-4 rounded-full bg-primary"></div>
                  <div className="flex flex-col bg-card border shadow-sm rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-semibold">
                        Networking Break
                      </h3>
                      <div className="flex items-center gap-x-1 text-muted-foreground text-xs">
                        <Clock className="w-3.5 h-3.5" />
                        <span>10:00 - 10:30</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Attendees connect over coffee and refreshments.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
