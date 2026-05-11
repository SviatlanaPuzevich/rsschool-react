import React from 'react';
import styles from './error.module.css';

interface Props {
  show: boolean;
  message?: string;
  onClose: () => void;
}

class Alert extends React.Component<Props> {
  render() {
    const { message = 'Something went wrong', show, onClose } = this.props;
    if (!show) return null;

    return (
      <div className={`${styles.alert} ${styles['alert--error']}`}>
        <div className={styles.alert__content}>{message}</div>
        <button
          className={styles.alert__close}
          onClick={onClose}
          aria-label="Close alert"
        >
          ×
        </button>
      </div>
    );
  }
}

export default Alert;
