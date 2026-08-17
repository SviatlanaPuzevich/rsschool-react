'use client';

import Button from '../components/button/Button';
import img from '../assets/imgs/Gemini_Generated_NOT_FOUND.png';
import styles from './styles/not.found.page.module.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const NotFoundPage = () => {
  const router = useRouter();
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <Image src={img} alt="Resourece not found" className={styles.img} />
        <Button
          text="Return to home"
          onClick={() => {
            router.push('/search');
          }}
          buttonType="rainbow"
        />
      </div>
    </main>
  );
};

export default NotFoundPage;
