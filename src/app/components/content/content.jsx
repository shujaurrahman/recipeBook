import Image from "next/image";
import { useRecipes } from "../../api";
import Link from "next/link";

const Content = ({ selected, searchQuery }) => {
  const { recipes, loading, error } = useRecipes();

  // Filter recipes based on selected category and search query
  const filteredRecipes = recipes.filter(recipe => {
    // Search filter
    const matchesSearch = !searchQuery || 
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (recipe.summary && recipe.summary.toLowerCase().includes(searchQuery.toLowerCase()));

    // Category filter
    let matchesCategory = selected === 'all';
    
    if (!matchesCategory) {
      switch (selected) {
        case 'quick':
          matchesCategory = recipe.readyInMinutes && recipe.readyInMinutes <= 30;
          break;
        case 'family':
          matchesCategory = recipe.servings && recipe.servings >= 6;
          break;
        case 'dessert':
          matchesCategory = recipe.title.toLowerCase().includes('dessert') || 
                           recipe.title.toLowerCase().includes('cake') || 
                           recipe.title.toLowerCase().includes('sweet');
          break;
        case 'healthy':
          matchesCategory = recipe.title.toLowerCase().includes('healthy') || 
                           recipe.title.toLowerCase().includes('salad') || 
                           recipe.title.toLowerCase().includes('veggie');
          break;
        default:
          matchesCategory = true;
      }
    }

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-96 col-span-full">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-slate-700"></div>
        <p className="mt-6 text-slate-600 font-medium">Loading delicious recipes...</p>
        <p className="text-sm text-slate-400 mt-2">Discovering amazing dishes for you</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 col-span-full bg-red-50 rounded-2xl border border-red-100">
        <div className="text-6xl mb-4">😔</div>
        <h3 className="text-xl font-bold mb-2 text-red-700">Oops! Something went wrong</h3>
        <p className="text-sm text-red-600 mb-6">{error.message}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-6 py-3 bg-red-100 text-red-800 rounded-xl hover:bg-red-200 transition-colors font-medium"
        >
          🔄 Try Again
        </button>
      </div>
    );
  }

  if (filteredRecipes.length === 0) {
    return (
      <div className="text-center p-8 col-span-full bg-yellow-50 rounded-2xl border border-yellow-100">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-bold mb-2 text-yellow-700">No recipes found</h3>
        <p className="text-sm text-yellow-600 mb-4">
          {searchQuery ? `No recipes match "${searchQuery}"` : `No recipes in the "${selected}" category`}
        </p>
        <p className="text-xs text-yellow-500">Try adjusting your search or filter criteria</p>
      </div>
    );
  }

  return (
    <>
      {filteredRecipes.map((recipe) => (
        <Link
          href={`/recipe/${recipe.id}`}
          key={recipe.id}
          className="group block transform transition-all duration-300 hover:-translate-y-1"
        >
          <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 h-[420px] flex flex-col overflow-hidden">
            {/* Image container */}
            <div className="relative h-48 overflow-hidden bg-slate-50">
              <Image
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                fill={true}
                src={recipe.image}
                alt={recipe.title}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                priority
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-recipe.jpg';
                }}
              />
              
              {/* Time and Servings Badge */}
              <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                {recipe.readyInMinutes && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/90 text-slate-700 ring-1 ring-inset ring-slate-200 backdrop-blur-sm">
                    ⏱️ {recipe.readyInMinutes}m
                  </span>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-4">
              <h3 className="font-medium text-slate-900 text-lg mb-2 line-clamp-2">
                {recipe.title}
              </h3>
              
              {/* Description */}
              <div className="flex-1 min-h-0">
                {recipe.summary && (
                  <p className="text-sm text-slate-500 line-clamp-3"
                     dangerouslySetInnerHTML={{ 
                       __html: recipe.summary.replace(/<[^>]*>/g, '') 
                     }}
                  />
                )}
              </div>

              {/* Footer */}
              <div className="pt-4 mt-auto border-t border-slate-100">
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-slate-50 text-slate-600 ring-1 ring-inset ring-slate-200">
                  {recipe.readyInMinutes <= 30 ? '⚡ Quick' :
                   recipe.servings >= 6 ? '👨‍👩‍👧‍👦 Family' :
                   recipe.title.toLowerCase().includes('dessert') ? '🍰 Dessert' :
                   recipe.title.toLowerCase().includes('healthy') ? '🥗 Healthy' : '🍽️ Recipe'}
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </>
  );
};

export default Content;