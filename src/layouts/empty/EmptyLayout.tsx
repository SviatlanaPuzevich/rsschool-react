import styles from './empty.layout.module.css';
import { Outlet } from 'react-router-dom';

const EmptyLayout = () => {
  return (
    <main className={styles.main}>
      <Outlet />
    </main>
  );
};

export default EmptyLayout;
