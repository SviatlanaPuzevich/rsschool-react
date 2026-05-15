import styles from './error.module.css';
import { useState } from 'react';

interface Props {
  message: string | null;
}

const Alert = ({ message }: Props) => {
  const [close, setClose] = useState<boolean>(false);

  if (message === null || close) return null;

  return (
    <div className={`${styles.alert} ${styles['alert--error']}`}>
      <div className={styles.alert__content}>{message}</div>
      <button
        className={styles.alert__close}
        onClick={() => setClose(true)}
        aria-label="Close alert"
      >
        ×
      </button>
    </div>
  );
};

export default Alert;
