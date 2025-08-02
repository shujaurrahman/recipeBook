import { useState } from "react";
import Link from "next/link";

export default function Header({ 
  selected, 
  setSelected, 
  searchQuery, 
  setSearchQuery, 
  onSearch, 
  recipes 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery || '');

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

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    onSearch(localSearch);
    setIsOpen(false);
  };

  const handleFilterChange = (filterType) => {
    setSelected(filterType);
    setIsOpen(false);
  };

  const clearFilters = () => {
    setSelected('all');
    setSearchQuery('');
    setLocalSearch('');
    onSearch('');
    setIsOpen(false);
  };

  // Get categories based on loaded recipes
  const getRecipeCategories = () => {
    const categories = ['all'];
    if (recipes && recipes.length > 0) {
      recipes.forEach(recipe => {
        if (recipe.readyInMinutes && recipe.readyInMinutes <= 30) categories.push('quick');
        if (recipe.servings && recipe.servings >= 6) categories.push('family');
        if (recipe.title && (
          recipe.title.toLowerCase().includes('dessert') || 
          recipe.title.toLowerCase().includes('cake') ||
          recipe.title.toLowerCase().includes('sweet') ||
          recipe.title.toLowerCase().includes('chocolate')
        )) categories.push('dessert');
        if (recipe.title && (
          recipe.title.toLowerCase().includes('healthy') ||
          recipe.title.toLowerCase().includes('salad') ||
          recipe.title.toLowerCase().includes('veggie')
        )) categories.push('healthy');
      });
    }
    return [...new Set(categories)];
  };

  const categories = getRecipeCategories();

  return (
    <header className="fixed top-0 start-0 z-50 w-full bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100 flex justify-between items-center md:py-4 md:px-12 sm:py-4 sm:px-6">
      <Link href="/" className="flex gap-3 text-xl font-medium items-center text-slate-800 hover:text-slate-600 transition-colors">
        {logo} Recipe Book
      </Link>
      
      <div className="flex items-center gap-2">
        {/* Search Input - Always Visible */}
        <div className="relative hidden md:block">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search recipes..."
              className="w-56 py-2 px-4 border border-slate-200 rounded-l-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-transparent"
            />
            <button 
              type="submit"
              className="bg-slate-700 text-white px-4 py-2 rounded-r-lg hover:bg-slate-800 transition-colors text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
        </div>

        {/* Filter Button */}
        <button
          onClick={toggleMenu}
          className="flex items-center gap-2 rounded-full bg-slate-100 py-2 px-4 text-sm text-slate-900 hover:bg-slate-200 transition-colors shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 010 2H4a1 1 0 01-1-1zm3 6h12m-12 6h6" />
          </svg>
          <span className="hidden md:inline">Filter</span>
          <span className="md:hidden">Filter & Search</span>
        </button>
        
        {/* Active Filter Badge */}
        {selected !== 'all' && (
          <button 
            onClick={clearFilters}
            className="flex items-center gap-1 rounded-full bg-slate-700 py-1 px-3 text-xs text-white hover:bg-slate-800 transition-colors"
          >
            <span>{selected === 'quick' ? '⚡ Quick' : 
                  selected === 'family' ? '👨‍👩‍👧‍👦 Family' :
                  selected === 'dessert' ? '🍰 Dessert' :
                  selected === 'healthy' ? '🥗 Healthy' : selected}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 top-16 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 transition-all transform ease-out duration-200 z-50 mr-6">
            {/* Mobile Search Section */}
            <div className="p-4 border-b border-slate-100 md:hidden">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">🔍 Search Recipes</h3>
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder="Search by name or ingredient..."
                  className="flex-1 p-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                />
                <button 
                  type="submit"
                  className="bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium"
                >
                  Search
                </button>
              </form>
            </div>

            {/* Filter Section */}
            <div className="p-4">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Filter by Category</h3>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleFilterChange(category)}
                    className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                      selected === category
                        ? 'bg-slate-700 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {category === 'all' ? '🍽️ All' :
                     category === 'quick' ? '⚡ Quick (≤30min)' :
                     category === 'family' ? '👨‍👩‍👧‍👦 Family (6+)' :
                     category === 'dessert' ? '🍰 Desserts' :
                     category === 'healthy' ? '🥗 Healthy' : category}
                  </button>
                ))}
              </div>
              
              {(selected !== 'all' || searchQuery) && (
                <button
                  onClick={clearFilters}
                  className="w-full mt-3 p-2 text-sm text-slate-600 hover:text-slate-800 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
