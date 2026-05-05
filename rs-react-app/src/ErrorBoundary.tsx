import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          Here is test for error boundary. Instead of pokemon items you can this
          text. Reload page to continue
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
