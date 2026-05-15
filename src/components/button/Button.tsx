import styles from './button.module.css';

interface Props {
  value?: string;
  onClick: () => void;
  buttonType: ButtonType;
}

type ButtonType = 'primary' | 'rainbow' | 'success' | 'warning' | 'danger';

const Button = ({ onClick, buttonType, value }: Props) => {
  return (
    <button
      onClick={onClick}
      className={
        value
          ? `${styles.button} ${styles[buttonType]}`
          : `${styles.button} ${styles.primary}`
      }
    >
      {value}
    </button>
  );
};

export default Button;
