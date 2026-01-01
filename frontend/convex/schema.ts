import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  conversations: defineTable({
    productId: v.string(),
    productTitle: v.string(), // snapshot for fast UI
    buyerId: v.string(),
    sellerId: v.string(),
    lastMessage: v.optional(v.string()),
    lastMessageAt: v.number(),
  })
    .index("by_buyer", ["buyerId", "lastMessageAt"])
    .index("by_seller", ["sellerId", "lastMessageAt"])
    .index("by_product", ["productId"]),

  messages: defineTable({
    conversationId: v.id("conversations"),
    senderId: v.string(),
    text: v.string(),
    createdAt: v.number(),
  }).index("by_conversation", ["conversationId", "createdAt"]),
});
