import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "./_core/trpc";
import {
  createWorkRecord,
  getWorkRecordsByUser,
  updateWorkRecord,
  deleteWorkRecord,
  addWorkRecordImage,
  getWorkRecordImages,
} from "./db";
import { getDb } from "./db";
import { users } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { hashPassword, verifyPassword } from "./password";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
    register: publicProcedure
      .input(z.object({
        username: z.string().min(3, "Username must be at least 3 characters"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        name: z.string().optional(),
        isAdmin: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        try {
          // Check if username already exists
          const existingUser = await db.select().from(users).where(eq(users.username, input.username)).limit(1);
          if (existingUser && existingUser.length > 0) {
            throw new Error("Username already exists");
          }
          
          // Hash password using bcryptjs
          const hashedPassword = await hashPassword(input.password);
          
          await db.insert(users).values({
            username: input.username,
            password: hashedPassword,
            name: input.name || input.username,
            openId: `mock-${input.username}-${Date.now()}`,
            loginMethod: "mock",
            role: input.isAdmin ? "admin" : "user",
          });
          
          return { success: true, message: "Account created successfully" };
        } catch (error: any) {
          throw new Error(error.message || "Failed to create account");
        }
      }),
    login: publicProcedure
      .input(z.object({
        username: z.string(),
        password: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        try {
          // Find user by username
          const userResult = await db.select().from(users).where(eq(users.username, input.username)).limit(1);
          
          if (!userResult || userResult.length === 0) {
            throw new Error("Invalid username or password");
          }
          
          const userData = userResult[0];
          
          // Verify password using bcryptjs
          const passwordMatch = await verifyPassword(input.password, userData.password || "");
          
          if (!passwordMatch) {
            throw new Error("Invalid username or password");
          }
          
          const cookieOptions = getSessionCookieOptions(ctx.req);
          
          // Set session cookie
          ctx.res.cookie(COOKIE_NAME, JSON.stringify({
            id: userData.id,
            openId: userData.openId,
            name: userData.name,
            email: userData.email,
            role: userData.role,
            username: userData.username,
          }), { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
          
          return { 
            success: true, 
            user: {
              id: userData.id,
              name: userData.name,
              email: userData.email,
              role: userData.role,
              username: userData.username,
            }
          };
        } catch (error: any) {
          throw new Error(error.message || "Login failed");
        }
      }),
  }),

  workRecords: router({
    list: protectedProcedure
      .input(z.object({ month: z.string().optional() }))
      .query(async ({ ctx, input }) => {
        return await getWorkRecordsByUser(ctx.user.id, input.month);
      }),
    create: adminProcedure
      .input(
        z.object({
          date: z.string(),
          month: z.string(),
          customerName: z.string().optional(),
          customerPhone: z.string().optional(),
          product: z.string().optional(),
          os: z.string().optional(),
          serviceType: z.string().optional(),
          details: z.string().optional(),
          notes: z.string().optional(),
          status: z.enum(["pending", "completed", "cancelled"]),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return await createWorkRecord({
          ...input,
          userId: ctx.user.id,
        });
      }),
    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          date: z.string().optional(),
          month: z.string().optional(),
          customerName: z.string().optional(),
          customerPhone: z.string().optional(),
          product: z.string().optional(),
          os: z.string().optional(),
          serviceType: z.string().optional(),
          details: z.string().optional(),
          notes: z.string().optional(),
          status: z.enum(["pending", "completed", "cancelled"]).optional(),
        })
      )
      .mutation(async ({ input }) => {
        return await updateWorkRecord(input.id, input);
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await deleteWorkRecord(input.id);
      }),
    addImage: adminProcedure
      .input(
        z.object({
          recordId: z.number(),
          filename: z.string(),
          url: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        return await addWorkRecordImage(input.recordId, input.filename, input.url);
      }),
    getImages: protectedProcedure
      .input(z.object({ recordId: z.number() }))
      .query(async ({ input }) => {
        return await getWorkRecordImages(input.recordId);
      }),
  }),
});

export type AppRouter = typeof appRouter;
