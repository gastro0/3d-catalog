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
        <section className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-5xl mx-auto">
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
