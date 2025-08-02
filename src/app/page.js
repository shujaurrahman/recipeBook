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
    <main className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-12 sm:p-4">
      <Header 
        selected={selected} 
        setSelected={setSelected}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
        recipes={recipes}
      />
      <div className="flex-1 pt-20">
        <Intro />
        {/* Grid layout for 8 recipes - 2 rows of 4 */}
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <Content selected={selected} searchQuery={searchQuery} />
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}