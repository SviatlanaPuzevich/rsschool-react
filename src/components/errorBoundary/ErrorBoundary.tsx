import React, { type ErrorInfo, type ReactNode } from 'react';
import Button from '../button/Button.tsx';
import styles from './error.boundary.module.css';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.container}>
          <p>
            Here is test for error boundary. Instead of pokemon items you can
            see this text. Reload page to continue
          </p>
          <Button
            text="Back to application"
            onClick={() => window.location.reload()}
            buttonType="primary"
          />
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
