import { mutation, query, action, MutationCtx, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import bcrypt from "bcryptjs";


export const createUser = action({
    args: {
      authId: v.string(),
      email: v.string(),
      name: v.string(),
      password: v.string(),
    },
    handler: async (ctx, args) => {
      const password = await bcrypt.hash(args.password, 10);
  
     await ctx.runMutation(internal.user.createUserWithPassword, {
        ...args,
        password,
      });
    },
  });

export async function createUserInDb(
    ctx: MutationCtx,
    {
      authId,
      email,
      name,
      password,
    }: {
      authId: string;
      email: string;
      name: string;
      password: string;
    }
  ) {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", q => q.eq("email", email))
      .first();
  
    if (existing) {
      throw new Error(JSON.stringify({ code: "EMAIL_EXISTS", message: "Email already exists" }));
    }
  
    const userId = await ctx.db.insert("users", {
      authId,
      email,
      name,
      password,
    });
  
    const orgId = await ctx.db.insert("organizations", {
      name: `${name}_org`,
      createdBy: userId,
    });
  
    await ctx.db.insert("memberships", {
      orgId,
      userId,
      role: "admin",
    });
  
    await ctx.db.insert("roles", {
      orgId,
      name: "admin",
      permissions: ["org:*"],
    });
  
    await ctx.db.patch(userId, { defaultOrgId: orgId });
  
    return userId;
  }
  
  export const createUserWithPassword = internalMutation({
    args: {
      authId: v.string(),
      email: v.string(),
      name: v.string(),
      password: v.string(),
    },
    handler: async (ctx, args) => {
      return await createUserInDb(ctx, args);
    },
  });

  


export const getUser = query({
  args: { authId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.query("users").filter((q) => q.eq(q.field("authId"), args.authId)).first();
  },
});
 


 