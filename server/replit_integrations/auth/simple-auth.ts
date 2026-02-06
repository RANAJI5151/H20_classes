import type { Express, RequestHandler } from "express";
import session from "express-session";

// Simple in-memory session store for development (use connect-pg-simple for production)
const sessionStore = new session.MemoryStore();

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  return session({
    secret: process.env.SESSION_SECRET || "dev-secret-key",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Allow non-https in dev
      maxAge: sessionTtl,
      sameSite: "lax",
    },
  });
}

export function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  
  console.log("✓ Simple username/password authentication enabled");
}

export const isAuthenticated: RequestHandler = (req, res, next) => {
  if ((req.session as any).adminId) {
    return next();
  }
  
  // Return 401 to indicate user is not authenticated
  return res.status(401).json({ message: "Unauthorized" });
};

export const registerAuthRoutes = (app: Express) => {
  // Login endpoint - accepts username and password
  app.post("/api/auth/login", (req, res) => {
    const { username, password } = req.body;
    
    const expectedUsername = process.env.ADMIN_USERNAME || "admin";
    const expectedPassword = process.env.ADMIN_PASSWORD || "admin123";
    
    if (username === expectedUsername && password === expectedPassword) {
      (req.session as any).adminId = "admin";
      (req.session as any).user = {
        id: "admin",
        firstName: "Admin",
        lastName: "User",
        email: "admin@h2oclasses.com",
      };
      return res.json({ success: true });
    }
    
    return res.status(401).json({ message: "Invalid credentials" });
  });

  // Get current user
  app.get("/api/auth/user", (req, res) => {
    const adminId = (req.session as any).adminId;
    
    if (!adminId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const user = (req.session as any).user;
    return res.json(user);
  });

  // Logout endpoint
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err: any) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.json({ success: true });
    });
  });
};
