import React, { type ErrorInfo, type ReactNode } from 'react';
import { ERROR_MESSAGE } from '../../constants/messages.ts';

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
      return <div>{ERROR_MESSAGE.BOUNDARY_ERROR}</div>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
