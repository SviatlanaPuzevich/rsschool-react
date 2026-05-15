import styles from './main.layout.module.css';
import { Outlet} from 'react-router-dom';
import Header from "../../components/header/Header.tsx";

const MainLayout = () => {
  return (
      <>
      <Header />
    <div className={styles.layout}>
      <aside/>
      <main>
        <Outlet />
      </main>
      <aside/>
    </div>
      </>
  );
};

export default MainLayout;
