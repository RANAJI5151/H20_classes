import { z } from 'zod';
import {
  insertSiteConfigSchema,
  insertCourseSchema,
  insertTestimonialSchema,
  insertGallerySchema,
  insertAnnouncementSchema,
  insertSuccessStorySchema,
  insertCareerApplicationSchema,
  insertDirectorMessageSchema,
  insertContactSchema,
  insertFacultySchema,
  siteConfig, courses, testimonials, gallery, announcements, successStories, careerApplications, directorMessage, contacts, faculty
} from './schema';

export * from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  siteConfig: {
    list: {
      method: 'GET' as const,
      path: '/api/site-config',
      responses: {
        200: z.array(z.custom<typeof siteConfig.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/site-config',
      input: insertSiteConfigSchema,
      responses: {
        201: z.custom<typeof siteConfig.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/site-config/:key',
      responses: {
        200: z.custom<typeof siteConfig.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  courses: {
    list: {
      method: 'GET' as const,
      path: '/api/courses',
      responses: {
        200: z.array(z.custom<typeof courses.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/courses/:id',
      responses: {
        200: z.custom<typeof courses.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/courses',
      input: insertCourseSchema,
      responses: {
        201: z.custom<typeof courses.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/courses/:id',
      input: insertCourseSchema.partial(),
      responses: {
        200: z.custom<typeof courses.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/courses/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  testimonials: {
    list: {
      method: 'GET' as const,
      path: '/api/testimonials',
      responses: {
        200: z.array(z.custom<typeof testimonials.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/testimonials',
      input: insertTestimonialSchema,
      responses: {
        201: z.custom<typeof testimonials.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/testimonials/:id',
      input: insertTestimonialSchema.partial(),
      responses: {
        200: z.custom<typeof testimonials.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/testimonials/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  gallery: {
    list: {
      method: 'GET' as const,
      path: '/api/gallery',
      responses: {
        200: z.array(z.custom<typeof gallery.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/gallery',
      input: insertGallerySchema,
      responses: {
        201: z.custom<typeof gallery.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/gallery/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  announcements: {
    list: {
      method: 'GET' as const,
      path: '/api/announcements',
      responses: {
        200: z.array(z.custom<typeof announcements.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/announcements',
      input: insertAnnouncementSchema,
      responses: {
        201: z.custom<typeof announcements.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/announcements/:id',
      input: insertAnnouncementSchema.partial(),
      responses: {
        200: z.custom<typeof announcements.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/announcements/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  contacts: {
    create: {
      method: 'POST' as const,
      path: '/api/contacts',
      input: insertContactSchema,
      responses: {
        201: z.custom<typeof contacts.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/contacts',
      responses: {
        200: z.array(z.custom<typeof contacts.$inferSelect>()),
      },
    },
  },
  faculty: {
    list: {
      method: 'GET' as const,
      path: '/api/faculty',
      responses: {
        200: z.array(z.custom<typeof faculty.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/faculty',
      input: insertFacultySchema,
      responses: {
        201: z.custom<typeof faculty.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/faculty/:id',
      input: insertFacultySchema.partial(),
      responses: {
        200: z.custom<typeof faculty.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/faculty/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  successStories: {
    list: {
      method: 'GET' as const,
      path: '/api/success-stories',
      responses: {
        200: z.array(z.custom<typeof successStories.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/success-stories/:id',
      responses: {
        200: z.custom<typeof successStories.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/success-stories',
      input: insertSuccessStorySchema,
      responses: {
        201: z.custom<typeof successStories.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/success-stories/:id',
      input: insertSuccessStorySchema.partial(),
      responses: {
        200: z.custom<typeof successStories.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/success-stories/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  careerApplications: {
    list: {
      method: 'GET' as const,
      path: '/api/career-applications',
      responses: {
        200: z.array(z.custom<typeof careerApplications.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/career-applications/:id',
      responses: {
        200: z.custom<typeof careerApplications.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/career-applications',
      input: insertCareerApplicationSchema,
      responses: {
        201: z.custom<typeof careerApplications.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/career-applications/:id',
      input: insertCareerApplicationSchema.partial(),
      responses: {
        200: z.custom<typeof careerApplications.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/career-applications/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  directorMessage: {
    get: {
      method: 'GET' as const,
      path: '/api/director-message',
      responses: {
        200: z.custom<typeof directorMessage.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/director-message',
      input: insertDirectorMessageSchema,
      responses: {
        201: z.custom<typeof directorMessage.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/director-message',
      input: insertDirectorMessageSchema.partial(),
      responses: {
        200: z.custom<typeof directorMessage.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
