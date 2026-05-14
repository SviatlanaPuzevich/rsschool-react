import Button from '../../components/button/Button.tsx';
import img from '../../assets/imgs/Gemini_Generated_NOT_FOUND.png';
import styles from './not.found.page.module.css';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <img src={img} alt="Resourece not found" className={styles.img} />
      <Button
        value="Return to home"
        onClick={() => {
          navigate('/');
        }}
        buttonType="rainbow"
      />
    </div>
  );
};

export default NotFoundPage;
