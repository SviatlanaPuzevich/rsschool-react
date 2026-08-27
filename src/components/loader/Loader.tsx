import styles from './loader.module.css';
import { useTranslations } from 'next-intl';

const Loader = () => {
  const t = useTranslations('Search');

  return <p className={styles.loader}>{t('loading')}</p>;
};

export default Loader;
