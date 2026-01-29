import React from "react";
import { CategoryCard } from "./CategoryCard";

interface CategoryGridProps {
    categories: string[] | null;
    setSelectedCategory: (category: string) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
                                                              categories,
                                                              setSelectedCategory,
                                                          }) => {
    if (!categories || categories.length === 0) {
        return null;
    }

    return (
        <section className="category-grid">
            {categories.map((category) => (
                <CategoryCard
                    key={category}
                    category={category}
                    onClick={setSelectedCategory}
                />
            ))}
        </section>
    );
};
