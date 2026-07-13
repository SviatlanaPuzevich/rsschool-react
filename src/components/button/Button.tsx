import React from 'react';
import styles from './button.module.css';

interface Props {
  text: string;
  onClick: () => void;
  buttonType: ButtonType;
  ariaLabel?: string;
  className?: string;
}

type ButtonType = 'primary' | 'success' | 'warning' | 'danger' | 'default';

class Button extends React.Component<Props> {
  render() {
    return (
      <button
        onClick={this.props.onClick}
        className={
          this.props.className
            ? `${styles.button} ${this.props.className}`
            : `${styles.button} ${styles[this.props.buttonType]}`
        }
        aria-label={this.props.ariaLabel}
      >
        {this.props.text}
      </button>
    );
  }
}

export default Button;
