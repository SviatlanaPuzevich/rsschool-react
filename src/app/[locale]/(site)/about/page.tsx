import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import styles from './about.page.module.css';
import img from '@/assets/imgs/Gemini_Generated_About_Avatar.png';
import type { Locale } from '@/i18n/routing';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: 'Metadata',
  });

  return {
    title: t('aboutTitle'),
    description: t('aboutDescription'),
  };
}

const AboutPage = async ({ params }: Props) => {
  const { locale } = await params;

  // Keeps the page statically rendered per locale.
  setRequestLocale(locale as Locale);

  return <AboutContent />;
};

const AboutContent = () => {
  const t = useTranslations('About');

  const tags = {
    b: (chunks: React.ReactNode) => <b>{chunks}</b>,
    i: (chunks: React.ReactNode) => <i>{chunks}</i>,
    strong: (chunks: React.ReactNode) => <strong>{chunks}</strong>,
  };

  return (
    <div className={styles.container}>
      <Image src={img} alt={t('avatarAlt')} className={styles.avatar} />
      <div className={styles.info}>
        <p>{t('intro')}</p>
        <p>{t.rich('rest', tags)}</p>
        <p>{t.rich('senior', tags)}</p>
        <p>{t.rich('deadlines', tags)}</p>

        <h2>{t('techStack')}</h2>
        <dl>
          <dt>{t('languagesTerm')}</dt>
          <dd>{t('languagesValue')}</dd>

          <dt>{t('toolsTerm')}</dt>
          <dd>{t('toolsValue')}</dd>

          <dt>{t('statusTerm')}</dt>
          <dd>{t('statusValue')}</dd>
        </dl>
        <p>{t('outro')}</p>
      </div>
      <Link
        href="https://rs.school/"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.link}
      >
        {t('rsSchool')}
      </Link>
    </div>
  );
};

export default AboutPage;
