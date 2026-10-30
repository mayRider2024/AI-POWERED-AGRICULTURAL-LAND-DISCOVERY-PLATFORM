import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('LandLens AI ErrorBoundary caught an unhandled exception:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/home';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[100dvh] w-full bg-[#FFF3E3] flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-white rounded-2xl border border-[#E0C7AD] p-6 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 mx-auto">
              <AlertCircle size={26} />
            </div>

            <div className="space-y-1">
              <h2 className="text-base font-bold text-[#25211E] font-heading">
                Something went wrong
              </h2>
              <p className="text-xs text-[#6B5E54] leading-relaxed">
                An unexpected interface error occurred. You can reload this view or return to the main dashboard.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="p-3 bg-[#FFF8F0] border border-[#E0C7AD] rounded-xl text-[11px] font-mono text-left text-[#C54E12] break-all overflow-x-auto max-h-24">
                {this.state.error.message}
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="flex-1 py-2.5 px-3 rounded-xl border border-[#D5C2B0] bg-[#FFF8F0] hover:bg-[#FFE8D1] text-xs font-bold text-[#6B5E54] flex items-center justify-center gap-1.5 transition-all"
              >
                <RotateCcw size={14} />
                <span>Reload</span>
              </button>
              <button
                type="button"
                onClick={this.handleGoHome}
                className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#E86A17] to-[#C54E12] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs hover:opacity-95 transition-all"
              >
                <Home size={14} />
                <span>Go to Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
