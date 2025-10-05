import { useCallback, useMemo, useState } from 'react';

import {
  type Errors,
  type FormState,
  type Mode,
  initialForm,
  validateForm,
} from 'features/auth/utils/validators.ts';

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
      setForm((state) => ({ ...state, [key]: val }));
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
        setTouched((prevTouched) => {
          const next = { ...prevTouched };
          (Object.keys(errors) as (keyof FormState)[]).forEach((fieldName) => {
            if (errors[fieldName]) next[fieldName as string] = true;
          });
          return next;
        });
        return;
      }
      setLoading(true);
      setNotice(undefined);
      await new Promise((r) => setTimeout(r, 600));
      setLoading(false);
      setNotice({
        type: 'ok',
        msg: mode === 'login' ? 'Вхід успішний.' : 'Реєстрація успішна.',
      });
      if (mode === 'register') reset();
    },
    [hasErrors, errors, mode],
  );

  return { form, setField, onBlur, invalid, errors, loading, notice, submit, reset, setNotice };
};
