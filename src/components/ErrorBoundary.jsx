import React from "react";

/**
 * Catches render-time errors anywhere below it so one broken component
 * (e.g. malformed policy data, a bad regex match) doesn't blank the whole
 * screen. Class component because error boundaries require it — there's
 * no hook equivalent for componentDidCatch / getDerivedStateFromError.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught an error:", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback" role="alert">
          <div className="error-fallback-icon">⚠️</div>
          <h2>Something went wrong</h2>
          <p>Don't worry, your data is safe. Try reloading this section.</p>
          <button onClick={this.handleReset} className="error-fallback-btn">
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
