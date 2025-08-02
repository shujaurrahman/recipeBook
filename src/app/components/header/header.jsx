import { useState } from "react";

export default function Header({ selected, setSelected }) {
  const [isOpen, setIsOpen] = useState(false);

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

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="fixed top-0 start-0 z-50 w-full bg-slate-50 flex justify-between items-center md:py-8 md:px-12 sm:py-6 sm:px-6">
      <h1 className="flex gap-4 text-lg items-center md:mb-0">
        {logo} Recipe Book
      </h1>
      <div className="relative">
        <button
          onClick={toggleMenu}
          className="rounded-md bg-slate-100 py-2 px-4 text-sm text-slate-900 hover:bg-slate-200"
        >
          Search Recipes
        </button>
        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg transition-transform transform ease-out duration-200">
            <div className="p-4">
              <input
                type="text"
                placeholder="Search recipes..."
                className="w-full p-2 border border-slate-300 rounded text-sm"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
