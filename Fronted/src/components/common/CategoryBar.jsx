import React from "react";

const CATEGORIES = [
  "All",
  "JavaScript",
  "React",
  "Node.js",
  "Full Stack",
  "MongoDB",
  "Express",
  "Chai aur Code",
  "APIs",
  "Tailwind CSS",
  "Tutorials",
  "Coding Tips",
];

const CategoryBar = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
      {CATEGORIES.map((cat) => {
        const isSelected = selectedCategory === cat;
        return (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
              isSelected
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                : "bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white"
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryBar;
