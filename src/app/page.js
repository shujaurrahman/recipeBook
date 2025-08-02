"use client";
import "./globals.css";

import { useState } from "react";
import Header from "./components/header/header";
import Intro from "./components/intro/intro";
import Content from "./components/content/content";
import Footer from "./components/footer/footer";
import { useRecipes } from "./api";

export default function Home() {
  const [selected, setSelected] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { recipes } = useRecipes();

  const handleSearch = (query) => {
    setSearchQuery(query);
    // The filtering is handled in the Content component using already loaded data
  };

  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header 
        selected={selected} 
        setSelected={setSelected}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
        recipes={recipes}
      />
      
      {/* Main content area with responsive padding */}
      <div className="flex-1 pt-20 px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <Intro />
          
          {/* Responsive grid container */}
          <div className="mt-8 sm:mt-12">
            {/* Grid layout: 
                - Mobile (< 768px): 1 column
                - Tablet (768px - 1024px): 2 columns
                - Large Tablet/Small Desktop (1024px - 1280px): 3 columns
                - Desktop (> 1280px): 4 columns 
            */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <Content selected={selected} searchQuery={searchQuery} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <Footer />
      </div>
    </main>
  );
}