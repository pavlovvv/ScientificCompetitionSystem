import React, { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

import { styles } from 'ui/imports.ts';

type Props = {
  id: string;
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  ariaInvalid?: boolean;
  autoComplete?: string;
};

const PasswordInput: React.FC<Props> = ({
  id,
  value,
  placeholder,
  onChange,
  onBlur,
  ariaInvalid,
  autoComplete,
}) => {
  const [show, setShow] = useState(false);

  return (
    <div className={styles.passwordWrap}>
      <input
        id={id}
        name={id}
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        aria-invalid={ariaInvalid}
        autoComplete={autoComplete}
      />
      <button
        type="button"
        className={styles.eyeBtn}
        onClick={() => setShow((s) => !s)}
        aria-label={show ? 'Сховати пароль' : 'Показати пароль'}
        title={show ? 'Сховати пароль' : 'Показати пароль'}
      >
        {show ? <FiEyeOff /> : <FiEye />}
      </button>
    </div>
  );
};

export default PasswordInput;
