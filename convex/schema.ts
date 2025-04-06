// Convex schema for B2B SaaS with organizations, role-based permissions, and auth tokens

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    authId: v.string(),
    email: v.string(),
    name: v.string(),
    password: v.string(),
    defaultOrgId: v.optional(v.id("organizations")),
  }).index("by_authId", ["authId"]).index("by_email", ["email"]),
  
  organizations: defineTable({
    name: v.string(),
    createdBy: v.id("users"),
  }).index("by_creator", ["createdBy"]),
  
  memberships: defineTable({
    orgId: v.id("organizations"),
    userId: v.id("users"),
    role: v.string(),
  }).index("by_user_org", ["userId", "orgId"]),
  
  roles: defineTable({
    orgId: v.id("organizations"),
    name: v.string(), // e.g. "admin", "marketing"
    permissions: v.array(v.string()), // e.g. ["org:marketing:read"]
  }).index("by_org_name", ["orgId", "name"]),
  
  auth_tokens: defineTable({
    userId: v.id("users"),
    accessToken: v.string(),
    refreshToken: v.string(),
    accessTokenExpiresAt: v.number(), // timestamp in ms
    refreshTokenExpiresAt: v.number(), // timestamp in ms
  }).index("by_refresh_token", ["refreshToken"]),
});
  
