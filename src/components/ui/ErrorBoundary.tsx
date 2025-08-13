import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { useDarkMode } from "@/contexts/DarkModeContext";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundaryClass extends Component<Props & { isDarkMode: boolean }, State> {
  constructor(props: Props & { isDarkMode: boolean }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          className={`rounded-3xl p-6 transition-all duration-500 ${
            this.props.isDarkMode
              ? "bg-slate-900/50 backdrop-blur-xl border border-slate-800/50"
              : "bg-white/80 backdrop-blur-xl border border-gray-200/50"
          }`}
        >
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertTriangle className="w-12 h-12 mb-4 text-red-500" />
            <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
            <p className="text-sm opacity-75 mb-4">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: undefined })}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                this.props.isDarkMode
                  ? "bg-slate-800 text-white hover:bg-slate-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Wrapper component to use the hook
export const ErrorBoundary: React.FC<Props> = ({ children, fallback }) => {
  const { isDarkMode } = useDarkMode();
  
  return (
    <ErrorBoundaryClass isDarkMode={isDarkMode} fallback={fallback}>
      {children}
    </ErrorBoundaryClass>
  );
};
