import Image from "next/image";
import { useState, useEffect } from "react";
import { useRecipes } from "../../api";
import Link from "next/link";

const Content = ({ selected }) => {
  const { recipes, loading, error } = useRecipes();

  console.log('Content component state:', { recipes: recipes.length, loading, error }); // Debug log

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 col-span-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-700"></div>
        <p className="ml-4">Loading delicious recipes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4 col-span-full">
        <h3 className="font-bold mb-2">Error loading recipes</h3>
        <p className="text-sm">{error.message}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-slate-200 text-slate-800 rounded hover:bg-slate-300"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="text-center p-4 col-span-full">
        <p>No recipes found. Please try again later.</p>
      </div>
    );
  }

  return (
    <>
      {recipes.map((recipe) => (
        <Link
          href={`/recipe/${recipe.id}`}
          key={recipe.id}
          className="block my-12 sm:my-6 relative cursor-pointer"
        >
          <div className="relative w-full object-contain aspect-square bg-slate-100 transition-all duration-150 hover:bg-[#EDF1F7]">
            <Image
              className="object-contain w-full h-full transition-all duration-150 hover:translate-y-1 p-8"
              fill={true}
              src={recipe.image}
              alt={recipe.title}
              sizes="100%"
              onError={(e) => {
                console.error('Image failed to load:', recipe.image);
                e.target.src = '/placeholder-recipe.png'; // Add a placeholder image
              }}
            />
          </div>
          <div className="block gap-2">
            <div className="flex justify-between mt-4">
              <p className="text-sm text-slate-800 mr-4">{recipe.title}</p>
              <p className="text-sm text-slate-800">#{recipe.id}</p>
            </div>
            <p className="text-sm text-gray-400 pb-4">Recipe</p>
          </div>
        </Link>
      ))}
    </>
  );
};

export default Content;