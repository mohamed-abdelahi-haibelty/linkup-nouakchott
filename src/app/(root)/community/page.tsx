// "use client";
// import React, { useState } from "react";
// import {
//   Plus,
//   Clock,
//   MapPin,
//   Calendar,
//   Users,
//   Share2,
//   MoreHorizontal,
//   X,
//   Upload,
// } from "lucide-react";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// const CommunityPage = () => {
//   const [showUploadModal, setShowUploadModal] = useState(false);
//   const [expandedPosts, setExpandedPosts] = useState(new Set());
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     date: "",
//     time: "",
//     location: "",
//     category: "conference",
//     posterImage: null,
//     posterPreview: null,
//   });

//   const toggleExpanded = (postId: any) => {
//     const newExpanded = new Set(expandedPosts);
//     if (newExpanded.has(postId)) {
//       newExpanded.delete(postId);
//     } else {
//       newExpanded.add(postId);
//     }
//     setExpandedPosts(newExpanded);
//   };

//   const handleInputChange = (e: any) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleImageUpload = (e: any) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         setFormData({
//           ...formData,
//           posterImage: file,
//           posterPreview: event.target.result,
//         });
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const removeImage = () => {
//     setFormData({
//       ...formData,
//       posterImage: null,
//       posterPreview: null,
//     });
//   };

//   const handleSubmit = () => {
//     console.log("Form submitted:", formData);
//     setShowUploadModal(false);
//     setFormData({
//       title: "",
//       description: "",
//       date: "",
//       time: "",
//       location: "",
//       category: "conference",
//       posterImage: null,
//       posterPreview: null,
//     });
//   };

//   const posts = [
//     {
//       id: 1,
//       username: "Med Lemin",
//       avatar: "user-4.jpg",
//       timestamp: "2h ago",
//       title: "AI & Machine Learning Summit 2025",
//       description:
//         "Join us for an incredible day of learning about artificial intelligence and machine learning. This summit will feature industry leaders, cutting-edge research presentations, and networking opportunities with professionals from around the world. Whether you're a beginner or an expert, there's something for everyone. We'll cover topics like neural networks, deep learning, computer vision, and much more. Don't miss this opportunity to expand your knowledge and connect with like-minded individuals.",
//       date: "Dec 20, 2025",
//       time: "09:00 AM",
//       location: "Nouakchott Convention Center",
//       category: "conference",
//       attendees: 45,
//       posterImage: "user-profile.jpg",
//     },
//     {
//       id: 2,
//       username: "Abdellahi",
//       avatar: "user-7.jpg",
//       timestamp: "4h ago",
//       title: "Local Startup Showcase",
//       description:
//         "Come discover the most innovative startups in our community! This event will showcase local entrepreneurs and their groundbreaking ideas. Perfect networking opportunity for investors, mentors, and fellow entrepreneurs.",
//       date: "Dec 18, 2025",
//       time: "06:00 PM",
//       location: "Innovation Hub",
//       category: "networking",
//       attendees: 28,
//       posterImage: "user-4.jpg",
//     },
//     {
//       id: 3,
//       username: "Mariem",
//       avatar: "user-5.jpg",
//       timestamp: "1d ago",
//       title: "Photography Workshop: Portrait Lighting",
//       description:
//         "Learn the fundamentals of portrait lighting in this hands-on workshop. We'll cover natural light, studio setups, and creative techniques to make your portraits stand out.",
//       date: "Dec 22, 2025",
//       time: "02:00 PM",
//       location: "Creative Studios",
//       category: "workshop",
//       attendees: 12,
//       posterImage:
//         "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400&h=600&fit=crop",
//     },
//     {
//       id: 4,
//       username: "Hamety",
//       avatar: "/user-6.jpg",
//       timestamp: "2d ago",
//       title: "Digital Marketing Masterclass",
//       description:
//         "Master the art of digital marketing in this comprehensive workshop. Learn about SEO, social media marketing, content strategy, and analytics.",
//       date: "Dec 25, 2025",
//       time: "10:00 AM",
//       location: "Business Center",
//       category: "workshop",
//       attendees: 33,
//     },
//   ];

//   const getCategoryColor = (category: string) => {
//     switch (category) {
//       case "conference":
//         return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
//       case "networking":
//         return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
//       case "workshop":
//         return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300";
//       case "seminar":
//         return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
//       case "social":
//         return "bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300";
//       default:
//         return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
//     }
//   };

//   return (
//     <div
//       className="min-h-screen text-foreground"
//       style={{
//         backgroundColor: "var(--background)",
//         color: "var(--foreground)",
//       }}
//     >
//       {/* Header */}
//       <header
//         className="sticky top-0 z-40 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background/60"
//         style={{
//           backgroundColor: "var(--background)",
//           borderColor: "var(--border)",
//         }}
//       >
//         <div className="container flex h-14 items-center px-4 max-w-2xl mx-auto">
//           <h1 className="text-xl font-semibold">Community</h1>
//           <div className="ml-auto">
//             <button
//               onClick={() => setShowUploadModal(true)}
//               className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 gap-2"
//               style={{
//                 backgroundColor: "var(--primary)",
//                 color: "var(--primary-foreground)",
//                 boxShadow: "var(--shadow)",
//               }}
//             >
//               <Plus className="h-4 w-4" />
//               <span className="hidden sm:inline">Post Event</span>
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="container px-4 py-6 max-w-lg mx-auto">
//         <div className="space-y-6">
//           {posts.map((post) => {
//             const isExpanded = expandedPosts.has(post.id);
//             const shouldTruncate = post.description.length > 150;
//             const displayText =
//               !shouldTruncate || isExpanded
//                 ? post.description
//                 : post.description.slice(0, 150) + "...";

//             return (
//               <div
//                 key={post.id}
//                 className="rounded-lg border p-6"
//                 style={{
//                   backgroundColor: "var(--card)",
//                   color: "var(--card-foreground)",
//                   borderColor: "var(--border)",
//                   boxShadow: "var(--shadow-sm)",
//                 }}
//               >
//                 {/* Header */}
//                 <div className="flex items-start justify-between mb-4">
//                   <div className="flex items-center gap-3">
//                     <img
//                       src={post.avatar}
//                       alt={post.username}
//                       className="w-10 h-10 rounded-full object-cover"
//                     />
//                     <div>
//                       <h3 className="font-semibold text-sm">{post.username}</h3>
//                       <p
//                         className="text-xs"
//                         style={{ color: "var(--muted-foreground)" }}
//                       >
//                         {post.timestamp}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300">
//                       Unverified
//                     </span>
//                     {/* <button
//                       className="p-1 rounded-full hover:opacity-80 transition-opacity"
//                       style={{ backgroundColor: "var(--accent)" }}
//                     >
//                       <MoreHorizontal className="h-4 w-4" />
//                     </button> */}
//                     <button
//                       className="p-1.5 rounded-full hover:opacity-80 transition-opacity"
//                       style={{ backgroundColor: "var(--accent)" }}
//                     >
//                       <Share2 className="h-4 w-4" />
//                     </button>
//                   </div>
//                 </div>

//                 {/* Event Title */}
//                 <h2 className="text-lg font-semibold mb-2">{post.title}</h2>

//                 {/* Category */}
//                 <span
//                   className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium mb-3 ${getCategoryColor(
//                     post.category
//                   )}`}
//                 >
//                   {post.category}
//                 </span>

//                 {/* Poster Image */}
//                 {post.posterImage && (
//                   <div
//                     className="mb-4 rounded-lg overflow-hidden"
//                     style={{ boxShadow: "var(--shadow-sm)" }}
//                   >
//                     <img
//                       src={post.posterImage}
//                       alt={`${post.title} poster`}
//                       className="w-full h-64 sm:h-80 object-cover cursor-pointer hover:opacity-95 transition-opacity"
//                       onClick={() => window.open(post.posterImage, "_blank")}
//                     />
//                   </div>
//                 )}

//                 {/* Description */}
//                 <p
//                   className="text-sm mb-4 leading-relaxed"
//                   style={{ color: "var(--muted-foreground)" }}
//                 >
//                   {displayText}
//                   {shouldTruncate && (
//                     <button
//                       onClick={() => toggleExpanded(post.id)}
//                       className="ml-1 font-medium hover:underline"
//                       style={{ color: "var(--primary)" }}
//                     >
//                       {isExpanded ? "See less" : "See more"}
//                     </button>
//                   )}
//                 </p>

//                 {/* Event Details */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
//                   <div
//                     className="flex items-center gap-2 text-sm"
//                     style={{ color: "var(--muted-foreground)" }}
//                   >
//                     <Calendar className="h-4 w-4" />
//                     <span>{post.date}</span>
//                   </div>
//                   <div
//                     className="flex items-center gap-2 text-sm"
//                     style={{ color: "var(--muted-foreground)" }}
//                   >
//                     <Clock className="h-4 w-4" />
//                     <span>{post.time}</span>
//                   </div>
//                   <div
//                     className="flex items-center gap-2 text-sm sm:col-span-2"
//                     style={{ color: "var(--muted-foreground)" }}
//                   >
//                     <MapPin className="h-4 w-4" />
//                     <span>{post.location}</span>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </main>

//       {/* Upload Modal */}
//       {showUploadModal && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
//           style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
//         >
//           <div
//             className="w-full max-w-md rounded-lg border max-h-[90vh] overflow-y-auto"
//             style={{
//               backgroundColor: "var(--card)",
//               borderColor: "var(--border)",
//               boxShadow: "var(--shadow-lg)",
//             }}
//           >
//             <div
//               className="flex items-center justify-between p-6 border-b"
//               style={{ borderColor: "var(--border)" }}
//             >
//               <h2 className="text-lg font-semibold">Post New Event</h2>
//               <button
//                 onClick={() => setShowUploadModal(false)}
//                 className="p-1 rounded-full hover:opacity-80 transition-opacity"
//                 style={{ backgroundColor: "var(--accent)" }}
//               >
//                 <X className="h-4 w-4" />
//               </button>
//             </div>

//             <div className="p-6 space-y-4">
//               {/* Poster Image Upload */}
//               <div>
//                 <Label className="block text-sm font-medium mb-2">
//                   Event Poster
//                 </Label>
//                 {formData.posterPreview ? (
//                   <div className="relative">
//                     <img
//                       src={formData.posterPreview}
//                       alt="Poster preview"
//                       className="w-full h-48 object-cover rounded-lg"
//                       style={{ boxShadow: "var(--shadow-sm)" }}
//                     />
//                     <button
//                       onClick={removeImage}
//                       className="absolute top-2 right-2 p-1 rounded-full text-white bg-black/50 hover:bg-black/70 transition-colors"
//                     >
//                       <X className="h-4 w-4" />
//                     </button>
//                   </div>
//                 ) : (
//                   <div className="relative">
//                     <Input
//                       type="file"
//                       id="poster"
//                       accept="image/*"
//                       onChange={handleImageUpload}
//                       className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                     />
//                     <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-lg cursor-pointer hover:opacity-80 transition-opacity">
//                       <Upload
//                         className="h-8 w-8 mb-2"
//                         style={{ color: "var(--muted-foreground)" }}
//                       />
//                       <p
//                         className="text-sm font-medium"
//                         style={{ color: "var(--muted-foreground)" }}
//                       >
//                         Click to upload poster
//                       </p>
//                       <p
//                         className="text-xs mt-1"
//                         style={{ color: "var(--muted-foreground)" }}
//                       >
//                         PNG, JPG up to 10MB
//                       </p>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <div>
//                 <Label
//                   htmlFor="title"
//                   className="block text-sm font-medium mb-2"
//                 >
//                   Event Title *
//                 </Label>
//                 <Input
//                   type="text"
//                   id="title"
//                   name="title"
//                   value={formData.title}
//                   onChange={handleInputChange}
//                   className="flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
//                   placeholder="Enter event title"
//                   required
//                 />
//               </div>

//               <div>
//                 <Label
//                   htmlFor="category"
//                   className="block text-sm font-medium mb-2"
//                 >
//                   Category
//                 </Label>
//                 <Select name="category" value={formData.category}>
//                   <SelectTrigger className="w-full">
//                     <SelectValue placeholder="Select Category" />
//                   </SelectTrigger>
//                   <SelectContent className="w-full">
//                     <SelectItem value="conference">Conference</SelectItem>
//                     <SelectItem value="networking">Networking</SelectItem>
//                     <SelectItem value="workshop">Workshop</SelectItem>
//                     <SelectItem value="seminar">Seminar</SelectItem>
//                     <SelectItem value="social">Social</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div>
//                 <Label
//                   htmlFor="description"
//                   className="block text-sm font-medium mb-2"
//                 >
//                   Description *
//                 </Label>
//                 <Textarea
//                   id="description"
//                   name="description"
//                   value={formData.description}
//                   onChange={handleInputChange}
//                   rows={4}
//                   className="flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
//                   placeholder="Describe your event..."
//                   required
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <Label
//                     htmlFor="date"
//                     className="block text-sm font-medium mb-2"
//                   >
//                     Date *
//                   </Label>
//                   <Input
//                     type="date"
//                     id="date"
//                     name="date"
//                     value={formData.date}
//                     onChange={handleInputChange}
//                     className="flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <Label
//                     htmlFor="time"
//                     className="block text-sm font-medium mb-2"
//                   >
//                     Time *
//                   </Label>
//                   <Input
//                     type="time"
//                     id="time"
//                     name="time"
//                     value={formData.time}
//                     onChange={handleInputChange}
//                     className="flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
//                     required
//                   />
//                 </div>
//               </div>

//               <div>
//                 <Label
//                   htmlFor="location"
//                   className="block text-sm font-medium mb-2"
//                 >
//                   Location *
//                 </Label>
//                 <Input
//                   type="text"
//                   id="location"
//                   name="location"
//                   value={formData.location}
//                   onChange={handleInputChange}
//                   className="flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
//                   //   style={{
//                   //     backgroundColor: "var(--background)",
//                   //     borderColor: "var(--input)",
//                   //     color: "var(--foreground)",
//                   //   }}
//                   placeholder="Enter event location"
//                   required
//                 />
//               </div>

//               <div
//                 className="rounded-md p-3 text-sm"
//                 style={{
//                   backgroundColor: "var(--muted)",
//                   color: "var(--muted-foreground)",
//                 }}
//               >
//                 <p className="font-medium text-orange-600 dark:text-orange-400 mb-1">
//                   Note:
//                 </p>
//                 <p>
//                   Community posts are marked as "Unverified" since you're not
//                   the official event organizer. The event details will need
//                   verification by our team.
//                 </p>
//               </div>

//               <div className="flex gap-3 pt-4">
//                 <button
//                   type="button"
//                   onClick={() => setShowUploadModal(false)}
//                   className="flex-1 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 border h-10 px-4 py-2 hover:opacity-80"
//                   style={{
//                     backgroundColor: "var(--background)",
//                     borderColor: "var(--input)",
//                     color: "var(--foreground)",
//                   }}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleSubmit}
//                   className="flex-1 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 hover:opacity-90"
//                   style={{
//                     backgroundColor: "var(--primary)",
//                     color: "var(--primary-foreground)",
//                     boxShadow: "var(--shadow)",
//                   }}
//                 >
//                   Post Event
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CommunityPage;

import React from "react";

function CommunityPage() {
  return <div>Coomunity</div>;
}

export default CommunityPage;
