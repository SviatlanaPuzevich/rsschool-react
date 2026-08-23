import styles from "./main.layout.module.css";
import { Providers } from '@/app/providers';
import Header from '@/components/header/Header';



export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
        <Providers>
          <Header />
          <div className={styles.layout}>
            <aside />
            <main>
              {children}
            </main>
            <aside />
          </div>
        </Providers>
  );
}
