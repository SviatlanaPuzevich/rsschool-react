import React from 'react';
import styles from './button.module.css';

interface Props {
  value: string;
  onClick: () => void;
  buttonType: ButtonType;
}

type ButtonType = 'primary' | 'success' | 'warning' | 'danger';

class Button extends React.Component<Props> {
  render() {
    return (
      <button
        onClick={this.props.onClick}
        className={`${styles.button} ${styles[this.props.buttonType]}`}
      >
        {this.props.value}{' '}
      </button>
    );
  }
}

export default Button;
