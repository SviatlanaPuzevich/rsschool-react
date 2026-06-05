import Button from '../../components/button/Button.tsx';
import img from '../../assets/imgs/Gemini_Generated_NOT_FOUND.png';
import img_dark from '../../assets/imgs/Gemini_Generated_NOT_FOUND_dark.png';
import styles from './not.found.page.module.css';
import { useNavigate } from 'react-router-dom';
import { BASE_ROUTE, SEARCH } from '../../constants/routing.ts';
import { useTheme } from '../../hooks/useTheme.ts';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const { theme} = useTheme();
  return (
    <div className={styles.container}>
      <img src={theme === "light" ? img : img_dark} alt="Resourece not found" className={styles.img} />
      <Button
        value="Return to home"
        onClick={() => {
          navigate(`${BASE_ROUTE}${SEARCH}/1`);
        }}
        buttonType="rainbow"
      />
    </div>
  );
};

export default NotFoundPage;
