'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import img from '@/assets/imgs/Gemini_Generated_NOT_FOUND.png';
import styles from '@/app/styles/not.found.page.module.css';
import Button from '@/components/button/Button';
import { useRouter } from '@/i18n/routing';

const NotFoundPage = () => {
  const router = useRouter();
  const t = useTranslations('NotFound');

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <Image src={img} alt={t('imageAlt')} className={styles.img} />
        <Button
          text={t('backHome')}
          onClick={() => router.push('/search')}
          buttonType="rainbow"
        />
      </div>
    </main>
  );
};

export default NotFoundPage;
