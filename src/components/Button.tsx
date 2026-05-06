import React from 'react';
import styles from './search.bar.module.css';

interface Props {
  value: string;
  onClick: () => void;
}

class Button extends React.Component<Props> {
  render() {
    return (
      <button onClick={this.props.onClick} className={styles.button}>
        {this.props.value}{' '}
      </button>
    );
  }
}

export default Button;
