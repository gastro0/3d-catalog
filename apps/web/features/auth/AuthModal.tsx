import { FormEvent, useEffect, useState } from 'react';
import { useAuth } from '../../providers/AuthProvider';
import { usePreferences } from '../../providers/PreferencesProvider';
import { getSupabase, supabase } from '../../lib/supabase';
import { errorMessage } from '../../lib/api';
import { Modal } from '../../components/ui/Modal';

export function AuthModal() {
  const { authOpen, closeAuth } = useAuth();
  const { t } = usePreferences();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeat, setRepeat] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  useEffect(() => {
    if (!authOpen) {
      setPassword('');
      setRepeat('');
      setError('');
      setMessage('');
    }
  }, [authOpen]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setMessage('');
    if (mode === 'register' && password !== repeat) {
      setError(t('Пароли не совпадают.', 'Passwords do not match.'));
      return;
    }
    setBusy(true);
    try {
      const client = getSupabase();
      const result =
        mode === 'login'
          ? await client.auth.signInWithPassword({ email, password })
          : await client.auth.signUp({ email, password });
      if (result.error) throw result.error;
      if (mode === 'register' && !result.data.session) {
        setMessage(
          t(
            'Проверьте почту: мы отправили ссылку для подтверждения.',
            'Check your email for a confirmation link.',
          ),
        );
      } else closeAuth();
    } catch (error) {
      setError(errorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal
      open={authOpen}
      onClose={closeAuth}
      title={
        mode === 'login'
          ? t('С возвращением', 'Welcome back')
          : t('Создайте аккаунт', 'Create an account')
      }
    >
      <p className="muted">
        {t(
          'Сохраняйте вдохновение и делитесь своими моделями.',
          'Save inspiration and share your models.',
        )}
      </p>
      {!supabase && (
        <p className="notice" role="status">
          {t(
            'Вход пока недоступен. Каталог можно смотреть без аккаунта.',
            'Sign in is currently unavailable. You can browse without an account.',
          )}
        </p>
      )}
      <form className="form-stack" onSubmit={submit}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
            maxLength={254}
          />
        </label>
        <label>
          {t('Пароль', 'Password')}
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete={
              mode === 'login' ? 'current-password' : 'new-password'
            }
            minLength={6}
            required
          />
        </label>
        {mode === 'register' && (
          <label>
            {t('Повторите пароль', 'Repeat password')}
            <input
              type={showPassword ? 'text' : 'password'}
              value={repeat}
              onChange={(event) => setRepeat(event.target.value)}
              autoComplete="new-password"
              minLength={6}
              required
            />
          </label>
        )}
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={(event) => setShowPassword(event.target.checked)}
          />
          {t('Показать пароль', 'Show password')}
        </label>
        {error && (
          <p className="notice notice-error" role="alert">
            {error}
          </p>
        )}
        {message && (
          <p className="notice" role="status">
            {message}
          </p>
        )}
        <button className="button" disabled={busy || !supabase}>
          {busy
            ? t('Подождите…', 'Please wait…')
            : mode === 'login'
            ? t('Войти', 'Sign in')
            : t('Зарегистрироваться', 'Sign up')}
        </button>
      </form>
      <p className="auth-switch">
        {mode === 'login'
          ? t('Впервые здесь?', 'New here?')
          : t('Уже есть аккаунт?', 'Already have an account?')}{' '}
        <button
          className="text-button"
          onClick={() => {
            setMode(mode === 'login' ? 'register' : 'login');
            setError('');
            setMessage('');
          }}
        >
          {mode === 'login'
            ? t('Создать аккаунт', 'Create an account')
            : t('Войти', 'Sign in')}
        </button>
      </p>
    </Modal>
  );
}
