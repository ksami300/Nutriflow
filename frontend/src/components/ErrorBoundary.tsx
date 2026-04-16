"use client";

import React, { ReactNode } from "react";
import { Card, CardBody } from "./Card";
import { Button } from "./Button";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 p-4">
          <Card variant="elevated" padded>
            <CardBody className="text-center space-y-6 max-w-md">
              <div className="text-5xl">⚠️</div>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-neutral-900">Something Went Wrong</h1>
                <p className="text-neutral-600">
                  {this.state.error?.message || "An unexpected error occurred. Please try again."}
                </p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left">
                <p className="text-xs font-mono text-red-700 overflow-auto max-h-32">
                  {this.state.error?.stack}
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="primary"
                  fullWidth
                  onClick={this.handleReset}
                >
                  Go Home
                </Button>
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
