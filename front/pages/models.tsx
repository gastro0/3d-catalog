import React, { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { ModelGrid } from "../components/ModelGrid";
import { SearchFilters } from "../components/SearchFilters";
import { Model } from "../types/types";
import { supabase } from "../supabaseClient";


const categories = [
  'Архитектура',
  'Для дома',
  'Декор',
  'Игрушки',
  'Животные',
  'Гаджеты',
];
const formats = ['FBX', 'OBJ', 'GLTF'];

const ModelsPage: React.FC = () => {
  const [models, setModels] = useState<Model[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedFormat, setSelectedFormat] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date' | 'popularity' | 'size'>('date');

  useEffect(() => {
    const fetchModels = async () => {
      const { data, error } = await supabase
        .from('models')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Ошибка загрузки моделей:', error.message);
      } else {
        setModels(data as Model[]);
      }
    };
    fetchModels();
  }, []);

  // Фильтрация
  let filteredModels = models.filter(model => {
    const matchesSearch = model.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFormat = !selectedFormat || model.format === selectedFormat;
    return matchesSearch && matchesFormat;
  });

  // Сортировка
  filteredModels = filteredModels.slice().sort((a, b) => {
    if (sortBy === 'date') return 0; // Нет поля даты
    if (sortBy === 'popularity') return 0; // Нет поля популярности
    if (sortBy === 'size') return (a.polygons || 0) - (b.polygons || 0);
    return 0;
  });

  return (
    <div className="min-h-screen bg-[#ece9dd]">
      <Header />
      <main className="pt-24 px-8 max-w-6xl mx-auto">
        <h2 style={{fontSize: '2rem', marginBottom: '2rem'}}>Список 3D моделей</h2>
        <button
          onClick={async () => {
            const { data, error } = await supabase.from('models').insert([
              {
                id: Math.random().toString(36).substring(2, 12),
                name: 'Тестовая модель',
                format: 'OBJ',
                polygons: 12345,
                imageUrl: 'https://via.placeholder.com/400x400?text=3D+Model',
                category: 'Архитектура',
              },
            ]);
            if (error) alert('Ошибка добавления: ' + error.message);
            else alert('Тестовая модель добавлена!');
            // Перезагрузить список
            const { data: newData } = await supabase.from('models').select('*').order('created_at', { ascending: false });
            setModels(newData as Model[]);
          }}
          style={{marginBottom: 24, padding: '8px 18px', borderRadius: 8, background: '#1976d2', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer'}}
        >Добавить тестовую модель</button>
        <div style={{marginBottom: '2rem'}}>
          <SearchFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedFormat={selectedFormat}
            setSelectedFormat={setSelectedFormat}
            sortBy={sortBy}
            setSortBy={setSortBy}
            categories={categories || []}
            formats={formats || []}
          />
        </div>
        <ModelGrid models={models} filteredModels={filteredModels} />
        {/* UploadModal временно убран для диагностики проблемы с overlay */}
      </main>
    </div>
  );
};

export default ModelsPage;
