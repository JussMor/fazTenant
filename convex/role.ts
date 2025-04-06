// convex/functions/createRole.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createRole = mutation({
  args: {
    orgId: v.id("organizations"),
    name: v.string(),
    permissions: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("roles")
      .withIndex("by_org_name", q => q.eq("orgId", args.orgId).eq("name", args.name))
      .first();

    if (existing) throw new Error("Role already exists in this organization");

    return await ctx.db.insert("roles", {
      orgId: args.orgId,
      name: args.name,
      permissions: args.permissions,
    });
  },
});