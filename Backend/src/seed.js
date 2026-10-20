import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "./models/user.models.js";
import { Video } from "./models/video.models.js";
import { Comment } from "./models/comment.models.js";
import { Tweet } from "./models/tweet.models.js";
import { Playlist } from "./models/playlist.models.js";
import { Subscription } from "./models/subscription.models.js";
import { Like } from "./models/like.models.js";
import connectDB from "./db/index.js";

dotenv.config();

const sampleVideos = [
  {
    title: "Complete JavaScript Full Course for Beginners to Advanced",
    description: "Learn JavaScript in depth with hands-on real world projects, DOM manipulation, asynchronous programming, event loops, closures, and modern ES6+ features in this comprehensive masterclass.",
    videoFile: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    thumbnail: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&auto=format&fit=crop&q=80",
    duration: 596,
    views: 14200,
    isPublished: true,
  },
  {
    title: "Mastering React 19: Hooks, Server Components & State Management",
    description: "A deep dive into the modern React ecosystem. Understand useActionState, optimistic updates, Suspense, custom hooks, and scalable component architecture.",
    videoFile: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80",
    duration: 653,
    views: 8900,
    isPublished: true,
  },
  {
    title: "Production Ready Backend with Node.js, Express & MongoDB",
    description: "Everything you need to know about building scalable APIs: JWT auth, aggregate pipelines, schema design, cookies, CORS, file uploads with Cloudinary, and error handling.",
    videoFile: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&auto=format&fit=crop&q=80",
    duration: 15,
    views: 21500,
    isPublished: true,
  },
  {
    title: "Tailwind CSS Tutorial: Build Beautiful UIs at Lightning Speed",
    description: "Learn how to use Tailwind CSS utility classes, custom themes, dark mode configuration, responsive design, animations, and reusable UI components.",
    videoFile: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    thumbnail: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80",
    duration: 15,
    views: 6400,
    isPublished: true,
  },
  {
    title: "Understanding MongoDB Aggregation Framework with Real-World Pipelines",
    description: "Master $lookup, $unwind, $group, $addFields, $facet, and $project. Learn how to write complex nested queries for real-time video analytics and feeds.",
    videoFile: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    thumbnail: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=80",
    duration: 60,
    views: 11200,
    isPublished: true,
  },
  {
    title: "Full Stack Authentication Masterclass: JWT, Refresh Tokens & Cookies",
    description: "Learn the difference between Access Tokens and Refresh Tokens. How to store them securely using HTTP-only cookies and implement silent token rotation.",
    videoFile: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
    duration: 15,
    views: 18400,
    isPublished: true,
  },
];

const seedDB = async () => {
  try {
    await connectDB();
    console.log("Connected to MongoDB for seeding...");

    let users = await User.find();
    if (!users.length) {
      const demoUser = await User.create({
        username: "hiteshchoudhary",
        email: "hitesh@chaicode.com",
        fullName: "Hitesh Choudhary",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
        coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
        password: "Password@123",
      });
      users = [demoUser];
    }

    const videoCount = await Video.countDocuments();
    if (videoCount === 0) {
      console.log("Seeding sample videos...");
      const createdVideos = [];
      for (let i = 0; i < sampleVideos.length; i++) {
        const vidData = sampleVideos[i];
        const owner = users[i % users.length]._id;
        const vid = await Video.create({
          ...vidData,
          owner,
        });
        createdVideos.push(vid);

        // Add sample comment
        await Comment.create({
          content: "Great video! The explanation was concise and very clear. 🔥",
          video: vid._id,
          owner: users[0]._id,
        });
      }

      // Sample tweet
      await Tweet.create({
        content: "Welcome to our VideoTube clone built with MERN Stack! Check out our new video series.",
        owner: users[0]._id,
      });

      // Sample playlist
      await Playlist.create({
        name: "Full Stack Mastery",
        description: "Curated videos for full stack web development",
        videos: createdVideos.map((v) => v._id),
        owner: users[0]._id,
      });

      console.log(`Successfully seeded ${createdVideos.length} videos, comments, and playlist!`);
    } else {
      console.log(`Database already has ${videoCount} videos.`);
    }

    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedDB();
