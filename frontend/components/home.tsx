"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

export default function HomeListening() {
  const categories = [
    { name: "Electronics", icon: "devices", active: true },
    { name: "Furniture", icon: "chair", active: false },
    { name: "Vehicles", icon: "directions_car", active: false },
    { name: "Clothing", icon: "apparel", active: false },
    { name: "Home & Garden", icon: "yard", active: false },
    { name: "Toys", icon: "toys", active: false },
    { name: "Games", icon: "sports_esports", active: false },
    { name: "Games", icon: "sports_esports", active: false },
  ];

  const latestListings = [
    {
      title: "Modern Smartphone",
      price: "$599 - New York, NY",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCWDx7COsjxvhqXFe0cRTWBKqgM7brxA6vhoaRaUMB595Y27K0kvftZhp_flYk9rxGG1VeE7eITrdokfIohvc0Y9sWTuT_-CdhIxGCCdbjF8BRG6hrmGn0fB3mqsr9WrhSbvaJNyKL2y8skO_wu0C9ngvjSKX9rycjRZDV6RHCsmRIDCDipAgk_L9tVlwq6T37kAM3RG2ftVqKLEkqvOUvFFEyrAfHBXAbVonwbeMisl5Vns_cHW5Oq7W3cgcDUg2MNieu3T0KUOKQx",
    },
    {
      title: "Stylish Coffee Table",
      price: "$150 - Brooklyn, NY",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCe76QxpubbnYx48g7CVUUL8QA3h8XL6JAquf1JJWnTiNdr3aSyAyEybsSXYmB-nrG_SYySiC1diapSLMT3jI9vWuQxR_IPJ2iFtF9whGh4fuRdBsDQDPchw71aLLLoqivgcyMmyUyBE6QSITc4g2CLoxLVVK_NR15BiNnQ09yJQV2NGUDSsLtEXVHJo5kEr16iocJxmu5ofAR1Q3X0aJZJ17Rl_DIjbdAULUz3BDgNKuqgZuQAxiHNWBcFztkMiafLTHwoyZIBOFFy",
    },
    {
      title: "Red Convertible",
      price: "$25,000 - Queens, NY",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCH6T0oXnuRnFP9XSeOHe5foXG2NDUQG2FLPJ6roiC9XxcLBdD4bhDn8RUxS5phlyujIe90CxmdM6uyuk3inWum8694qbZklz0a2kbfknIorI5mhBd6L22S3EmBGeAGwjnD--dL_PkoPrQ2BXVc5ZJi2MEMnNOB1K9WvkkDyzgFKYmZP8PRYifpNUVaJEnrUOtyEIBWwGYRxPaeLDiPsTz_9jDHj9zNn2GAquva_5KDc58Nxncd8qdEyy1FWwg0VpcUXFxBDjlcoSpQ",
    },
    {
      title: "Designer Jeans",
      price: "$80 - New York, NY",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDR4AUFFzIBNE2SIZYVG8nQxGURxrnK1iNpnhYwyFg4lVwzUGMVBW2ev_PDVdPmjNTZBuZkWLZ1YOT0GIWWn-aaaxDKSy3bPvdUu3E3Jt31xFPob3fmIlyRTc3jp4Ct8yQE5pHkH5I__GsoXZMOVuuRFZrcBwLOmVgnS0q6UytWlK6V2yMu9IW3jbcj57ND6uZgoX0D_hqN5KzcwbTFKOAuXCo7yw7Bv-78mXuUM1PK-IIYxlumiqECabK1OXXQfF5hrN0pYlDov_U4",
    },
    {
      title: "Designer Jeans",
      price: "$80 - New York, NY",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDR4AUFFzIBNE2SIZYVG8nQxGURxrnK1iNpnhYwyFg4lVwzUGMVBW2ev_PDVdPmjNTZBuZkWLZ1YOT0GIWWn-aaaxDKSy3bPvdUu3E3Jt31xFPob3fmIlyRTc3jp4Ct8yQE5pHkH5I__GsoXZMOVuuRFZrcBwLOmVgnS0q6UytWlK6V2yMu9IW3jbcj57ND6uZgoX0D_hqN5KzcwbTFKOAuXCo7yw7Bv-78mXuUM1PK-IIYxlumiqECabK1OXXQfF5hrN0pYlDov_U4",
    },
  ];

  const popularNearYou = [
    {
      title: "Cozy Armchair",
      price: "$220 - New York, NY",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCGzH7yTQ2Ki5YIYECck9AZxKUJiBWHRDyvXZ2jyNQVQsG_wBZu-NItV7sA9JoAD9ex7_gP50eUwC8BajGwW7XyQVQoKnUYEexsefSLbFgQVAHRUntPKNHk239nQHL-96uQl2gZVLf1NsscZoSiUNKM-tCUP0UajBN343piIyafyke9DEPDMSilGCTOVUPoW-p343u1nbeLiPJuuZEZ21BI8tewEBDKr-rJmFQi2g8OYyYpOR72tWHftzxEFpQC4sh893O5h84NuOmi",
    },
    {
      title: "Gaming Laptop",
      price: "$1,200 - Brooklyn, NY",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCp1FzTzni33R0HWhkhibbYLu-nMH5mCc8VWwha5JB8bSE26RmxSj33DZ4iNbwkfAXb56_eEwRYHu6sP_zvW_RngbLO0UCpgRznUXdBV6xu2dX47GED6f0iGz0K67PiF6DrltyfXyQcs0M2hCZPF-y-4OUIj8GKAIEEmyN2Wb9LQyBKDtQaQ41RDweB1GwQwevxHW3IgXG4I93WSfkk8QkHg1HsdUJrtIIh6wNVgcWmRREhgjH6BpTXaVdzicUwHvN1D1B875AtF27M",
    },
    {
      title: "Vintage Bicycle",
      price: "$180 - Queens, NY",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuB2253es1lQcBl7I5b27_adIIblnwnzxXBXkltX70Fz3lC_pscGHoK99m3xq0aYS6GGNdZU40OMAeOEag7xI4tCRZF4f08f1rfJ_G8GUGlAlRvhF1Zoc43C_-bqeq9esgdUvQ-rGoCWM_sQU1s1MpxsZ0xDs3VRwaiB0HAtlWyH3BxQlbhf1DUUb0Xd_uM7g5SOGrqaNmYVav4sS-xsqwe0v8wCRRJ3u7jRBKnSg5qi6twUf7OplQMoX0RncoQT4kTFsGT-21EyRqpJ",
    },
    {
      title: "House Plant Bundle",
      price: "$50 - New York, NY",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBXsDKzLKVrh4uBgukEMoCDnjuiJBDZy9X6dxA88ReKs4ir9qV_Dm7ZCQ--PUuVM6MOyw7EQGvbTT1dSZeGRaMKcG90D5bK0ZyHKu7f5lnuLRNqc_7SiJIg5a4ukCQUuj09AdXHJzUkVY_v7MAM8TAX8VoqNkOKJVFc6ihtiHg45ayocXl8KTTkf33ZN65w6gjeQvplDJNsUa44mz50fXemIZs-d8C9dSDpx3yrGus_gv3vHzsNdHOqn7Jx8Zx8PIq6moVWBNr8ucZl",
    },
    {
      title: "House Plant Bundle",
      price: "$50 - New York, NY",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBXsDKzLKVrh4uBgukEMoCDnjuiJBDZy9X6dxA88ReKs4ir9qV_Dm7ZCQ--PUuVM6MOyw7EQGvbTT1dSZeGRaMKcG90D5bK0ZyHKu7f5lnuLRNqc_7SiJIg5a4ukCQUuj09AdXHJzUkVY_v7MAM8TAX8VoqNkOKJVFc6ihtiHg45ayocXl8KTTkf33ZN65w6gjeQvplDJNsUa44mz50fXemIZs-d8C9dSDpx3yrGus_gv3vHzsNdHOqn7Jx8Zx8PIq6moVWBNr8ucZl",
    },
  ];

  const recommended = [
    {
      title: "DSLR Camera",
      price: "$450 - Jersey City, NJ",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBwdbcBqv2HMMaE2RGMcWzHYpwotU39JWq0Gy4U4cORM8APhkw303ELJAitxjW-dK5cVlG3eq1LgBbqb2VFtGFrOGvPxJJy5ORn3JDuDF6BtXsRUqAOPBjbByKYUTNdqvpGPwkJ0zL_EViMVTDEqxPqpHDaF-NtF56F1-rQ7WmS2TFc_I9volXBOq7bWb6G_yGtoirYQ8-mfN7xsCPhAz_VxgiFcdKc2ReAw3S9bloK7N6mIaHoRYFGpsTXu7nR42BIibUo0O10FJL1",
    },
    {
      title: "4K Drone",
      price: "$300 - Brooklyn, NY",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCYvHd8z2M-Nyl0euUCsYBG782tE1cLmFEhGSXYxcb5GHBX5kD-o_eQIW68Dqoc_Q8ftpz6f-5B9ox1VOYuYU-HzUn-36lT-s0unS8k0E9KifyOOAkAe8f02m3SXsJ-iCD0LVRKTpf1Y1AGAQORyHKGNTaAPFJOBSz9zATkkYh01WQ_v__AKV6jFuvy_HGZPK1b133gk5s6wNkPy4QFNd5nkmvErUWHIxSSTivl5Ev-FfRssKVUeoGONJc6SBKAt9sQQhjUk-Cgu7m6",
    },
    {
      title: "Running Shoes",
      price: "$75 - New York, NY",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDvncyjwwO29xXkyGuIdUN4R9ofvi5aV21v2FnnWNXyLsXUfskXQcKYkArg6uVk1E7gmmjRxJzsjyuRNbt1yxlhaxN6Ws07IcwN9oX6OgO7DErjh18LyRls40PqExn5qkRp_Gi1Cj2tw4AzklWLNgCEVj2Lfdn8S9uWyNxQeWqUZe979xqLK21pnDyuhGv_Y7RzSae4R4WeziANDecXXP0ITOZ8KVG4k0de-LgSgslmhr4XuIenhagBVqQLdnKoHJe_ZrNqn3yUFxjp",
    },
    {
      title: "Smart Watch",
      price: "$199 - Queens, NY",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBwWWgTp3ai73NZKXbvmciW5sJcE-JmYgiap47hRieGyTYVaQnZIBxJtUZkMCzseBMeYHTkj2Fz_fMoodMRL49GiLcVT_vqL4S5hepJEW2An7uGplpxm0I1p-JKQJ6a8DKdfICaPJhpGkyAFrLX2RMgebxKre2ddQLy7zQ0h7pV5i8ybQfWWOfvKw8CmtfSQ1gl0LFc18R6hqSca0nWq8tqk3Kou1dgeztYAkNygqyR8rce5i4xBB9t-0rAmVyu_1HmG-oihF56cAoR",
    },
  ];

  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-gray-900 dark:text-gray-100 min-h-screen flex flex-col">
      {/* Categories */}
      <div className="flex gap-3 p-4 overflow-x-auto border-b border-gray-200 dark:border-gray-800">
        {categories.map((cat) => (
          <button
            key={cat.name}
            className={`flex h-10 items-center gap-2 px-4 rounded-lg ${
              cat.active
                ? "bg-primary text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            }`}
          >
            <span className="material-symbols-outlined">{cat.icon}</span>
            <p className="text-sm font-medium">{cat.name}</p>
          </button>
        ))}
      </div>
      <div className="py-2 px-10">
        {/* Latest Listings */}
        <Section title="Latest Listings" items={latestListings} />

        {/* Popular Near You */}
        <Section title="Popular Near You" items={popularNearYou} />

        {/* Recommended for You */}
        <h2 className="text-gray-900 dark:text-white text-[22px] font-bold px-4 pt-5 pb-3">
          Recommended for You
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
          {recommended.map((item) => (
            <Card
              key={item.title}
              title={item.title}
              price={item.price}
              image={item.image}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Section component for horizontal scroll
function Section({
  title,
  items,
}: {
  title: string;
  items: { title: string; price: string; image: string }[];
}) {
  return (
    <>
      <h2 className="text-gray-900 dark:text-white text-[22px] font-bold px-4 pt-5 pb-3">
        {title}
      </h2>
      <div className="flex overflow-x-auto p-4 gap-4">
        {items.map((item) => (
          <Card
            key={item.title}
            title={item.title}
            price={item.price}
            image={item.image}
          />
        ))}
      </div>
    </>
  );
}

// Single Card component
function Card({
  title,
  price,
  image,
}: {
  title: string;
  price: string;
  image: string;
}) {
  const [liked, setLiked] = useState(false);

  return (
    <div className="flex flex-col gap-2 min-w-[15rem]">
      <div
        className="w-full aspect-square bg-cover bg-center rounded-xl relative overflow-hidden"
        style={{ backgroundImage: `url(${image})` }}
      >
        <button
          onClick={() => setLiked(!liked)}
          className="absolute top-2 right-2 bg-black/30 backdrop-blur-sm p-1.5 rounded-full text-white hover:text-red-500 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined !text-2xl">
            {liked ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="red"
                stroke="red"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-heart-icon"
              >
                <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
              </svg>
            ) : (
              <Heart className="w-6 h-6" />
            )}
          </span>
        </button>
      </div>
      <p className="text-base font-semibold text-gray-900 dark:text-white">
        {title}
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-400">{price}</p>
    </div>
  );
}
