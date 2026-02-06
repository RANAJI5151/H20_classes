import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { requireAuth, handleLogin, handleLogout, handleAuthStatus, handleChangePassword } from "./auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // === Auth Routes ===
  app.post("/api/auth/login", handleLogin);
  app.post("/api/auth/logout", handleLogout);
  app.get("/api/auth/status", handleAuthStatus);
  app.post("/api/auth/change-password", requireAuth, handleChangePassword);

  // === Site Config ===
  app.get(api.siteConfig.list.path, async (req, res) => {
    const config = await storage.getSiteConfig();
    res.json(config);
  });

  app.post(api.siteConfig.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.siteConfig.create.input.parse(req.body);
      const config = await storage.upsertSiteConfig(input);
      res.status(201).json(config);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // === Courses ===
  app.get(api.courses.list.path, async (req, res) => {
    const courses = await storage.getCourses();
    res.json(courses);
  });

  app.get(api.courses.get.path, async (req, res) => {
    const course = await storage.getCourse(Number(req.params.id));
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  });

  app.post(api.courses.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.courses.create.input.parse(req.body);
      const course = await storage.createCourse(input);
      res.status(201).json(course);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message });
      throw err;
    }
  });

  app.put(api.courses.update.path, requireAuth, async (req, res) => {
    try {
      const input = api.courses.update.input.parse(req.body);
      const course = await storage.updateCourse(Number(req.params.id), input);
      res.json(course);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message });
      res.status(404).json({ message: "Course not found" });
    }
  });

  app.delete(api.courses.delete.path, requireAuth, async (req, res) => {
    await storage.deleteCourse(Number(req.params.id));
    res.status(204).send();
  });

  // === Testimonials ===
  app.get(api.testimonials.list.path, async (req, res) => {
    const testimonials = await storage.getTestimonials();
    res.json(testimonials);
  });

  app.post(api.testimonials.create.path, async (req, res) => { // Public can submit? Maybe restrict to admin for now or allow unapproved
    try {
      const input = api.testimonials.create.input.parse(req.body);
      // If public submission, maybe default approved to false?
      // For now, assuming admin adds them or public form submission
      const testimonial = await storage.createTestimonial(input);
      res.status(201).json(testimonial);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message });
      throw err;
    }
  });

  app.put(api.testimonials.update.path, requireAuth, async (req, res) => {
    try {
      const input = api.testimonials.update.input.parse(req.body);
      const testimonial = await storage.updateTestimonial(Number(req.params.id), input);
      res.json(testimonial);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message });
      res.status(404).json({ message: "Testimonial not found" });
    }
  });

  app.delete(api.testimonials.delete.path, requireAuth, async (req, res) => {
    await storage.deleteTestimonial(Number(req.params.id));
    res.status(204).send();
  });

  // === Gallery ===
  app.get(api.gallery.list.path, async (req, res) => {
    const items = await storage.getGalleryItems();
    res.json(items);
  });

  app.post(api.gallery.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.gallery.create.input.parse(req.body);
      const item = await storage.createGalleryItem(input);
      res.status(201).json(item);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message });
      throw err;
    }
  });

  app.delete(api.gallery.delete.path, requireAuth, async (req, res) => {
    await storage.deleteGalleryItem(Number(req.params.id));
    res.status(204).send();
  });

  // === Announcements ===
  app.get(api.announcements.list.path, async (req, res) => {
    const announcements = await storage.getAnnouncements();
    res.json(announcements);
  });

  app.post(api.announcements.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.announcements.create.input.parse(req.body);
      const announcement = await storage.createAnnouncement(input);
      res.status(201).json(announcement);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message });
      throw err;
    }
  });

  app.put(api.announcements.update.path, requireAuth, async (req, res) => {
    try {
      const input = api.announcements.update.input.parse(req.body);
      const announcement = await storage.updateAnnouncement(Number(req.params.id), input);
      res.json(announcement);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message });
      res.status(404).json({ message: "Announcement not found" });
    }
  });

  app.delete(api.announcements.delete.path, requireAuth, async (req, res) => {
    await storage.deleteAnnouncement(Number(req.params.id));
    res.status(204).send();
  });

  // === Contacts ===
  app.post(api.contacts.create.path, async (req, res) => {
    try {
      const input = api.contacts.create.input.parse(req.body);
      const contact = await storage.createContact(input);
      res.status(201).json(contact);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message });
      throw err;
    }
  });

  app.get(api.contacts.list.path, requireAuth, async (req, res) => {
    const contacts = await storage.getContacts();
    res.json(contacts);
  });

  // === Faculty ===
  app.get(api.faculty.list.path, async (req, res) => {
    const faculty = await storage.getFaculty();
    res.json(faculty);
  });

  app.post(api.faculty.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.faculty.create.input.parse(req.body);
      const faculty = await storage.createFaculty(input);
      res.status(201).json(faculty);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message });
      throw err;
    }
  });

  app.put(api.faculty.update.path, requireAuth, async (req, res) => {
    try {
      const input = api.faculty.update.input.parse(req.body);
      const faculty = await storage.updateFaculty(Number(req.params.id), input);
      res.json(faculty);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message });
      res.status(404).json({ message: "Faculty not found" });
    }
  });

  app.delete(api.faculty.delete.path, requireAuth, async (req, res) => {
    await storage.deleteFaculty(Number(req.params.id));
    res.status(204).send();
  });

  // === Success Stories ===
  app.get(api.successStories.list.path, async (req, res) => {
    const stories = await storage.getSuccessStories();
    res.json(stories);
  });

  app.get(api.successStories.get.path, async (req, res) => {
    const story = await storage.getSuccessStory(Number(req.params.id));
    if (!story) return res.status(404).json({ message: "Success story not found" });
    res.json(story);
  });

  app.post(api.successStories.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.successStories.create.input.parse(req.body);
      const story = await storage.createSuccessStory(input);
      res.status(201).json(story);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message });
      throw err;
    }
  });

  app.put(api.successStories.update.path, requireAuth, async (req, res) => {
    try {
      const input = api.successStories.update.input.parse(req.body);
      const story = await storage.updateSuccessStory(Number(req.params.id), input);
      res.json(story);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message });
      res.status(404).json({ message: "Success story not found" });
    }
  });

  app.delete(api.successStories.delete.path, requireAuth, async (req, res) => {
    await storage.deleteSuccessStory(Number(req.params.id));
    res.status(204).send();
  });

  // === Career Applications ===
  app.get(api.careerApplications.list.path, requireAuth, async (req, res) => {
    const applications = await storage.getCareerApplications();
    res.json(applications);
  });

  app.get(api.careerApplications.get.path, requireAuth, async (req, res) => {
    const application = await storage.getCareerApplication(Number(req.params.id));
    if (!application) return res.status(404).json({ message: "Application not found" });
    res.json(application);
  });

  app.post(api.careerApplications.create.path, async (req, res) => {
    try {
      const input = api.careerApplications.create.input.parse(req.body);
      const application = await storage.createCareerApplication(input);
      res.status(201).json(application);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message });
      throw err;
    }
  });

  app.put(api.careerApplications.update.path, requireAuth, async (req, res) => {
    try {
      const input = api.careerApplications.update.input.parse(req.body);
      const application = await storage.updateCareerApplication(Number(req.params.id), input);
      res.json(application);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message });
      res.status(404).json({ message: "Application not found" });
    }
  });

  app.delete(api.careerApplications.delete.path, requireAuth, async (req, res) => {
    await storage.deleteCareerApplication(Number(req.params.id));
    res.status(204).send();
  });

  // === Director Message ===
  app.get(api.directorMessage.get.path, async (req, res) => {
    const message = await storage.getDirectorMessage();
    if (!message) return res.status(404).json({ message: "Director message not found" });
    res.json(message);
  });

  app.post(api.directorMessage.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.directorMessage.create.input.parse(req.body);
      const message = await storage.upsertDirectorMessage(input);
      res.status(201).json(message);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message });
      throw err;
    }
  });

  app.put(api.directorMessage.update.path, requireAuth, async (req, res) => {
    try {
      const input = api.directorMessage.update.input.parse(req.body);
      const message = await storage.upsertDirectorMessage(input);
      res.json(message);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message });
      throw err;
    }
  });

  // Seed Data
  if (process.env.NODE_ENV !== "test") {
    const config = await storage.getSiteConfig();
    if (config.length === 0) {
      console.log("Seeding database...");
      await storage.upsertSiteConfig({ key: "phone", value: "+91-9876543210" });
      await storage.upsertSiteConfig({ key: "email", value: "info@h2oclasses.com" });
      await storage.upsertSiteConfig({ key: "tagline", value: "Concept-based learning for guaranteed success" });
      await storage.upsertSiteConfig({ key: "address", value: "Kashipur, Uttarakhand" });

      // Seed Courses
      await storage.createCourse({
        title: "Foundation Course",
        description: "Maths & Science foundation for strong basics.",
        grade: "6-8",
        subjects: "Maths, Science"
      });
      await storage.createCourse({
        title: "Board Prep",
        description: "Intensive preparation for Class 10 Boards.",
        grade: "9-10",
        subjects: "Maths, Science"
      });
      await storage.createCourse({
        title: "JEE/NEET Foundation",
        description: "Physics, Chemistry & Maths for competitive exams.",
        grade: "11-12",
        subjects: "PCM/PCB"
      });

      // Seed Faculty
      await storage.createFaculty({
        name: "Dr. Sharma",
        role: "Senior Physics Faculty",
        qualification: "Ph.D. Physics",
        bio: "15+ years of teaching experience."
      });
      await storage.createFaculty({
        name: "Mrs. Verma",
        role: "Maths Expert",
        qualification: "M.Sc. Mathematics",
        bio: "Specializes in making complex concepts easy."
      });

      // Seed Testimonials
      await storage.createTestimonial({
        name: "Rahul Singh",
        role: "Student",
        content: "H2O Classes helped me score 95% in my boards!",
        rating: 5,
        approved: true
      });
    }
  }

  return httpServer;
}
