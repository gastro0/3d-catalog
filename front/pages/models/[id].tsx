import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Header } from "../../components/Header";
import { Model } from "../../types/types";
import { supabase } from "../../supabaseClient";

const ModelPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [model, setModel] = useState<Model | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchModel = async () => {
      const { data, error } = await supabase
        .from('models')
        .select('*')
        .eq('id', id)
        .single();
      if (error) {
        console.error('Ошибка загрузки модели:', error.message);
      } else {
        setModel(data as Model);
      }
      setLoading(false);
    };
    fetchModel();
  }, [id]);

  if (loading) return <div>Загрузка...</div>;
  if (!model) return <div>Модель не найдена.</div>;

  return (
    <div className="min-h-screen bg-[#ece9dd]">
      <Header />
      <main className="pt-24 px-8 max-w-3xl mx-auto">
        <h2 style={{fontSize: '2rem', marginBottom: '2rem'}}>{model.name}</h2>
        <div style={{display: 'flex', gap: '2rem'}}>
          <div style={{flex: 1}}>
            <img src={model.imageUrl || 'https://via.placeholder.com/400x400?text=3D+Model'} alt={model.name} style={{width: '100%', borderRadius: 16}} />
          </div>
          <div style={{flex: 2}}>
            <p><b>Формат:</b> {model.format}</p>
            <p><b>Полигоны:</b> {model.polygons}</p>
            <p><b>Описание:</b> {model.description}</p>
            {/* Добавьте другие поля по необходимости */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ModelPage;
