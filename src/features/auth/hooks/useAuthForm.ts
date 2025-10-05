import { useCallback, useMemo, useState } from 'react';
import {
  type Errors,
  type FormState,
  initialForm,
  type Mode,
  validateForm,
} from 'features/auth/utils/validators.ts';
import { clearTokens, getMe, login } from 'features/auth/api/auth.ts';

type Notice = { type: 'ok' | 'err'; msg: string } | undefined;

export const useAuthForm = (mode: Mode) => {
  const [form, setForm] = useState<FormState>(initialForm);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<Notice>();

  const errors: Errors = useMemo(() => validateForm(form, mode), [form, mode]);
  const hasErrors = useMemo(() => Object.values(errors).some(Boolean), [errors]);

  const setField =
    <K extends keyof FormState>(key: K) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setForm((formState) => ({ ...formState, [key]: val }));
    };

  const onBlur = (key: keyof FormState) => () => setTouched((t) => ({ ...t, [key]: true }));

  const invalid = {
    email: !!touched.email && !!errors.email,
    password: !!touched.password && !!errors.password,
    repeatPassword: !!touched.repeatPassword && !!errors.repeatPassword,
    fullName: !!touched.fullName && !!errors.fullName,
  };

  const reset = () => {
    setForm(initialForm);
    setTouched({});
    setNotice(undefined);
  };

  const submit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (hasErrors) {
        setTouched((t) => {
          const next = { ...t };
          (Object.keys(errors) as (keyof FormState)[]).forEach((k) => {
            if (errors[k]) next[k as string] = true;
          });
          return next;
        });
        return;
      }

      setLoading(true);
      setNotice(undefined);

      try {
        if (mode === 'login') {
          await login(form.email, form.password);
          let meEmail = '';
          try {
            const me = await getMe<{ email?: string }>();
            meEmail = me?.email ?? '';
          } catch {
            /* якщо /users/me недоступний — не валимо flow */
          }
          setNotice({
            type: 'ok',
            msg: meEmail ? `Вхід успішний. Вітаємо, ${meEmail}!` : 'Вхід успішний.',
          });
        } else {
          setNotice({
            type: 'err',
            msg: 'Реєстрація тимчасово недоступна: немає ендпойнта /auth/register на бекенді.',
          });
        }
      } catch {
        clearTokens();
        setNotice({ type: 'err', msg: 'Невірний логін, або пароль' });
      } finally {
        setLoading(false);
      }
    },
    [errors, form.email, form.password, hasErrors, mode],
  );

  return { form, setField, onBlur, invalid, errors, loading, notice, submit, reset, setNotice };
};
