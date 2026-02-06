import { db } from "./db";
import {
  siteConfig, courses, testimonials, gallery, announcements, successStories, careerApplications, directorMessage, contacts, faculty,
  type InsertSiteConfig, type SiteConfig,
  type InsertCourse, type Course,
  type InsertTestimonial, type Testimonial,
  type InsertGalleryItem, type GalleryItem,
  type InsertAnnouncement, type Announcement,
  type InsertSuccessStory, type SuccessStory,
  type InsertCareerApplication, type CareerApplication,
  type InsertDirectorMessage, type DirectorMessage,
  type InsertContactMessage, type ContactMessage,
  type InsertFaculty, type Faculty
} from "@shared/schema";
import { eq, desc, lte, gte } from "drizzle-orm";

export interface IStorage {
  // Site Config
  getSiteConfig(): Promise<SiteConfig[]>;
  getSiteConfigByKey(key: string): Promise<SiteConfig | undefined>;
  upsertSiteConfig(config: InsertSiteConfig): Promise<SiteConfig>;

  // Courses
  getCourses(): Promise<Course[]>;
  getCourse(id: number): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourse(id: number, course: Partial<InsertCourse>): Promise<Course>;
  deleteCourse(id: number): Promise<void>;

  // Testimonials
  getTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  updateTestimonial(id: number, testimonial: Partial<InsertTestimonial>): Promise<Testimonial>;
  deleteTestimonial(id: number): Promise<void>;

  // Gallery
  getGalleryItems(): Promise<GalleryItem[]>;
  createGalleryItem(item: InsertGalleryItem): Promise<GalleryItem>;
  deleteGalleryItem(id: number): Promise<void>;

  // Announcements
  getAnnouncements(): Promise<Announcement[]>;
  getActiveAnnouncements(): Promise<Announcement[]>;
  createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;
  updateAnnouncement(id: number, announcement: Partial<InsertAnnouncement>): Promise<Announcement>;
  deleteAnnouncement(id: number): Promise<void>;

  // Success Stories
  getSuccessStories(): Promise<SuccessStory[]>;
  getLatestSuccessStories(limit: number): Promise<SuccessStory[]>;
  getSuccessStory(id: number): Promise<SuccessStory | undefined>;
  createSuccessStory(story: InsertSuccessStory): Promise<SuccessStory>;
  updateSuccessStory(id: number, story: Partial<InsertSuccessStory>): Promise<SuccessStory>;
  deleteSuccessStory(id: number): Promise<void>;

  // Career Applications
  getCareerApplications(): Promise<CareerApplication[]>;
  getCareerApplication(id: number): Promise<CareerApplication | undefined>;
  createCareerApplication(app: InsertCareerApplication): Promise<CareerApplication>;
  updateCareerApplication(id: number, app: Partial<InsertCareerApplication>): Promise<CareerApplication>;
  deleteCareerApplication(id: number): Promise<void>;

  // Director Message
  getDirectorMessage(): Promise<DirectorMessage | undefined>;
  upsertDirectorMessage(message: Partial<InsertDirectorMessage>): Promise<DirectorMessage>;

  // Contacts
  getContacts(): Promise<ContactMessage[]>;
  createContact(contact: InsertContactMessage): Promise<ContactMessage>;

  // Faculty
  getFaculty(): Promise<Faculty[]>;
  createFaculty(faculty: InsertFaculty): Promise<Faculty>;
  updateFaculty(id: number, faculty: Partial<InsertFaculty>): Promise<Faculty>;
  deleteFaculty(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Site Config
  async getSiteConfig(): Promise<SiteConfig[]> {
    return await db.select().from(siteConfig);
  }

  async getSiteConfigByKey(key: string): Promise<SiteConfig | undefined> {
    const [config] = await db.select().from(siteConfig).where(eq(siteConfig.key, key));
    return config;
  }

  async upsertSiteConfig(config: InsertSiteConfig): Promise<SiteConfig> {
    const [existing] = await db.select().from(siteConfig).where(eq(siteConfig.key, config.key));
    if (existing) {
      const [updated] = await db.update(siteConfig)
        .set({ value: config.value })
        .where(eq(siteConfig.id, existing.id))
        .returning();
      return updated;
    }
    const [created] = await db.insert(siteConfig).values(config).returning();
    return created;
  }

  // Courses
  async getCourses(): Promise<Course[]> {
    return await db.select().from(courses);
  }

  async getCourse(id: number): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course;
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const [newCourse] = await db.insert(courses).values(course).returning();
    return newCourse;
  }

  async updateCourse(id: number, updates: Partial<InsertCourse>): Promise<Course> {
    const [updated] = await db.update(courses).set(updates).where(eq(courses.id, id)).returning();
    return updated;
  }

  async deleteCourse(id: number): Promise<void> {
    await db.delete(courses).where(eq(courses.id, id));
  }

