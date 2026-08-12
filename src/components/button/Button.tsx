import React from 'react';
import styles from './button.module.css';

type ButtonType =
  | 'primary'
  | 'rainbow'
  | 'success'
  | 'warning'
  | 'danger'
  | 'default';

interface Props {
  text: string;
  onClick: () => void;
  buttonType: ButtonType;
  ariaLabel?: string;
  className?: string;
  disabled?: boolean;
}

const Button: React.FC<Props> = ({
  text,
  onClick,
  buttonType,
  ariaLabel,
  className,
  disabled,
}) => {
  const buttonClass = className
    ? `${styles.button} ${className}`
    : `${styles.button} ${styles[buttonType]}`;

  return (
    <button
      onClick={onClick}
      className={buttonClass}
      aria-label={ariaLabel}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default Button;
