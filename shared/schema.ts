import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
export * from "./models/auth";

export const siteConfig = pgTable("site_config", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(), // e.g., "phone", "email", "tagline"
  value: text("value").notNull(),
});

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  grade: text("grade").notNull(), // "6-8", "9-10", "11-12", "Board", "Competitive"
  subjects: text("subjects").notNull(), // "Maths, Science"
  imageUrl: text("image_url"),
});

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(), // "Student", "Parent"
  content: text("content").notNull(),
  rating: integer("rating").notNull().default(5),
  approved: boolean("approved").default(false),
});

export const gallery = pgTable("gallery", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(), // "Classroom", "Events", "Results"
});

export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  importance: text("importance").default("normal"), // "normal", "high", "critical"
  startDate: timestamp("start_date").defaultNow(),
  expiryDate: timestamp("expiry_date"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const successStories = pgTable("success_stories", {
  id: serial("id").primaryKey(),
  studentName: text("student_name").notNull(),
  year: integer("year").notNull(),
  exam: text("exam").notNull(), // "IIT-JEE", "NEET", "CUET", "Board"
  achievement: text("achievement").notNull(), // "Rank 1", "99.5%", etc
  description: text("description"),
  photoUrl: text("photo_url"),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const careerApplications = pgTable("career_applications", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  subject: text("subject").notNull(),
  experience: text("experience").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  resumeUrl: text("resume_url").notNull(),
  status: text("status").notNull().default("pending"), // "pending", "shortlisted", "rejected"
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const directorMessage = pgTable("director_message", {
  id: serial("id").primaryKey(),
  directorName: text("director_name").notNull(),
  message: text("message").notNull(),
  photoUrl: text("photo_url"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  grade: text("grade"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const faculty = pgTable("faculty", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(), // "Senior Physics Faculty"
  qualification: text("qualification"),
  imageUrl: text("image_url"),
  bio: text("bio"),
});

// Zod Schemas
export const insertSiteConfigSchema = createInsertSchema(siteConfig).omit({ id: true });
export const insertCourseSchema = createInsertSchema(courses).omit({ id: true });
export const insertTestimonialSchema = createInsertSchema(testimonials).omit({ id: true });
export const insertGallerySchema = createInsertSchema(gallery).omit({ id: true });
export const insertAnnouncementSchema = createInsertSchema(announcements).omit({ id: true, createdAt: true, updatedAt: true });
export const insertSuccessStorySchema = createInsertSchema(successStories).omit({ id: true, createdAt: true, updatedAt: true });
export const insertCareerApplicationSchema = createInsertSchema(careerApplications).omit({ id: true, createdAt: true, updatedAt: true });
export const insertDirectorMessageSchema = createInsertSchema(directorMessage).omit({ id: true, updatedAt: true });
export const insertContactSchema = createInsertSchema(contacts).omit({ id: true, createdAt: true });
export const insertFacultySchema = createInsertSchema(faculty).omit({ id: true });

// Types
export type SiteConfig = typeof siteConfig.$inferSelect;
export type InsertSiteConfig = z.infer<typeof insertSiteConfigSchema>;

export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;

export type GalleryItem = typeof gallery.$inferSelect;
export type InsertGalleryItem = z.infer<typeof insertGallerySchema>;

export type Announcement = typeof announcements.$inferSelect;
export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;

export type SuccessStory = typeof successStories.$inferSelect;
export type InsertSuccessStory = z.infer<typeof insertSuccessStorySchema>;

export type CareerApplication = typeof careerApplications.$inferSelect;
export type InsertCareerApplication = z.infer<typeof insertCareerApplicationSchema>;

export type DirectorMessage = typeof directorMessage.$inferSelect;
export type InsertDirectorMessage = z.infer<typeof insertDirectorMessageSchema>;

export type ContactMessage = typeof contacts.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactSchema>;

export type Faculty = typeof faculty.$inferSelect;
export type InsertFaculty = z.infer<typeof insertFacultySchema>;
