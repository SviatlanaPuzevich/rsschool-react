import styles from './loader.module.css';
import { useTranslations } from 'use-intl';

const Loader = () => {
  const t = useTranslations('HomePage');
  return <p className={styles.loader}>{t('loading')}</p>;
};

export default Loader;
