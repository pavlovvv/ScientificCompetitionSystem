import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from 'features/auth/AuthForm.module.scss';
import { useAuthForm } from 'features/auth/hooks/useAuthForm.ts';
import PasswordInput from 'ui/inputs/PasswordInput.tsx';

const RegisterForm: React.FC = () => {
  const { form, setField, onBlur, invalid, errors, loading, notice, submit } =
    useAuthForm('register');

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Система конкурсу НПП — Реєстрація</h1>
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
            <label htmlFor="fullName">ПІБ</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Напр., Іваненко Іван Іванович"
              value={form.fullName}
              onChange={setField('fullName')}
              onBlur={onBlur('fullName')}
              aria-invalid={invalid.fullName}
            />
            {invalid.fullName && <p className={styles.error}>{errors.fullName}</p>}
          </div>

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
              autoComplete="new-password"
            />
            {invalid.password && <p className={styles.error}>{errors.password}</p>}
          </div>

          <div className={styles.field}>
            <label htmlFor="repeatPassword">Повтор пароля</label>
            <PasswordInput
              id="repeatPassword"
              value={form.repeatPassword}
              onChange={setField('repeatPassword')}
              onBlur={onBlur('repeatPassword')}
              ariaInvalid={invalid.repeatPassword}
              placeholder="Повторіть пароль"
              autoComplete="new-password"
            />
            {invalid.repeatPassword && <p className={styles.error}>{errors.repeatPassword}</p>}
          </div>

          <button type="submit" className={styles.primaryBtn} disabled={loading}>
            {loading ? 'Зачекайте…' : 'Зареєструватися'}
          </button>

          <p className={styles.hint}>
            Вже маєте акаунт?{' '}
            <NavLink className={styles.linkBtn} to="/auth/login">
              Увійти
            </NavLink>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
