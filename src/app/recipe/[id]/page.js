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
      fill="currentColor"
    >
      <path d="M18 1l-6 4-6-4-6 5v7l12 10 12-10v-7z" />
    </svg>
  );

  const renderInstructions = () => {
    if (!recipe) return null;
    
    if (recipe.instructions) {
      return (
        <div 
          className="prose prose-slate prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: recipe.instructions }}
        />
      );
    }
    
    if (recipe.analyzedInstructions && recipe.analyzedInstructions.length > 0) {
      return (
        <ol className="list-decimal pl-5 space-y-3">
          {recipe.analyzedInstructions[0].steps.map((step) => (
            <li key={step.number} className="text-sm text-slate-800">
              {step.step}
            </li>
          ))}
        </ol>
      );
    }
    
    return <p className="text-sm text-slate-500 italic">No instructions available.</p>;
  };

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-700"></div>
        <p className="mt-4 text-slate-600">Loading recipe details...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-white">
        <div className="text-center max-w-md px-6">
          <div className="text-5xl mb-6">😔</div>
          <h2 className="text-xl font-bold mb-4 text-slate-800">Unable to Load Recipe</h2>
          <p className="text-slate-600 mb-8">{error.message}</p>
          <Link href="/" className="inline-block py-2 px-6 text-sm font-medium text-white bg-slate-700 rounded-lg hover:bg-slate-800 transition-colors">
            ← Return to Recipes
          </Link>
        </div>
      </main>
    );
  }

  if (!recipe) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-white">
        <p className="text-center text-slate-600">Recipe not found.</p>
        <Link href="/" className="inline-block mt-6 py-2 px-5 text-sm font-medium text-white bg-slate-700 rounded-lg hover:bg-slate-800 transition-colors">
          ← Back to Recipes
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 start-0 z-40 w-full bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100 py-4 px-6 md:px-12">
        <div className="max-w-screen-lg mx-auto flex justify-between items-center">
          <Link href="/" className="flex gap-3 text-xl font-medium items-center text-slate-800 hover:text-slate-600 transition-colors">
            {logo} Recipe Book
          </Link>
          <Link href="/" className="rounded-full bg-slate-100 py-2 px-4 text-sm text-slate-800 hover:bg-slate-200 transition-colors">
            ← Back to Recipes
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-screen-lg mx-auto">
          {/* Recipe Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">{recipe.title}</h1>
            <div className="flex flex-wrap gap-3 mb-4">
              {recipe.readyInMinutes && (
                <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                  ⏱️ {recipe.readyInMinutes} minutes
                </span>
              )}
              {recipe.servings && (
                <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                  👥 {recipe.servings} servings
                </span>
              )}
            </div>
          </div>

          {/* Recipe Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left Column - Image */}
            <div className="h-full">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                <Image
                  className="object-cover w-full h-full"
                  fill={true}
                  src={recipe.image}
                  alt={recipe.title}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={true}
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder-recipe.jpg';
                  }}
                />
              </div>

              {recipe.summary && (
                <div className="mt-8 bg-slate-50 rounded-xl p-6 border border-slate-100">
                  <h2 className="text-lg font-semibold text-slate-800 mb-3">About this Recipe</h2>
                  <div 
                    className="text-sm text-slate-600 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: recipe.summary }}
                  />
                </div>
              )}
            </div>

            {/* Right Column - Details */}
            <div>
              {/* Ingredients Section */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-xl font-semibold text-slate-800">Ingredients</h2>
                  {recipe.servings && (
                    <span className="text-sm text-slate-500">for {recipe.servings} servings</span>
                  )}
                </div>
                
                {recipe.extendedIngredients && recipe.extendedIngredients.length > 0 ? (
                  <ul className="space-y-3">
                    {recipe.extendedIngredients.map((ingredient) => (
                      <li key={ingredient.id} className="flex items-start gap-3">
                        <span className="inline-flex items-center justify-center bg-slate-100 rounded-full w-6 h-6 text-xs text-slate-600 mt-0.5">•</span>
                        <span className="text-sm text-slate-700">{ingredient.original}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-500 italic">No ingredients available.</p>
                )}
              </div>

              {/* Instructions Section */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-slate-800 mb-4">Instructions</h2>
                {renderInstructions()}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-8">
                <Link href="/">
                  <button
                    type="button"
                    className="py-2 px-5 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    ← Back to Recipes
                  </button>
                </Link>
                {recipe.sourceUrl && (
                  <a 
                    href={recipe.sourceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="py-2 px-5 text-sm font-medium text-white bg-slate-700 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    View Original Recipe →
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}