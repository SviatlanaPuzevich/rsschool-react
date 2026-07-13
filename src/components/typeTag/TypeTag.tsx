import { Component } from 'react';
import styles from './type.tag.module.css';

interface TypeTagProps {
  type: string;
}

export class TypeTag extends Component<TypeTagProps> {
  render() {
    const { type } = this.props;

    return (
      <span className={`${styles.tag} ${styles[type] || ''}`}>{type}</span>
    );
  }
}

export default TypeTag;
