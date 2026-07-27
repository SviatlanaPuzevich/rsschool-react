import React from 'react';
import styles from './type.tag.module.css';

interface TypeTagProps {
  type: string;
}

export const TypeTag: React.FC<TypeTagProps> = ({ type }) => {
  return <span className={`${styles.tag} ${styles[type] || ''}`}>{type}</span>;
};

export default TypeTag;
