import Image from 'next/image';
import Link from 'next/link';
import img from '@/assets/imgs/Gemini_Generated_NOT_FOUND.png';
import styles from './styles/not.found.page.module.css';
import { fontVariables } from '@/app/fonts';
import { routing } from '@/i18n/routing';

/**
 * Global fallback for routes that do not match a locale segment. It renders
 * `<html>`/`<body>` itself, because the root layout is only a pass-through.
 */
const GlobalNotFoundPage = () => (
  <html lang={routing.defaultLocale} className={fontVariables}>
    <body>
      <main className={styles.main}>
        <div className={styles.container}>
          <Image src={img} alt="Resource not found" className={styles.img} />
          <Link href={`/${routing.defaultLocale}/search`}>Return to home</Link>
        </div>
      </main>
    </body>
  </html>
);

export default GlobalNotFoundPage;
