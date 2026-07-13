import React from 'react';
import styles from './error.module.css';
import Button from '../button/Button.tsx';

interface Props {
  show: boolean;
  message?: string;
}

interface State {
  isVisible: boolean;
}

class Alert extends React.Component<Props, State> {
  state: State = {
    isVisible: this.props.show,
  };

  handleClose = () => {
    this.setState({ isVisible: false });
  };

  render() {
    const { message = 'Something went wrong' } = this.props;
    const { isVisible } = this.state;

    if (!isVisible) return null;

    return (
      <div className={`${styles.alert} ${styles['alert--error']}`}>
        <div className={styles.alert__content}>{message}</div>
        <Button
          text="×"
          buttonType="default"
          onClick={this.handleClose}
          ariaLabel="Close alert"
          className={styles.alert__close}
        />
      </div>
    );
  }
}

export default Alert;
