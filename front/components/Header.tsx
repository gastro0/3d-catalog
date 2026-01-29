"use client";

import React from "react";

import { useState } from "react";
import { useTheme } from "./ThemeContext";
import { useLang } from "./LangContext";
import Link from "next/link";
import { UploadModal } from "./UploadModal";
import { AuthModal } from "./AuthModal";
import { supabase } from "../supabaseClient";
import { UserAvatar } from "./UserAvatar";
import { useRouter } from "next/router";

export const Header: React.FC = () => {
    const router = useRouter();
    const { theme, toggleTheme } = useTheme();
    const { lang, setLang } = useLang();
    const [user, setUser] = React.useState<any>(null);
    const [avatarUrl, setAvatarUrl] = React.useState<string | undefined>(undefined);

    React.useEffect(() => {
        const getUser = async () => {
            const { data, error } = await supabase.auth.getUser();
            setUser(data?.user ?? null);
            // Если в профиле есть аватар, можно получить его url из data.user.user_metadata.avatar_url
            setAvatarUrl(data?.user?.user_metadata?.avatar_url || undefined);
        };
        getUser();
        // Подписка на изменения сессии (логин/логаут)
        const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null);
            setAvatarUrl(session?.user?.user_metadata?.avatar_url || undefined);
        });
        return () => {
            listener?.subscription.unsubscribe();
        };
    }, []);

    const t = {
        ru: {
            site: 'ModelHub',
            models: 'Модели',
            categories: 'Категории',
            login: 'Войти',
        },
        en: {
            site: 'ModelHub',
            models: 'Models',
            categories: 'Categories',
            login: 'Sign in',
        }
    }[lang];
    
    const [uploadOpen, setUploadOpen] = useState(false);
    const [authOpen, setAuthOpen] = useState(false);
    return (
        <>
        <header className="header">
            <div style={{width:'100%',maxWidth:'1684px',margin:'0 auto',display:'flex',justifyContent:'space-between',alignItems:'center',padding:'0 32px',height:'88px'}}>
                <div style={{display:'flex',gap:'24px',alignItems:'center'}}>
                    <h1>{t.site}</h1>
                    <nav>
                        <Link href="/models" legacyBehavior>
                            <a
                                className="duration-[cubic-bezier(0.2,0,0.5,1)] text-white transition-[0.3s] hover:text-rose-500"
                            >
                                {t.models}
                            </a>
                        </Link>
                        <a
                            href="/"
                            className="duration-[cubic-bezier(0.2,0,0.5,1)] text-white transition-[0.3s] hover:text-rose-500"
                        >
                            {t.categories}
                        </a>
                    </nav>
                </div>
                <div className="header-actions">
                    <button className="upload-btn" aria-label={lang === 'ru' ? 'Загрузить Модель' : 'Upload Model'} onClick={() => setUploadOpen(true)}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10 2V14" stroke="black" strokeWidth="2" strokeLinecap="round"/>
                          <path d="M5 9L10 14L15 9" stroke="black" strokeWidth="2" strokeLinecap="round"/>
                          <rect x="3" y="16" width="14" height="2" rx="1" fill="black"/>
                        </svg>
                    </button>
                    <UploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} />
                    <button className="favorite-btn" aria-label={lang === 'ru' ? 'Избранное' : 'Favorites'} onClick={() => window.location.href = '/favorites'}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10 17.5L8.55 16.175C4.4 12.425 1.66667 10.025 1.66667 7.29167C1.66667 5.00833 3.50833 3.16667 5.79167 3.16667C7.025 3.16667 8.20833 3.775 9 4.7C9.79167 3.775 10.975 3.16667 12.2083 3.16667C14.4917 3.16667 16.3333 5.00833 16.3333 7.29167C16.3333 10.025 13.6 12.425 9.45 16.1833L10 17.5Z" fill="none" stroke="black" strokeWidth="2"/>
                        </svg>
                    </button>
                    {!user ? (
                        <button className="header-btn bw-btn" onClick={() => setAuthOpen(true)}>
                            {t.login}
                        </button>
                    ) : (
                        <UserAvatar avatarUrl={avatarUrl} email={user.email} />
                    )}
                    <div style={{display:'flex',gap:'10px',alignItems:'center'}}>
                        <button
                            className="lang-switch-btn bw-btn"
                            onClick={() => setLang(lang === 'ru' ? 'en' : 'ru')}
                            aria-label="Switch language"
                        >
                            {lang === 'ru' ? 'RU' : 'EN'}
                        </button>
                        <button
                            className="theme-switch-btn"
                            onClick={toggleTheme}
                            aria-label="Switch theme"
                        >
                            {theme === 'light' ? '☀️' : '🌙'}
                        </button>
                    </div>
                </div>
            </div>
        </header>
        <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
        </>
    );
};
