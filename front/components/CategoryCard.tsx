import React from 'react';
import { useLang } from './LangContext';

interface CategoryCardProps {
    category: string;
    onClick: (category: string) => void;
}



export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onClick,
}) => {
  const { lang } = useLang();
  // Обновлённые названия и соответствие картинок
  const categoryData: Record<string, { ru: string; en: string; img: string }> = {
    "Архитектура": { ru: "Архитектура", en: "Architecture", img: "/categories/architecture.jpg" },
    "Для дома": { ru: "Для дома", en: "For Home", img: "/categories/home.jpg" },
    "Декор": { ru: "Декор", en: "Decor", img: "/categories/decor.jpg" },
    "Игрушки": { ru: "Игрушки", en: "Toys", img: "/categories/toys.jpg" },
    "Животные": { ru: "Животные", en: "Animals", img: "/categories/animals.jpg" },
    "Игры": { ru: "Игры", en: "Games", img: "/categories/games.jpg" },
  };
  const displayName = categoryData[category]?.[lang] || category;
  const imgSrc = categoryData[category]?.img;

  const router = require('next/router').useRouter();
  return (
    <article
      className="category-card"
      onClick={e => {
        onClick(category);
        // Переход на страницу категории
        if (category === "Архитектура") {
          router.push('/architecture');
        } else if (category === "Для дома") {
          router.push('/home');
        } else if (category === "Декор") {
          router.push('/decor');
        } else if (category === "Игрушки") {
          router.push('/toys');
        } else if (category === "Животные") {
          router.push('/animals');
        } else if (category === "Игры") {
          router.push('/games');
        }
        // Здесь можно добавить переходы для других категорий
      }}
      style={{ position: 'relative', background: '#222', padding: 0 }}
    >
      {imgSrc && (
        <img
          src={imgSrc}
          alt={displayName}
          className="category-bg-img"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
          }}
        />
      )}
      {/* Overlay для затемнения снизу */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: '48%',
          background: 'linear-gradient(0deg, rgba(0,0,0,0.62) 70%, transparent 100%)',
          zIndex: 1,
        }}
      />
      <div
        className="category-title"
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          background: 'none',
          color: '#fff',
          fontSize: '1.2rem',
          fontWeight: 600,
          textAlign: 'center',
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
          padding: '18px 0 18px 0',
          letterSpacing: '0.04em',
        }}
      >
        {displayName}
      </div>
    </article>
  );
};
