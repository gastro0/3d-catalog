import React from "react";
import { Header } from "../components/Header";

const FavoritesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#ece9dd]">
      <Header />
      <main className="pt-24 px-8 max-w-6xl mx-auto">
        <h2 style={{fontSize: '2rem', marginBottom: '2rem'}}>Избранное</h2>
        <div style={{color:'#555'}}>Здесь будут отображаться ваши избранные 3D модели.</div>
      </main>
    </div>
  );
};

export default FavoritesPage;
