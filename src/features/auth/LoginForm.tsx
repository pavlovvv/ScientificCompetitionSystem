import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from 'features/auth/AuthForm.module.scss';
import { useAuthForm } from 'features/auth/hooks/useAuthForm.ts';
import PasswordInput from 'ui/inputs/PasswordInput.tsx';

const LoginForm: React.FC = () => {
  const { form, setField, onBlur, invalid, errors, loading, notice, submit } = useAuthForm('login');

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Система конкурсу НПП — Вхід</h1>
          <div className={styles.segment}>
            <NavLink
              to="/auth/login"
              className={({ isActive }) => `${styles.segmentBtn} ${isActive ? styles.active : ''}`}
            >
              Увійти
            </NavLink>
            <NavLink
              to="/auth/register"
              className={({ isActive }) => `${styles.segmentBtn} ${isActive ? styles.active : ''}`}
            >
              Реєстрація
            </NavLink>
          </div>
        </div>

        {notice && (
          <div className={`${styles.notice} ${styles.noticeOk}`} role="status">
            {notice.msg}
          </div>
        )}

        <form className={styles.form} onSubmit={submit} noValidate>
          <div className={styles.field}>
            <label htmlFor="email">Е-пошта</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="name@university.edu"
              value={form.email}
              onChange={setField('email')}
              onBlur={onBlur('email')}
              aria-invalid={invalid.email}
              autoComplete="email"
            />
            {invalid.email && <p className={styles.error}>{errors.email}</p>}
          </div>

          <div className={styles.field}>
            <label htmlFor="password">Пароль</label>
            <PasswordInput
              id="password"
              value={form.password}
              onChange={setField('password')}
              onBlur={onBlur('password')}
              ariaInvalid={invalid.password}
              placeholder="Мінімум 8 символів"
              autoComplete="current-password"
            />
            {invalid.password && <p className={styles.error}>{errors.password}</p>}
          </div>

          <button type="submit" className={styles.primaryBtn} disabled={loading}>
            {loading ? 'Зачекайте…' : 'Увійти'}
          </button>

          <p className={styles.hint}>
            Немає акаунта?{' '}
            <NavLink className={styles.linkBtn} to="/auth/register">
              Зареєструватися
            </NavLink>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
