// convex/functions/createOrganization.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createOrganization = mutation({
  args: { name: v.string(), userId: v.id("users") },
  handler: async (ctx, args) => {
    const orgId = await ctx.db.insert("organizations", {
      name: args.name,
      createdBy: args.userId,
    });

    await ctx.db.insert("memberships", {
      orgId,
      userId: args.userId,
      role: "admin",
    });

    await ctx.db.insert("roles", {
      orgId,
      name: "admin",
      permissions: ["org:admin:*"],
    });

    return orgId;
  },
});

export const inviteUserToOrg = mutation({
    args: {
      orgId: v.id("organizations"),
      userId: v.id("users"),
      role: v.string(),
    },
    handler: async (ctx, args) => {
      const role = await ctx.db
        .query("roles")
        .withIndex("by_org_name", q => q.eq("orgId", args.orgId).eq("name", args.role))
        .first();
  
      if (!role) throw new Error("Role does not exist in this organization");
  
      return await ctx.db.insert("memberships", {
        orgId: args.orgId,
        userId: args.userId,
        role: args.role,
      });
    },
  });

