"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { api } from "../../api";
import Footer from "../../components/footer/footer";

export default function RecipeDetails() {
  const params = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        setLoading(true);
        const data = await api.getRecipeById(parseInt(params.id));
        setRecipe(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch recipe details'));
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchRecipeDetails();
    }
  }, [params.id]);

  const logo = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
    >
      <path d="M18 1l-6 4-6-4-6 5v7l12 10 12-10v-7z" />
    </svg>
  );

  const renderInstructions = () => {
    if (recipe.instructions) {
      return (
        <div 
          className="text-sm text-slate-800"
          dangerouslySetInnerHTML={{ __html: recipe.instructions }}
        />
      );
    }
    
    if (recipe.analyzedInstructions && recipe.analyzedInstructions.length > 0) {
      return (
        <ol className="list-decimal pl-5">
          {recipe.analyzedInstructions[0].steps.map((step) => (
            <li key={step.number} className="text-sm text-slate-800 mb-2">
              {step.step}
            </li>
          ))}
        </ol>
      );
    }
    
    return <p className="text-sm text-slate-500">No instructions available.</p>;
  };

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 pt-24">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-700"></div>
        <p className="mt-4">Loading recipe...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 pt-24">
        <div className="text-red-500 text-center p-4">
          <h2 className="text-xl font-bold mb-4">Error Loading Recipe</h2>
          <p>{error.message}</p>
          <Link href="/" className="inline-block mt-6 py-2 px-5 text-sm font-medium text-gray-900 rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-slate-800">
            ← Back to Recipes
          </Link>
        </div>
      </main>
    );
  }

  if (!recipe) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 pt-24">
        <p className="text-center">Recipe not found.</p>
        <Link href="/" className="inline-block mt-6 py-2 px-5 text-sm font-medium text-gray-900 rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-slate-800">
          ← Back to Recipes
        </Link>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between pt-16 bg-slate-50 sm:pt-8">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between md:max-w-screen-lg w-full sm:flex-col md:px-8 sm:px-4 sm:justify-start">
        <Link className="text-sm" href="/">
          <h1 className="flex gap-4 text-lg items-center md:mb-0 sm:mb-4">
            {logo} Recipe Book
          </h1>
        </Link>
        <Link href="/" className="rounded-md bg-slate-100 py-2 px-4 text-sm text-slate-900 hover:bg-slate-200">
          Back to Recipes
        </Link>
      </header>

      <div className="lg:gap-x-12 lg:gap-y-2 lg:w-full bg-slate-50 lg:max-w-screen-lg m-auto md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-2 md:px-8 sm:grid-cols-1 sm:px-4">
        <div className="padding-6 flex content-center items-center aspect-square bg-slate-100 lg:mb-0 sm:mb-6">
          <div className="relative w-full object-contain aspect-square bg-slate-100 transition-all duration-150 hover:bg-[#EDF1F7]">
            <Image
              className="object-contain w-full h-full transition-all duration-150 p-12"
              fill={true}
              src={recipe.image}
              alt={recipe.title}
              sizes="100%"
              priority
            />
          </div>
        </div>

        <div className="flex flex-col items-start justify-center">
          <h2 className="text-2xl font-bold text-slate-800">
            {recipe.title}
          </h2>
          <div className="flex gap-4 text-sm text-slate-500 mt-2 mb-6">
            {recipe.readyInMinutes && <p>{recipe.readyInMinutes} mins</p>}
            {recipe.readyInMinutes && recipe.servings && <p>•</p>}
            {recipe.servings && <p>{recipe.servings} servings</p>}
          </div>

          {recipe.summary && (
            <div className="mb-6">
              <div 
                className="text-sm text-slate-600"
                dangerouslySetInnerHTML={{ __html: recipe.summary }}
              />
            </div>
          )}

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-2">Ingredients</h3>
            {recipe.extendedIngredients && recipe.extendedIngredients.length > 0 ? (
              <ul className="list-disc pl-5">
                {recipe.extendedIngredients.map((ingredient) => (
                  <li key={ingredient.id} className="text-sm text-slate-800 mb-2">
                    {ingredient.original}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">No ingredients available.</p>
            )}
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-2">Instructions</h3>
            {renderInstructions()}
          </div>

          <div className="flex gap-2">
            <Link href="/">
              <button
                type="button"
                className="py-2 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-slate-800 focus:z-10 focus:ring-1 focus:ring-gray-200"
              >
                ← Back to Recipes
              </button>
            </Link>
            {recipe.sourceUrl && (
              <a 
                href={recipe.sourceUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="py-2 px-5 me-2 mb-2 text-sm font-medium text-white bg-slate-700 hover:bg-slate-800 rounded-lg"
              >
                View Original Recipe
              </a>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}