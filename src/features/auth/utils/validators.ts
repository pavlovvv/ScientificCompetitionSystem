export type Mode = 'login' | 'register';

export type FormState = {
  email: string;
  password: string;
  repeatPassword: string;
  fullName: string;
};

export type Errors = Partial<Record<keyof FormState, string>>;

export const validateEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export const validateForm = (form: FormState, mode: Mode): Errors => {
  const errors: Errors = {};
  if (!form.email || !validateEmail(form.email)) {
    errors.email = 'Введіть коректну електронну адресу';
  }
  if (!form.password || form.password.length < 8) {
    errors.password = 'Мінімум 8 символів';
  }
  if (mode === 'register') {
    if (!form.fullName || form.fullName.trim().length < 2) {
      errors.fullName = 'Вкажіть ПІБ';
    }
    if (!form.repeatPassword) {
      errors.repeatPassword = 'Повторіть пароль';
    } else if (form.repeatPassword !== form.password) {
      errors.repeatPassword = 'Паролі не співпадають';
    }
  }
  return errors;
};

export const initialForm: FormState = {
  email: '',
  password: '',
  repeatPassword: '',
  fullName: '',
};
