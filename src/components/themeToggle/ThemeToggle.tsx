import { useTheme } from '../../hooks/useTheme';
import styles from './themeToggle.module.css';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button className={styles.toggle} onClick={toggleTheme}>
      {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
};

export default ThemeToggle;
