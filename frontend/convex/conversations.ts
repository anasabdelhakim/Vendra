import { query } from "./_generated/server";
import { v } from "convex/values";

export const getInbox = query({
  args: {
    userId: v.string(), // Supabase user id
  },
  handler: async (ctx, args) => {
    const asBuyer = await ctx.db
      .query("conversations")
      .withIndex("by_buyer", (q) => q.eq("buyerId", args.userId))
      .collect();

    const asSeller = await ctx.db
      .query("conversations")
      .withIndex("by_seller", (q) => q.eq("sellerId", args.userId))
      .collect();

    const all = [...asBuyer, ...asSeller];

    // sort by latest message
    return all.sort((a, b) => b.lastMessageAt - a.lastMessageAt);
  },
});
