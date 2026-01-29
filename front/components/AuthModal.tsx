import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal animated-modal">
        <button className="auth-modal-close" onClick={onClose} aria-label="Закрыть">×</button>
        <h2 className="auth-modal-title" style={{color:'#181818'}}>{mode === 'login' ? 'Войти в профиль' : 'Регистрация'}</h2>
        <form
          className="auth-modal-form"
          onSubmit={async e => {
            e.preventDefault();
            if (mode === 'register') {
              if (password !== repeatPassword) {
                alert('Пароли не совпадают');
                return;
              }
              const { error } = await supabase.auth.signUp({ email, password });
              if (error) {
                alert('Ошибка регистрации: ' + error.message);
              } else {
                alert('Проверьте почту для подтверждения!');
                onClose();
              }
            } else {
              const { error } = await supabase.auth.signInWithPassword({ email, password });
              if (error) {
                alert('Ошибка входа: ' + error.message);
              } else {
                alert('Успешный вход!');
                onClose();
              }
            }
          }}
        >
          <input
            type="email"
            placeholder="Электронная почта"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="auth-modal-input"
            autoComplete="email"
          />
          <div className="auth-modal-password-row">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Пароль"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="auth-modal-input"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
            <button
              type="button"
              className={"auth-modal-eye" + (showPassword ? " eye-open" : " eye-closed")}
              tabIndex={-1}
              onClick={() => setShowPassword(v => !v)}
              aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
            >
              {/* Открытый глаз */}
              <svg
                className={"eye-svg eye-svg-open" + (showPassword ? " eye-svg-visible" : "")}
                width="22" height="22" fill="none" viewBox="0 0 22 22"
              >
                <ellipse cx="11" cy="11" rx="8" ry="5" stroke="#888" strokeWidth="2"/>
                <circle cx="11" cy="11" r="2.5" fill="#888"/>
              </svg>
              {/* Закрытый глаз (с линией) */}
              <svg
                className={"eye-svg eye-svg-closed" + (!showPassword ? " eye-svg-visible" : "")}
                width="22" height="22" fill="none" viewBox="0 0 22 22"
              >
                <ellipse cx="11" cy="11" rx="8" ry="5" stroke="#888" strokeWidth="2"/>
                <circle cx="11" cy="11" r="2.5" fill="#888"/>
                <line x1="5" y1="17" x2="17" y2="5" stroke="#e94e77" strokeWidth="2.2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
          {mode === 'register' && (
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Повторите пароль"
              value={repeatPassword}
              onChange={e => setRepeatPassword(e.target.value)}
              required
              className="auth-modal-input"
              autoComplete="new-password"
            />
          )}
          {mode === 'login' && (
            <div className="auth-modal-links-row">
              <a href="#" className="auth-modal-link">Забыли пароль?</a>
            </div>
          )}
          <button type="submit" className="auth-modal-btn auth-modal-btn-main">
            {mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </form>
        <div className="auth-modal-footer">
          {mode === 'login' ? (
            <>
              Нет аккаунта?{' '}
              <button className="auth-modal-link-btn" onClick={() => setMode('register')}>Регистрация</button>
            </>
          ) : (
            <>
              Уже есть аккаунт?{' '}
              <button className="auth-modal-link-btn" onClick={() => setMode('login')}>Войти</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
