import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";

export function registerAuthRoutes(app: Express) {

  // ✅ LOGIN (ใช้ username/password จาก DB)
  app.post("/api/login", async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "username and password required" });
    }

    try {
      // 🔍 ค้นหาผู้ใช้จาก DB
      const user = await db.getUserByUsername(username);

      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      // 🔐 เช็ค password (แบบ plain ก่อน)
      if (user.password !== password) {
        return res.status(401).json({ error: "Invalid password" });
      }

      // ✅ สร้าง session token
      const userId = user.openId || user.username;
      if (!userId) {
        return res.status(500).json({ error: "User ID not available" });
      }
      const sessionToken = await sdk.createSessionToken(userId, {
        name: user.name ?? user.username ?? undefined,
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);

      res.cookie(COOKIE_NAME, sessionToken, {
        ...cookieOptions,
        maxAge: ONE_YEAR_MS,
      });

      return res.json({ success: true });

    } catch (err) {
      console.error("[LOGIN ERROR]", err);
      return res.status(500).json({ error: "Login failed" });
    }
  });

  // ✅ LOGOUT
  app.post("/api/logout", (req: Request, res: Response) => {
    res.clearCookie(COOKIE_NAME);
    res.json({ success: true });
  });

  // ✅ GET CURRENT USER
  app.get("/api/me", async (req: Request, res: Response) => {
    try {
      const token = req.cookies[COOKIE_NAME];

      if (!token) {
        return res.status(401).json({ error: "Not logged in" });
      }

      const session = await sdk.verifySession(token);

      if (!session) {
        return res.status(401).json({ error: "Invalid session" });
      }

      return res.json({
        user: {
          openId: session.sub,
          name: session.name,
        },
      });

    } catch (err) {
      return res.status(401).json({ error: "Invalid session" });
    }
  });
}