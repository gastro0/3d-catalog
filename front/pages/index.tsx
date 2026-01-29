import React, { useState } from 'react';
import { Header } from '../components/Header';
import { CategoryGrid } from "../components/CategoryGrid";
import { SearchFilters } from '../components/SearchFilters';

const categories = [
  'Архитектура',
  'Для дома',
  'Декор',
  'Игрушки',
  'Животные',
  'Игры',
];

const formats = ['FBX', 'OBJ', 'GLTF']; // Пример форматов

import { AuthModal } from '../components/AuthModal';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedFormat, setSelectedFormat] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date' | 'popularity' | 'size'>('date');
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#ece9dd]">
      <Header />
      <main className="pt-24 px-8 max-w-6xl mx-auto">
        <SearchFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedFormat={selectedFormat}
          setSelectedFormat={setSelectedFormat}
          sortBy={sortBy}
          setSortBy={setSortBy}
          categories={categories}
          formats={formats}
        />
        <CategoryGrid categories={categories} setSelectedCategory={setSelectedCategory} />
      </main>
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}
