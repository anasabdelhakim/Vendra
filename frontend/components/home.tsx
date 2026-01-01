"use client";
import { useEffect, useState } from "react";

const categories = [
  { name: "Sports Cars", query: "sports car" },
  { name: "SUVs", query: "suv" },
  { name: "Classic Cars", query: "classic car" },
];

export default function HomeListening() {
  const [carsByCategory, setCarsByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCarImages() {
      try {
        const categoryData = {};

        for (const category of categories) {
          const res = await fetch(
            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
              category.query
            )}&per_page=6`,
            {
              headers: {
                Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`,
              },
            }
          );

          const data = await res.json();

          if (res.ok) {
            categoryData[category.name] = data.results;
          } else {
            setError(data.errors || "Failed to fetch car images");
          }
        }

        setCarsByCategory(categoryData);
        console.log("Cars by category:", categoryData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCarImages();
  }, []);

  if (loading) return <p>Loading car images...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Cars Marketplace</h1>

      {Object.entries(carsByCategory).map(([categoryName, cars]) => (
        <div key={categoryName} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{categoryName}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {cars.map((car) => (
              <div
                key={car.id}
                className="flex flex-col gap-2 p-2 border rounded-lg shadow-sm hover:shadow-md transition"
              >
                <div
                  className="w-full aspect-square bg-cover bg-center rounded-lg"
                  style={{ backgroundImage: `url(${car.urls.small})` }}
                />
                <p className="text-base font-semibold">
                  {car.alt_description || "Car"}
                </p>
                <p className="text-sm text-gray-500">By: {car.user.name}</p>
                <p className="text-sm text-gray-500">Likes: {car.likes}</p>
                <a
                  href={car.links.html}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 text-sm hover:underline"
                >
                  View on Unsplash
                </a>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
