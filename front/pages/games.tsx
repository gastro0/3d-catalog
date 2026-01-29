import React from 'react';
import { Header } from '../components/Header';

// Пример списка моделей для категории "Игры"
const gamesModels = [
  { id: '1', name: 'Настольная фишка' },
  { id: '2', name: 'Игровой кубик' },
  { id: '3', name: 'Шахматная фигура' },
  { id: '4', name: 'Игровое поле' },
];

export default function GamesCategoryPage() {
  return (
    <div className="min-h-screen bg-[#ece9dd]">
      <Header />
      <div className="pt-24 px-8 max-w-4xl mx-auto">
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 24 }}>Игры</h1>
        {gamesModels.length === 0 ? (
          <p>В этой категории пока нет моделей.</p>
        ) : (
          <div className="model-grid" style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,200px)',gap:'32px',justifyContent:'start'}}>
            {gamesModels.map(model => (
              <div className="model-card" key={model.id} style={{width:200,height:225,minWidth:200,maxWidth:200,display:'flex',flexDirection:'column',alignItems:'center',borderRadius:18,background:'#e1e1e1',boxShadow:'0 2px 12px rgba(44,40,37,0.06)'}}>
                <div className="model-card-preview" style={{background:'#d3d3d3',width:180,height:180,display:'flex',alignItems:'center',justifyContent:'center',borderRadius:13,marginTop:14}}>
                  {/* Здесь будет превью 3D-модели */}
                </div>
                <div className="model-card-title" style={{marginTop:11,fontSize:'1.18rem',fontWeight:500,color:'#181818',textAlign:'center',paddingBottom:0}}>{model.name}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
