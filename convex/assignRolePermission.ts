import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const assignRolePermissions = mutation({
  args: {
    orgId: v.id("organizations"),
    role: v.string(),
    permissions: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const role = await ctx.db
      .query("roles")
      .withIndex("by_org_name", q => q.eq("orgId", args.orgId).eq("name", args.role))
      .first();

    if (role) {
      await ctx.db.patch(role._id, { permissions: args.permissions });
      return role._id;
    } else {
      return await ctx.db.insert("roles", {
        orgId: args.orgId,
        name: args.role,
        permissions: args.permissions,
      });
    }
  },
});