import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import styles from './error.module.css';
import Button from '../button/Button';

interface Props {
  show: boolean;
  message?: string;
}

const Alert: React.FC<Props> = ({ show, message }) => {
  const t = useTranslations('Errors');
  const [state, setState] = useState({
    isVisible: show,
    prevShow: show,
  });

  if (show !== state.prevShow) {
    setState({
      isVisible: show,
      prevShow: show,
    });
  }

  const handleClose = (): void => {
    setState((prev) => ({ ...prev, isVisible: false }));
  };

  if (!state.isVisible) return null;

  return (
    <div className={`${styles.alert}`}>
      <div className={styles.alert__content}>{message ?? t('generic')}</div>
      <Button
        text="×"
        buttonType="default"
        onClick={handleClose}
        ariaLabel={t('closeAlert')}
        className={styles.alert__close}
      />
    </div>
  );
};

export default Alert;