  // Testimonials
  async getTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials);
  }

  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const [newTestimonial] = await db.insert(testimonials).values(testimonial).returning();
    return newTestimonial;
  }

  async updateTestimonial(id: number, updates: Partial<InsertTestimonial>): Promise<Testimonial> {
    const [updated] = await db.update(testimonials).set(updates).where(eq(testimonials.id, id)).returning();
    return updated;
  }

  async deleteTestimonial(id: number): Promise<void> {
    await db.delete(testimonials).where(eq(testimonials.id, id));
  }

  // Gallery
  async getGalleryItems(): Promise<GalleryItem[]> {
    return await db.select().from(gallery);
  }

  async createGalleryItem(item: InsertGalleryItem): Promise<GalleryItem> {
    const [newItem] = await db.insert(gallery).values(item).returning();
    return newItem;
  }

  async deleteGalleryItem(id: number): Promise<void> {
    await db.delete(gallery).where(eq(gallery.id, id));
  }

  // Announcements
  async getAnnouncements(): Promise<Announcement[]> {
    return await db.select().from(announcements).orderBy(desc(announcements.createdAt));
  }

  async getActiveAnnouncements(): Promise<Announcement[]> {
    const now = new Date();
    return await db.select().from(announcements)
      .where((col) => {
        const conditions = [eq(col.active, true)];
        return conditions.reduce((acc, cond, i) => {
          return i === 0 ? cond : acc; // Simplification - you can add more complex logic
        });
      })
      .orderBy(desc(announcements.createdAt));
  }

  async createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement> {
    const [newAnnouncement] = await db.insert(announcements).values(announcement).returning();
    return newAnnouncement;
  }

  async updateAnnouncement(id: number, updates: Partial<InsertAnnouncement>): Promise<Announcement> {
    const [updated] = await db.update(announcements).set(updates).where(eq(announcements.id, id)).returning();
    return updated;
  }

  async deleteAnnouncement(id: number): Promise<void> {
    await db.delete(announcements).where(eq(announcements.id, id));
  }

  // Success Stories
  async getSuccessStories(): Promise<SuccessStory[]> {
    return await db.select().from(successStories).orderBy(desc(successStories.createdAt));
  }

  async getLatestSuccessStories(limit: number): Promise<SuccessStory[]> {
    return await db.select().from(successStories)
      .orderBy(desc(successStories.createdAt))
      .limit(limit);
  }

  async getSuccessStory(id: number): Promise<SuccessStory | undefined> {
    const [story] = await db.select().from(successStories).where(eq(successStories.id, id));
    return story;
  }

  async createSuccessStory(story: InsertSuccessStory): Promise<SuccessStory> {
    const [newStory] = await db.insert(successStories).values(story).returning();
    return newStory;
  }

  async updateSuccessStory(id: number, updates: Partial<InsertSuccessStory>): Promise<SuccessStory> {
    const [updated] = await db.update(successStories).set(updates).where(eq(successStories.id, id)).returning();
    return updated;
  }

  async deleteSuccessStory(id: number): Promise<void> {
    await db.delete(successStories).where(eq(successStories.id, id));
  }

  // Career Applications
  async getCareerApplications(): Promise<CareerApplication[]> {
    return await db.select().from(careerApplications).orderBy(desc(careerApplications.createdAt));
  }

  async getCareerApplication(id: number): Promise<CareerApplication | undefined> {
    const [app] = await db.select().from(careerApplications).where(eq(careerApplications.id, id));
    return app;
  }

  async createCareerApplication(app: InsertCareerApplication): Promise<CareerApplication> {
    const [newApp] = await db.insert(careerApplications).values(app).returning();
    return newApp;
  }

  async updateCareerApplication(id: number, updates: Partial<InsertCareerApplication>): Promise<CareerApplication> {
    const [updated] = await db.update(careerApplications).set(updates).where(eq(careerApplications.id, id)).returning();
    return updated;
  }

  async deleteCareerApplication(id: number): Promise<void> {
    await db.delete(careerApplications).where(eq(careerApplications.id, id));
  }

  // Director Message
  async getDirectorMessage(): Promise<DirectorMessage | undefined> {
    const [message] = await db.select().from(directorMessage);
    return message;
  }

  async upsertDirectorMessage(message: Partial<InsertDirectorMessage>): Promise<DirectorMessage> {
    const existing = await this.getDirectorMessage();
    if (existing) {
      const updates = {
        ...(message.directorName !== undefined && { directorName: message.directorName }),
        ...(message.message !== undefined && { message: message.message }),
        ...(message.photoUrl !== undefined && { photoUrl: message.photoUrl }),
      };
      if (Object.keys(updates).length > 0) {
        const [updated] = await db.update(directorMessage).set(updates).where(eq(directorMessage.id, existing.id)).returning();
        return updated;
      }
      return existing;
    }
    // Only create if we have required fields
    if (message.directorName && message.message) {
      const [created] = await db.insert(directorMessage).values({
        directorName: message.directorName,
        message: message.message,
        photoUrl: message.photoUrl,
      }).returning();
      return created;
    }
    throw new Error("Director name and message are required for creation");
  }

  // Contacts
  async getContacts(): Promise<ContactMessage[]> {
    return await db.select().from(contacts);
  }

  async createContact(contact: InsertContactMessage): Promise<ContactMessage> {
    const [newContact] = await db.insert(contacts).values(contact).returning();
    return newContact;
  }

  // Faculty
  async getFaculty(): Promise<Faculty[]> {
    return await db.select().from(faculty);
  }

  async createFaculty(insertFaculty: InsertFaculty): Promise<Faculty> {
    const [newFaculty] = await db.insert(faculty).values(insertFaculty).returning();
    return newFaculty;
  }

  async updateFaculty(id: number, updates: Partial<InsertFaculty>): Promise<Faculty> {
    const [updated] = await db.update(faculty).set(updates).where(eq(faculty.id, id)).returning();
    return updated;
  }

  async deleteFaculty(id: number): Promise<void> {
    await db.delete(faculty).where(eq(faculty.id, id));
  }
}

export const storage = new DatabaseStorage();
