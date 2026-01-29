"use client";

import React from "react";
import { SortOption } from "../types/types";
import { useLang } from "./LangContext";

interface SearchFiltersProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
    selectedFormat: string;
    setSelectedFormat: (format: string) => void;
    sortBy: SortOption;
    setSortBy: (sortOption: SortOption) => void;
    categories: string[] | null;
    formats: string[] | null;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
                                                                searchQuery,
                                                                setSearchQuery,
                                                                selectedCategory,
                                                                setSelectedCategory,
                                                                selectedFormat,
                                                                setSelectedFormat,
                                                                sortBy,
                                                                setSortBy,
                                                                categories,
                                                                formats,
                                                            }) => {
    const { lang } = useLang();
    const t = {
        ru: {
            search: 'Поиск моделей...',
            format: 'Все форматы',
            sort: 'Сортировка моделей',
            byDate: 'По новизне',
            byPopularity: 'По популярности',
            bySize: 'По размеру',
        },
        en: {
            search: 'Search models...',
            format: 'All formats',
            sort: 'Sort models',
            byDate: 'Newest',
            byPopularity: 'Popular',
            bySize: 'By size',
        }
    }[lang];
    return (
        <div className="main-filters">
            <input
                type="search"
                placeholder={t.search}
                className="px-5 py-3 text-base rounded-xl transition-all bg-white border-none duration-[0.3s] ease-[cubic-bezier(0.2,0,0.5,1)] w-[300px]"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                aria-label={t.search}
            />
            <select
                className="px-5 py-3 rounded-xl cursor-pointer bg-white border-none"
                value={selectedFormat}
                onChange={(event) => setSelectedFormat(event.target.value)}
                aria-label={t.format}
            >
                <option value="">{t.format}</option>
                {formats?.map((format) => (
                    <option key={format} value={format}>
                        {format}
                    </option>
                ))}
            </select>
            <select
                className="px-5 py-3 rounded-xl cursor-pointer bg-white border-none"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as SortOption)}
                aria-label={t.sort}
            >
                <option value="date">{t.byDate}</option>
                <option value="popularity">{t.byPopularity}</option>
                <option value="size">{t.bySize}</option>
            </select>
        </div>
    );
};
