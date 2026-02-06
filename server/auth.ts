import type { Request, Response, NextFunction } from "express";

export interface AdminSession extends Request {
  session: {
    adminId?: string;
    loginAttempts?: number;
    lastAttempt?: number;
    passwordChangedAt?: number;
    save?: (callback: (err?: any) => void) => void;
    destroy?: (callback: (err?: any) => void) => void;
  };
}

// Session timeout config (30 minutes)
const SESSION_TIMEOUT = 30 * 60 * 1000;
const MAX_LOGIN_ATTEMPTS = 5;
const ATTEMPT_RESET_TIME = 15 * 60 * 1000; // 15 minutes

// Simple password check
export function verifyAdmin(username: string, password: string): boolean {
  const adminUsername = process.env.ADMIN_USERNAME || "tarunpant";
  const adminPassword = process.env.ADMIN_PASSWORD || "NKB#123";
  
  return username === adminUsername && password === adminPassword;
}

// Middleware to check if user is authenticated as admin
export const requireAuth = (req: any, res: Response, next: NextFunction) => {
  if (!req.session?.adminId) {
    return res.status(401).json({ message: "Unauthorized: Please login first" });
  }
  
  // Check session timeout
  const now = Date.now();
  if (req.session.lastActivity && (now - req.session.lastActivity) > SESSION_TIMEOUT) {
    req.session.destroy((err: any) => {
      if (err) console.error("Session destroy error:", err);
    });
    return res.status(401).json({ message: "Session expired: Please login again" });
  }
  
  // Update last activity
  req.session.lastActivity = now;
  next();
};

// Login endpoint handler
export function handleLogin(req: any, res: Response) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  // Check login attempts
  const now = Date.now();
  const lastAttempt = req.session?.lastAttempt || 0;
  const attempts = req.session?.loginAttempts || 0;

  if (attempts >= MAX_LOGIN_ATTEMPTS && (now - lastAttempt) < ATTEMPT_RESET_TIME) {
    return res.status(429).json({ message: "Too many login attempts. Please try again later." });
  }

  // Reset attempts if reset time has passed
  if ((now - lastAttempt) > ATTEMPT_RESET_TIME) {
    req.session.loginAttempts = 0;
  }

  if (verifyAdmin(username, password)) {
    req.session.adminId = "admin";
    req.session.loginAttempts = 0;
    req.session.lastActivity = now;
    req.session.save((err: any) => {
      if (err) {
        return res.status(500).json({ message: "Login failed" });
      }
      res.json({ message: "Login successful", authenticated: true });
    });
  } else {
    req.session.loginAttempts = (req.session.loginAttempts || 0) + 1;
    req.session.lastAttempt = now;
    req.session.save((err: any) => {
      if (err) console.error("Session save error:", err);
    });
    res.status(401).json({ message: "Invalid username or password" });
  }
}

// Logout endpoint handler
export function handleLogout(req: any, res: Response) {
  req.session.destroy((err: any) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.json({ message: "Logout successful" });
  });
}

// Get current auth status
export function handleAuthStatus(req: any, res: Response) {
  const authenticated = !!req.session?.adminId;
  res.json({ authenticated });
}

// Change password endpoint handler
export function handleChangePassword(req: any, res: Response) {
  if (!req.session?.adminId) {
    return res.status(401).json({ message: "Unauthorized: Please login first" });
  }

  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Current password and new password required" });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: "New password must be at least 6 characters" });
  }

  const adminUsername = process.env.ADMIN_USERNAME || "tarunpant";
  if (!verifyAdmin(adminUsername, currentPassword)) {
    return res.status(401).json({ message: "Current password is incorrect" });
  }

  // Note: In a real application, you would hash the new password and update it in a secure way
  // For now, we're just validating it. Actual password change would be in .env or a secrets store
  console.warn(`[SECURITY] Admin password change requested - must be updated in environment variables`);
  res.json({ message: "Password change requires manual update in environment variables for security" });
}
