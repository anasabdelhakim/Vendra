import Image from "next/image";
import prisma from "@/lib/prisma";
import SearchForLocation from "@/components/SearchForLocation";

export default async function Home() {
  const users = await prisma.user.findMany();
  const posts = await prisma.post.findMany({
    include: { author: true }, // Get the user info for each post
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />

        {/* USERS SECTION */}
        <div className="mt-10 w-full">
          <h1 className="text-3xl font-semibold text-black dark:text-white mb-4">
            Users
          </h1>
          <ul className="space-y-2 text-black dark:text-white">
            {users.map((user) => (
              <li
                key={user.id}
                className="border p-3 rounded-lg dark:border-zinc-700"
              >
                <p>
                  <b>Name:</b> {user.name}
                </p>
                <p>
                  <b>Email:</b> {user.email}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* POSTS SECTION */}
        <div className="mt-10 w-full">
          <h1 className="text-3xl font-semibold text-black dark:text-white mb-4">
            Posts
          </h1>
          <ul className="space-y-2 text-black dark:text-white">
            {posts.map((post) => (
              <li
                key={post.id}
                className="border p-3 rounded-lg dark:border-zinc-700"
              >
                <p>
                  <b>Title:</b> {post.title}
                </p>
                <p>
                  <b>Content:</b> {post.content}
                </p>
                {post.author && (
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                    <i>By {post.author.name}</i>
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
        <SearchForLocation />
      </main>
    </div>
  );
}
