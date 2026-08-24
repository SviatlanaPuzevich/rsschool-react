'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Button from '@/components/button/Button';
import styles from '@/components/errorBoundary/error.boundary.module.css';

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

const SiteError = ({ error, reset }: Props) => {
  const t = useTranslations('Errors');

  useEffect(() => {
    console.error('Uncaught error:', error);
  }, [error]);

  return (
    <div className={styles.container}>
      <p>{t('boundary')}</p>
      <Button text={t('backToApp')} onClick={reset} buttonType="primary" />
    </div>
  );
};

export default SiteError;
